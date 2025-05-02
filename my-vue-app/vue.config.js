const fs = require('fs');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development'; // 判断是不是开发环境

module.exports = {
  publicPath: './',

  devServer: isDev
    ? {
        port: 8082,
        host: '0.0.0.0',
        allowedHosts: 'all',
        historyApiFallback: true, // ✅ 关键：支持前端路由刷新
        https: false, // 开发环境下，不使用 https
      }
    : {}
};
