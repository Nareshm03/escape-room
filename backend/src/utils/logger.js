/**
 * Centralized logging utility
 */

const formatTimestamp = () => {
  return new Date().toISOString();
};

const logger = {
  error: (moduleName, message, error, context = {}) => {
    const timestamp = formatTimestamp();
    console.error(`[${timestamp}] ERROR in ${moduleName}: ${message}`);
    
    if (error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        ...context
      });
    }
  },

  info: (moduleName, message, context = {}) => {
    const timestamp = formatTimestamp();
    console.log(`[${timestamp}] INFO in ${moduleName}: ${message}`, context);
  },

  warn: (moduleName, message, context = {}) => {
    const timestamp = formatTimestamp();
    console.warn(`[${timestamp}] WARN in ${moduleName}: ${message}`, context);
  },

  request: (req, additionalInfo = {}) => {
    const timestamp = formatTimestamp();
    console.log(`[${timestamp}] ${req.method} ${req.path}`, {
      query: req.query,
      body: sanitizeBody(req.body),
      ...additionalInfo
    });
  }
};

// Sanitize sensitive data from logs
const sanitizeBody = (body) => {
  if (!body) return {};
  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey'];
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });
  
  return sanitized;
};

module.exports = logger;
