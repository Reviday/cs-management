const proxy = require('http-proxy-middleware');
const configfile = require('../config.json');
const runmode = configfile.runmode;
const config = configfile[runmode];

module.exports = function (app) {

  const API_HOST = 'http://' + config.API_HOST.IP + '/';
  app.use(
    proxy('/api', {
      target: API_HOST,
      changeOrigin: true
    })
  );
};
