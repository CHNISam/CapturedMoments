const fs = require('fs');
const path = require('path');

module.exports = {
  devServer: {
    port: 8082,
    host: '0.0.0.0',
    allowedHosts: 'all',
    https: {
      key: fs.readFileSync('H:/programs/localhost-key.pem'),
      cert: fs.readFileSync('H:/programs/localhost.pem')
    }
  }
};
