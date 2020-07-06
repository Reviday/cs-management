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
    select: async (req, res) => {
        let result = null;
        try {
            req.paramStatus = 'customerSelect';
            const setReqParams = {
                start: req.query.start || req.body.start || 1
            };
            result = await Service.selectAllList(setReqParams);
            res.json(Util.res_ok(result));

        } catch (err) {
            console.log('---------------------------------------', fileName);
            console.log(`${req.originalUrl} / (method:${req.method})`, fileName);
            console.log(err);
            console.log('---------------------------------------', fileName);
            res.json(Util.res_err(req, res, err));

        }

    },
    selectById: async (req, res) => {
        let result = null;
        try {
            req.paramStatus = 'customerSelectById';
            const validateResult = Util.param_check(req, res, fileName, ['name', 'telpno']);
            if (validateResult.status) return res.status(400).send(validateResult.errMsg);
            const setReqParams = {
                name: req.query.name,
                telpno: req.query.telpno,
            };
            result = await Service.selectById(setReqParams);
            res.json(Util.res_ok(result));

        } catch (err) {
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
            const validateResult = Util.param_check(req, res, fileName, ['site', 'name', 'zipcode', 'address', 'telpno']);
            if (validateResult.status) return res.status(400).send(validateResult.errMsg);
            // 2. Set Query Object
            const setReqParams = {
                site: req.query.site,
                name: req.query.name,
                zipcode: req.query.zipcode,
                address: req.query.address,
                telpno: req.query.telpno,
                interest_style: req.query.interest_style,
                memo: req.query.customer_memo
            };
            // 3. Check Validation Attachments Files(첨부 파일) Value
            if (!(req.files === null || req.files === undefined)) {
                setReqParams.custom_image = Util.getFilesPath(req.files);
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
    update: async (req, res) => {
        console.log(req.body);
        console.log(req.query);
        //console.log(req.files);
        let result = null;
        try {
            req.paramStatus = 'customerUpdate';
            // 1. Check Validator 최초 필수 Parameters.
            const validateResult = Util.param_check(req, res, fileName, ['name', 'telpno']);
            if (validateResult.status) return res.status(400).send(validateResult.errMsg);
            // 2. Set Query Object
            const setReqParams = {
                name: req.query.name,
                telpno: req.query.telpno,
                zipcode: req.query.zipcode,
                address: req.query.address,
                interest_style: req.query.interest_style,
                birth: req.query.birth,
                memo: req.query.customer_memo
            };
            // 3. Check Validation Attachments Files(첨부 파일) Value
            if (req.files.length > 0) {
                setReqParams.custom_image = Util.getFilesPath(req.files);
            } else if (req.query.custom_image !== null || req.query.custom_image !== '' || undefined) {
                setReqParams.custom_image = req.query.custom_image;
            }
            console.log(setReqParams);
            // 4. Execute Insert Query
            result = await Service.customInfoUpdate(setReqParams);

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
    delete: async (req, res) => {
        let result = null;
        try {
            req.paramStatus = 'customerDelete';
            // 1. Check Validator 최초 필수 Parameters.
            const validateResult = Util.param_check(req, res, fileName, ['name', 'telpno']);
            if (validateResult.status) return res.status(400).send(validateResult.errMsg);
            // 2. Set Query Object
            const setReqParams = {
                name: req.query.name,
                telpno: req.query.telpno,
            };
            // 3. Check Validation Attachments Files(첨부 파일) Value

            // 4. Execute Insert Query
            result = await Service.customInfoDelete(setReqParams);

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
    check: async (req, res) => {
        let result = null;
        let existedFlag = null;
        try {
            req.paramStatus = 'customerIdCheck';
            // 1. Check Validator 최초 필수 Parameters.
            const validateResult = Util.param_check(req, res, fileName, ['name', 'telpno']);
            if (validateResult.status) return res.status(400).send(validateResult.errMsg);
            // 2. Set Query Object
            const setReqParams = {
                name: req.query.name,
                telpno: req.query.telpno,
            };

            // 3. Execute Insert Query
            result = await Service.existCustomerInfo(setReqParams);
            if (result.count > 0) {
                // 4. Send Executed Query Result
                existedFlag = false;
            } else {
                existedFlag = true;
            }
            res.json(Util.res_ok(existedFlag));


        } catch (err) {
            console.log('---------------------------------------', fileName);
            console.log(`${req.originalUrl} / (method:${req.method})`, fileName);
            console.log(err);
            console.log('---------------------------------------', fileName);
            res.json(Util.res_err(req, res, err));
        }
    }
};
