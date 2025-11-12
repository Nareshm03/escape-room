const app = require('../backend/src/server');
const connectDB = require('../backend/src/utils/mongodb');

let isConnected = false;

const handler = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error('DB connection failed:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  return app(req, res);
};

module.exports = handler;
