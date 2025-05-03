const fs = require('fs');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development'; // 判断是不是开发环境

module.exports = {
  publicPath: isDev ? './' : '/CapturedMoments/', // ✅ 根据环境自动切换 publicPath

  devServer: isDev
    ? {
        port: 8082,
        host: '0.0.0.0',
        allowedHosts: 'all',
        historyApiFallback: true,
        https: false,
      }
    : {}
};
