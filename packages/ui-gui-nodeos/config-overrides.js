/* config-overrides.js */
const util = require('util')

module.exports = function override(config, env) {

  // only do the overriding in production environment
  if ( process.env.NODE_ENV === "production" ){

    //for dedug
    // console.log(util.inspect(config));
  }

  return config;
}
