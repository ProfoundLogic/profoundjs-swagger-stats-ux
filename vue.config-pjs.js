const path = require('path');
const http = require('http');
const webpack = require('webpack');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/wsapi/api-stats/ux',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/wsapi/api-stats/ux/stats': {
        target: 'http://localhost:8109/wsapi/api-stats/stats',
        // This enables keepalive via proxy
        // See https://github.com/http-party/node-http-proxy/issues/767
        agent: http.globalAgent
      },
      '/wsapi/api-stats/ux/logout': {
        target: 'http://localhost:8109/wsapi/api-stats/logout',
        agent: http.globalAgent
      }
    }
  },

  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    devtool: 'source-map'
  },

  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false,
      treeShake: true
    }
  },

  transpileDependencies: ['quasar']

};
