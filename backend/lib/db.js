/**
 * MongoDB Atlas Connection Helper
 * Provides robust connection management with retry logic and event monitoring
 */

const mongoose = require('mongoose');

// Connection state cache
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * MongoDB connection options
 */
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
  bufferCommands: false,
  autoIndex: true,
};

/**
 * Exponential backoff retry configuration
 */
const retryConfig = {
  maxRetries: 5,
  initialDelay: 1000,
  maxDelay: 30000,
};

/**
 * Sleep utility for retry delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay
 * @param {number} attempt - Current retry attempt
 * @returns {number} Delay in milliseconds
 */
const getBackoffDelay = (attempt) => {
  const delay = retryConfig.initialDelay * Math.pow(2, attempt);
  return Math.min(delay, retryConfig.maxDelay);
};

/**
 * Setup connection event listeners
 */
const setupEventListeners = () => {
  mongoose.connection.on('connected', () => {
    console.log('✓ MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.error('✗ MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠ MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('↻ MongoDB reconnected');
  });
};

/**
 * Connect to MongoDB Atlas with retry logic
 * @param {number} attempt - Current retry attempt (internal use)
 * @returns {Promise<mongoose.Connection>} MongoDB connection instance
 * @throws {Error} If connection fails after all retries
 */
async function connectDB(attempt = 0) {
  // Validate environment variable
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  // Return existing connection if available
  if (cached.conn) {
    if (mongoose.connection.readyState === 1) {
      return cached.conn;
    }
  }

  // Return pending connection promise if exists
  if (cached.promise) {
    return cached.promise;
  }

  try {
    // Setup event listeners on first attempt
    if (attempt === 0) {
      setupEventListeners();
    }

    // Create new connection promise
    cached.promise = mongoose.connect(process.env.MONGODB_URI, options);
    cached.conn = await cached.promise;

    console.log(`✓ MongoDB connection established (attempt ${attempt + 1})`);
    return cached.conn;

  } catch (error) {
    cached.promise = null;

    // Retry logic with exponential backoff
    if (attempt < retryConfig.maxRetries) {
      const delay = getBackoffDelay(attempt);
      console.warn(`⚠ Connection attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
      await sleep(delay);
      return connectDB(attempt + 1);
    }

    // All retries exhausted
    console.error('✗ MongoDB connection failed after all retries');
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
}

/**
 * Get current connection status
 * @returns {Object} Connection status information
 */
function getConnectionStatus() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    state: states[mongoose.connection.readyState] || 'unknown',
    readyState: mongoose.connection.readyState,
    isConnected: mongoose.connection.readyState === 1,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
}

/**
 * Check connection health
 * @returns {Promise<boolean>} True if connection is healthy
 */
async function checkHealth() {
  try {
    if (mongoose.connection.readyState !== 1) {
      return false;
    }
    await mongoose.connection.db.admin().ping();
    return true;
  } catch (error) {
    console.error('Health check failed:', error.message);
    return false;
  }
}

/**
 * Gracefully close database connection
 * @returns {Promise<void>}
 */
async function closeConnection() {
  if (cached.conn) {
    await mongoose.connection.close();
    cached.conn = null;
    cached.promise = null;
    console.log('✓ MongoDB connection closed');
  }
}

/**
 * Get connection instance
 * @returns {mongoose.Connection|null} Current connection instance
 */
function getConnection() {
  return cached.conn;
}

// Export connection function as default
module.exports = connectDB;

// Export utility functions
module.exports.getConnectionStatus = getConnectionStatus;
module.exports.checkHealth = checkHealth;
module.exports.closeConnection = closeConnection;
module.exports.getConnection = getConnection;
