const app = require('../backend/src/server');
const connectDB = require('../backend/src/utils/mongodb');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
};
