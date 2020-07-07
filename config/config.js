// config.js

const approot = require('app-root-path');
const configfile = require('./config.json');
const runmode = configfile.runmode;
const config = configfile[runmode];

console.info('*************** config *****************');
console.info(`* runmode [dev/prod] : ${runmode}`);
console.info(`* debug_level : ${config.DEBUG_LEVEL}`);
console.info(`* app : ${JSON.stringify(config.APP_HOST)}`);
console.info(`* api : ${JSON.stringify(config.API_HOST)}`);
// console.info(`* mysql : ${JSON.stringify(config.ELASTICSEARCH_HOST)}`);
console.info('****************************************');

config.runmode = runmode;
module.exports = config;
