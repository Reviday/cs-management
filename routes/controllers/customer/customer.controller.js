/**
 * API Customer
 * */
const APPROOT = require('app-root-path');
const path = require('path');
const fileName = path.basename(__filename);
const Util = require(`${APPROOT}/util/util.js`);
const Service = require(`${APPROOT}/routes/service/customer.service`);
const moment = require('moment');
const multer = require('multer');


module.exports = {
    select : async (req, res) => {
        let result = null;
        try {
            req.paramStatus = 'customerSelect';
            const setReqParams = {
                start: req.query.start || req.body.start || 1
            };
            result = await Service.selectAllList(setReqParams);
            res.json(Util.res_ok(result));

        }catch (err) {
            console.log('---------------------------------------', fileName);
            console.log(`${req.originalUrl} / (method:${req.method})`, fileName);
            console.log(err);
            console.log('---------------------------------------', fileName);
            res.json(Util.res_err(req, res, err));

        }

    },
    insert: async (req, res) => {
        let result = null;
        try {
            req.paramStatus = 'customerInsert';
            // 1. Check Validator 최초 필수 Parameters.
            const validateResult = Util.param_check(req, res, fileName, ['site', 'name','zipcode','address','telpno']);
            if (validateResult.status) return res.status(400).send(validateResult.errMsg);
            // 2. Set Query Object
            const setReqParams = {
                site : req.query.site,
                name : req.query.name,
                zipcode : req.query.zipcode,
                address : req.query.address,
                telpno : req.query.telpno,
                interest_style : req.query.interest_style,
                memo : req.query.customer_memo
            };
            // 3. Check Validation Attachments Files(첨부 파일) Value
            if(!(req.files === null || req.files === undefined)){
                setReqParams.custom_image= Util.getFilesPath(req.files);
            }

            // 4. Execute Insert Query
            result = await Service.customInfoInsert(setReqParams);

            // 5. Send Executed Query Result
            res.json(Util.res_ok(result));

        } catch (err) {
            console.log('---------------------------------------', fileName);
            console.log(`${req.originalUrl} / (method:${req.method})`, fileName);
            console.log(err);
            console.log('---------------------------------------', fileName);
            res.json(Util.res_err(req, res, err));
        }
    },
    update: async () => {

    }
};
