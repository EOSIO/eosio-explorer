const proxy = require('http-proxy-middleware');

//In development mode, proxy API calls which request URI with prefix `/api` to a serve.js process running in background.
module.exports = function(app) {
  app.use(proxy('/api', { target: `http://localhost:${process.env.REACT_APP_UI_SERVE_PORT}/` }));
};
