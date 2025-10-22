const https = require('https');
const fs = require('fs');
const app = require('./server');

// HTTPS configuration for production
if (process.env.NODE_ENV === 'production') {
  const options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
  };

  const PORT = process.env.PORT || 5000;
  
  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
  });
} else {
  // Development server (HTTP)
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
  });
}