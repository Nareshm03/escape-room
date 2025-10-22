// No authentication middleware needed - keeping file for compatibility
const noAuth = (req, res, next) => {
  next();
};

module.exports = { authenticateToken: noAuth };