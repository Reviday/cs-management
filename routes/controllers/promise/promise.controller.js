/**
 * API ACCOUNT
 * */
const APPROOT = require('app-root-path');
const path = require('path');
const fileName = path.basename(__filename);
const Util = require(`${APPROOT}/util/util.js`);
const Service = require(`${APPROOT}/routes/service/promise.service`);

//push
module.exports = {
    selectByAll: async (req, res) => {
        try {
            req.paramStatus = 'Promise';
            // 1. ID and Password value validate check
            const validateResult = Util.param_check(req, res, fileName, ['now_month']);
            if (validateResult.status) return res.status(400).send(validateResult.errMsg);
            // 2. Set Request Parameters
            const setReqParams = {
                nowMonth: req.query.now_month
            };
            // 3. Call DB insert function
            const result = await Service.selectAllList(setReqParams);

            // 4. Convert Result to ResponseMessage
            Util.setResponseMessage(result);

            // 5. Json Object res
            res.json(Util.res_ok(result));

        } catch (err) {
            console.log('---------------------------------------', fileName);
            console.log(`${req.originalUrl} / (method:${req.method})`, fileName);
            console.log(err);
            console.log('---------------------------------------', fileName);
            res.json(Util.res_err(req, res, err));
        }

    },
    selectByDay : async (req,res) => {
        try {
            req.paramStatus = 'Promise Click Day';
            // 1. ID and Password value validate check
            const validateResult = Util.param_check(req, res, fileName, ['now_month','selected_day']);
            if (validateResult.status) return res.status(400).send(validateResult.errMsg);
            const startDay = Util.getTimestamp(req.query.now_month,req.query.selected_day,0,0,);
            const endDay = Util.getTimestamp(req.query.now_month,req.query.selected_day,23,59,);
            // 2. Set Request Parameters
            const setReqParams = {
                nowMonth: req.query.now_month,
                startDay,
                endDay
            };
            // 3. Call DB insert function
            const result = await Service.selectById(setReqParams);

            // 4. Convert Result to ResponseMessage
            Util.setResponseMessage(result);

            // 5. Json Object res
            res.json(Util.res_ok(result));

        } catch (err) {
            console.log('---------------------------------------', fileName);
            console.log(`${req.originalUrl} / (method:${req.method})`, fileName);
            console.log(err);
            console.log('---------------------------------------', fileName);
            res.json(Util.res_err(req, res, err));
        }
    },
    insert : async (req, res) => {
        let result = null;
        try {
            req.paramStatus = 'promiseInsert';
            // 1. Check Validator 최초 필수 Parameters.
            // site, name, telpno, start_date, end_date, memo, meeting_category
            const validateResult = Util.param_check(req, res, fileName,
                ['site', 'name', 'telpno', 'start_date', 'end_date','customer_memo','meeting_category']);
            if (validateResult.status) return res.status(400).send(validateResult.errMsg);
            // 2. Set Query Object
            const setReqParams = {
                site: req.query.site,
                name: req.query.name,
                telpno: req.query.telpno,
                start_date : req.query.start_date,
                end_date : req.query.end_date,
                memo: req.query.customer_memo,
                meeting_category: req.query.meeting_category,
            };
            // 3. Check Validation Attachments Files(첨부 파일) Value

            // 4. Execute Insert Query
            result = await Service.promiseInfoInsert(setReqParams);

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
    update : async (req, res) => {
        let result = null;
        try {
            req.paramStatus = 'promiseUpdate';
            // 1. Check Validator 최초 필수 Parameters.
            // site, name, telpno, start_date, end_date, memo, meeting_category
            const validateResult = Util.param_check(req, res, fileName,
                ['id','site', 'name', 'telpno', 'start_date', 'end_date','customer_memo','meeting_category']);
            if (validateResult.status) return res.status(400).send(validateResult.errMsg);
            // 2. Set Query Object
            const setReqParams = {
                id : req.query.id,
                site: req.query.site,
                name: req.query.name,
                telpno: req.query.telpno,
                start_date : req.query.start_date,
                end_date : req.query.end_date,
                memo: req.query.customer_memo,
                meeting_category: req.query.meeting_category,
            };
            // 3. Check Validation Attachments Files(첨부 파일) Value

            // 4. Execute Insert Query
            result = await Service.promiseInfoUpdate(setReqParams);

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
    delete : async (req,res) => {
        let result = null;
        try {
            req.paramStatus = 'promiseUpdate';
            // 1. Check Validator 최초 필수 Parameters.
            // site, name, telpno, start_date, end_date, memo, meeting_category
            const validateResult = Util.param_check(req, res, fileName,
                ['id']);
            if (validateResult.status) return res.status(400).send(validateResult.errMsg);
            // 2. Set Query Object
            const setReqParams = {
                id : req.query.id,
            };
            // 3. Check Validation Attachments Files(첨부 파일) Value

            // 4. Execute Insert Query
            result = await Service.promiseInfoDelete(setReqParams);

            // 5. Send Executed Query Result
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
