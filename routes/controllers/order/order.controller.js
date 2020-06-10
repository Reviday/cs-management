/**
 * API ORDER
 * */
const APPROOT = require('app-root-path');
const path = require('path');
const fileName = path.basename(__filename);
const Util = require(`${APPROOT}/util/util.js`);
const Service = require(`${APPROOT}/routes/service/order.service`);
const moment = require('moment');



module.exports = {
    making: async (req, res) => {
        let result = null;
        const date = new Date();
        const today = moment(date).format('YYYY-MM-DD');
        const complete_day = moment(date).add(10,"days").format('YYYY-MM-DD');
        try {
            req.paramStatus = 'making';
            const validateResult = Util.param_check(req, res, fileName, ['mode']);
            if (validateResult.status) return res.status(400).send(validateResult.errMsg);
            let paramCheck = null;
            let setReqParams = null;
            console.log('MODE ::: ',req.mode);
            if (req.query.mode === 'i') {
                // [주문 정보 insert]
                // 1. Check Request Parameters
                paramCheck = Util.param_check(req, res, fileName, ['site', 'name', 'telpno', 'product', 'price']);
                if (paramCheck.status) return res.status(400).send(paramCheck.errMsg);
                // 2. Set Request Parameters
                setReqParams = {
                    site          : req.query.site,
                    name          : req.query.name,
                    telpno        : req.query.telpno,
                    address       : req.query.address,
                    product       : req.query.product,
                    price         : req.query.price,
                    order_status  : 0,
                    order_date    : req.query.order_date || today,
                    complete_date : req.query.complete_date || complete_day,
                };
                // 3. Call DB insert function
                result = await Service.orderInfoInsert(setReqParams);

            } else if (req.query.mode === 'u') {
                // 주문 정보 update

            } else {
                // 전체 목록 조회
                result = await Service.orderInfoList(req);
            }
            // 최종 결과 Responses
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
