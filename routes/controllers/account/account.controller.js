/**
 * API ACCOUNT
 * */
const APPROOT = require('app-root-path');
const path = require('path');
const fileName = path.basename(__filename);
const Util = require(`${APPROOT}/util/util.js`);
const Service = require(`${APPROOT}/routes/service/account.service`);

//push
module.exports = {
    login: async (req, res) => {
        try {
            req.paramStatus = 'account';
            // 1. ID and Password value validate check
            const validateResult = Util.param_check(req, res, fileName, ['id', 'password']);
            if (validateResult.status) return res.status(400).send(validateResult.errMsg);
            // 2. Set Request Parameters
            const setReqParams = {
                id: req.query.id,
                password: req.query.password
            };
            // 3. Call DB insert function
            const result = await Service.selectMemberById(setReqParams);

            res.json(Util.res_ok(result));

        } catch (err) {
            console.log('---------------------------------------', fileName);
            console.log(`${req.originalUrl} / (method:${req.method})`, fileName);
            console.log(err);
            console.log('---------------------------------------', fileName);
            res.json(Util.res_err(req, res, err));
        }

    },
    sitesList : async (req, res) => {
        try {
            req.paramStatus = 'sitesList';
            // 1. ID and Password value validate check
            // 2. Set Request Parameters
            // 3. Call DB insert function
            const result = await Service.selectListBySite();

            res.json(Util.res_ok(result));

        } catch (err) {
            console.log('---------------------------------------', fileName);
            console.log(`${req.originalUrl} / (method:${req.method})`, fileName);
            console.log(err);
            console.log('---------------------------------------', fileName);
            res.json(Util.res_err(req, res, err));
        }
    }
};
