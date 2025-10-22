// Simple validation middleware - minimal functionality only
const basicValidation = (req, res, next) => {
  // Just pass through - no complex validation
  next();
};

module.exports = {
  basicValidation
};