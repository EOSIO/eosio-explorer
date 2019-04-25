/* config-overrides.js */
const util = require('util');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const rewireStyledComponents = require('react-app-rewire-styled-components');

module.exports = function override(config, env) {
  
  config = rewireStyledComponents(config, env);
  config.plugins.push(new MonacoWebpackPlugin({languages: ['cpp', 'json']}));

  // only do the overriding in production environment
  if ( process.env.NODE_ENV === "production" ){
    console.log('\x1b[31m%s\x1b[0m', 'Please be patient, creating the optimized production build may take a few minutes depending on your machine.');
  }

  return config;
}
