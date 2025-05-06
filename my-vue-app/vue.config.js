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

        // ✅ 关键配置：禁用 HMR & WebSocket 注入
        hot: false,
        liveReload: false,
        client: {
          overlay: false,
          webSocketURL: undefined, // 🚫 不要注入任何 ws://xxx 地址
        },
      }
    : {}
};
