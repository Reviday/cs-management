/**
 * API ACCOUNT
 * */
const approot = require('app-root-path');
const path = require('path');
const fileName = path.basename(__filename);
const Util = require(`${approot}/util/util.js`);
const moment = require('moment');


module.exports = {
    making: async (req, res) => {
        const requestParams = {
            mode : req.body.mode
        }
    }
};
