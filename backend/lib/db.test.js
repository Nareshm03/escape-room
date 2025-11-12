/**
 * Unit tests for MongoDB connection helper
 */

const mongoose = require('mongoose');
const connectDB = require('./db');
const { getConnectionStatus, checkHealth, closeConnection, getConnection } = require('./db');

// Mock mongoose
jest.mock('mongoose');

describe('MongoDB Connection Helper', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = process.env.MONGODB_URI;
    jest.clearAllMocks();
    global.mongoose = { conn: null, promise: null };
  });

  afterEach(() => {
    process.env.MONGODB_URI = originalEnv;
  });

  describe('connectDB', () => {
    test('should throw error if MONGODB_URI is not defined', async () => {
      delete process.env.MONGODB_URI;
      await expect(connectDB()).rejects.toThrow('MONGODB_URI environment variable is not defined');
    });

    test('should establish connection successfully', async () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      const mockConnection = { readyState: 1 };
      
      mongoose.connect.mockResolvedValue(mockConnection);
      mongoose.connection = { readyState: 1, on: jest.fn() };

      const result = await connectDB();
      
      expect(mongoose.connect).toHaveBeenCalledWith(
        process.env.MONGODB_URI,
        expect.objectContaining({
          maxPoolSize: 10,
          minPoolSize: 2,
        })
      );
      expect(result).toBe(mockConnection);
    });

    test('should reuse existing connection', async () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      const mockConnection = { readyState: 1 };
      
      global.mongoose.conn = mockConnection;
      mongoose.connection = { readyState: 1 };

      const result = await connectDB();
      
      expect(mongoose.connect).not.toHaveBeenCalled();
      expect(result).toBe(mockConnection);
    });

    test('should retry on connection failure', async () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      
      mongoose.connect
        .mockRejectedValueOnce(new Error('Connection failed'))
        .mockResolvedValueOnce({ readyState: 1 });
      
      mongoose.connection = { readyState: 0, on: jest.fn() };

      jest.spyOn(global, 'setTimeout').mockImplementation((cb) => cb());

      const result = await connectDB();
      
      expect(mongoose.connect).toHaveBeenCalledTimes(2);
      expect(result).toBeDefined();
    });

    test('should fail after max retries', async () => {
      process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
      
      mongoose.connect.mockRejectedValue(new Error('Connection failed'));
      mongoose.connection = { readyState: 0, on: jest.fn() };

      jest.spyOn(global, 'setTimeout').mockImplementation((cb) => cb());

      await expect(connectDB()).rejects.toThrow('Failed to connect to MongoDB');
      expect(mongoose.connect).toHaveBeenCalledTimes(6); // Initial + 5 retries
    });
  });

  describe('getConnectionStatus', () => {
    test('should return disconnected status', () => {
      mongoose.connection = { readyState: 0, host: null, name: null };
      
      const status = getConnectionStatus();
      
      expect(status.state).toBe('disconnected');
      expect(status.isConnected).toBe(false);
      expect(status.readyState).toBe(0);
    });

    test('should return connected status', () => {
      mongoose.connection = { 
        readyState: 1, 
        host: 'localhost', 
        name: 'testdb' 
      };
      
      const status = getConnectionStatus();
      
      expect(status.state).toBe('connected');
      expect(status.isConnected).toBe(true);
      expect(status.host).toBe('localhost');
      expect(status.name).toBe('testdb');
    });
  });

  describe('checkHealth', () => {
    test('should return false if not connected', async () => {
      mongoose.connection = { readyState: 0 };
      
      const health = await checkHealth();
      
      expect(health).toBe(false);
    });

    test('should return true if ping succeeds', async () => {
      mongoose.connection = {
        readyState: 1,
        db: {
          admin: () => ({
            ping: jest.fn().mockResolvedValue(true)
          })
        }
      };
      
      const health = await checkHealth();
      
      expect(health).toBe(true);
    });

    test('should return false if ping fails', async () => {
      mongoose.connection = {
        readyState: 1,
        db: {
          admin: () => ({
            ping: jest.fn().mockRejectedValue(new Error('Ping failed'))
          })
        }
      };
      
      const health = await checkHealth();
      
      expect(health).toBe(false);
    });
  });

  describe('closeConnection', () => {
    test('should close connection if exists', async () => {
      const mockClose = jest.fn().mockResolvedValue(true);
      mongoose.connection = { close: mockClose };
      global.mongoose.conn = { readyState: 1 };

      await closeConnection();
      
      expect(mockClose).toHaveBeenCalled();
      expect(global.mongoose.conn).toBeNull();
      expect(global.mongoose.promise).toBeNull();
    });

    test('should do nothing if no connection exists', async () => {
      global.mongoose.conn = null;
      
      await expect(closeConnection()).resolves.not.toThrow();
    });
  });

  describe('getConnection', () => {
    test('should return current connection', () => {
      const mockConnection = { readyState: 1 };
      global.mongoose.conn = mockConnection;
      
      const conn = getConnection();
      
      expect(conn).toBe(mockConnection);
    });

    test('should return null if no connection', () => {
      global.mongoose.conn = null;
      
      const conn = getConnection();
      
      expect(conn).toBeNull();
    });
  });
});
