/* config-overrides.js */
const util = require('util');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = function override(config, env) {

  config.plugins.push(new MonacoWebpackPlugin({languages: ['cpp', 'json']}));

  // only do the overriding in production environment
  if ( process.env.NODE_ENV === "production" ){

    //for dedug
    // console.log(util.inspect(config));
  }

  return config;
}
