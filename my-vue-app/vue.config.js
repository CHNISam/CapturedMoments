const fs = require('fs');
const path = require('path');

module.exports = {
  // ✅ 設定 GitHub Pages 所需要的打包路徑
  publicPath: './',

  // ✅ 保留你本地開發的 HTTPS 設定
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
