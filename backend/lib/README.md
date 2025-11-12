# MongoDB Connection Helper

Robust MongoDB Atlas connection management with retry logic, event monitoring, and health checks.

## Features

- ✅ Connection reuse across API routes
- ✅ Exponential backoff retry logic (5 retries)
- ✅ Connection event monitoring
- ✅ Health check utilities
- ✅ Environment variable validation
- ✅ Production-ready error handling
- ✅ Comprehensive unit tests

## Installation

```bash
npm install mongoose
```

## Environment Variables

```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

## Usage

### Basic Connection

```javascript
const connectDB = require('./lib/db');

// Connect to database
async function main() {
  try {
    await connectDB();
    console.log('Database connected');
  } catch (error) {
    console.error('Connection failed:', error);
  }
}
```

### In API Routes

```javascript
const connectDB = require('./lib/db');

app.get('/api/users', async (req, res) => {
  try {
    await connectDB(); // Reuses existing connection
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Check Connection Status

```javascript
const { getConnectionStatus } = require('./lib/db');

const status = getConnectionStatus();
console.log(status);
// {
//   state: 'connected',
//   readyState: 1,
//   isConnected: true,
//   host: 'cluster.mongodb.net',
//   name: 'database'
// }
```

### Health Check

```javascript
const { checkHealth } = require('./lib/db');

const isHealthy = await checkHealth();
if (isHealthy) {
  console.log('Database is healthy');
}
```

### Close Connection

```javascript
const { closeConnection } = require('./lib/db');

// Graceful shutdown
process.on('SIGTERM', async () => {
  await closeConnection();
  process.exit(0);
});
```

## Configuration

### Connection Options

```javascript
{
  maxPoolSize: 10,        // Maximum connections in pool
  minPoolSize: 2,         // Minimum connections in pool
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,              // Use IPv4
  bufferCommands: false,  // Fail fast if not connected
  autoIndex: true         // Build indexes automatically
}
```

### Retry Configuration

```javascript
{
  maxRetries: 5,          // Maximum retry attempts
  initialDelay: 1000,     // Initial delay (1 second)
  maxDelay: 30000         // Maximum delay (30 seconds)
}
```

## Connection Events

The helper automatically logs:
- ✓ Connected
- ✗ Connection errors
- ⚠ Disconnected
- ↻ Reconnected

## API Reference

### `connectDB()`
Establishes connection to MongoDB with retry logic.

**Returns**: `Promise<mongoose.Connection>`

**Throws**: `Error` if connection fails after all retries

### `getConnectionStatus()`
Returns current connection status.

**Returns**: `Object`
```javascript
{
  state: string,        // 'connected' | 'disconnected' | 'connecting' | 'disconnecting'
  readyState: number,   // 0-3
  isConnected: boolean,
  host: string | null,
  name: string | null
}
```

### `checkHealth()`
Performs health check by pinging database.

**Returns**: `Promise<boolean>`

### `closeConnection()`
Gracefully closes database connection.

**Returns**: `Promise<void>`

### `getConnection()`
Returns current connection instance.

**Returns**: `mongoose.Connection | null`

## Testing

```bash
# Run tests
npm test lib/db.test.js

# Run with coverage
npm test -- --coverage lib/db.test.js
```

## Best Practices

1. **Environment Variables**: Always use environment variables for connection strings
2. **Connection Reuse**: Call `connectDB()` in each route - it reuses existing connections
3. **Error Handling**: Always wrap database operations in try-catch blocks
4. **Graceful Shutdown**: Close connections on process termination
5. **Health Checks**: Implement health check endpoints using `checkHealth()`

## Example: Express Server

```javascript
const express = require('express');
const connectDB = require('./lib/db');
const { closeConnection } = require('./lib/db');

const app = express();

// Connect on startup
connectDB()
  .then(() => console.log('Database ready'))
  .catch(err => {
    console.error('Failed to connect:', err);
    process.exit(1);
  });

// Health check endpoint
app.get('/health', async (req, res) => {
  const { checkHealth, getConnectionStatus } = require('./lib/db');
  const isHealthy = await checkHealth();
  const status = getConnectionStatus();
  
  res.json({
    database: isHealthy ? 'healthy' : 'unhealthy',
    ...status
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  await closeConnection();
  process.exit(0);
});

app.listen(3000);
```

## Troubleshooting

### Connection Timeout
- Check `MONGODB_URI` is correct
- Verify network connectivity
- Check MongoDB Atlas IP whitelist

### Connection Refused
- Ensure MongoDB Atlas cluster is running
- Verify credentials in connection string
- Check firewall settings

### Too Many Connections
- Reduce `maxPoolSize` in options
- Ensure connections are being reused
- Check for connection leaks

## Production Considerations

1. **Monitoring**: Integrate with monitoring tools (New Relic, DataDog)
2. **Logging**: Use structured logging (Winston, Bunyan)
3. **Metrics**: Track connection pool usage
4. **Alerts**: Set up alerts for connection failures
5. **Backup**: Implement regular database backups

## License

MIT
