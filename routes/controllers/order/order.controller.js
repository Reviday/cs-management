/**
 * API ORDER Controller
 * */
const APPROOT = require('app-root-path');
const path = require('path');
const fileName = path.basename(__filename);
const Util = require(`${APPROOT}/util/util.js`);
const Service = require(`${APPROOT}/routes/service/order.service`);
const moment = require('moment');


module.exports = {
    /**
     * 입/출고 게시판 CRUD(Create, Read Update, Delete)
     *
     * @param req
     * - req.query.category : order(입고), ship(출고)
     * - req.query.action : i(insert),u(update),s(select),d(delete)
     * @param res
     * @returns {Promise<*>}
     */
    making: async (req, res) => {
        let result = null;
        const date = new Date();
        const today = moment(date).format('YYYY-MM-DD');
        const complete_day = moment(date).add(10, "days").format('YYYY-MM-DD');
        try {
            req.paramStatus = 'making';
            // 1. 최초 필수 파라미터 확인.
            const validateResult = Util.param_check(req, res, fileName, ['category', 'action']);
            if (validateResult.status) return res.status(400).send(validateResult.errMsg);
            let paramCheck = null;
            let setReqParams = null;
            let category = req.query.category.toLowerCase();
            const action = req.query.action.toLowerCase();
            if (action === 'i') {
                // [주문 정보 insert]
                // 1. Check Request Parameters
                paramCheck = Util.param_check(req, res, fileName, ['site', 'name', 'telpno', 'product', 'price']);
                if (paramCheck.status) return res.status(400).send(paramCheck.errMsg);
                // 2. Set Request Parameters
                setReqParams = {
                    category: req.query.category,
                    start: req.query.start || 1,
                    site: req.query.site,
                    name: req.query.name,
                    telpno: req.query.telpno,
                    address: req.query.address,
                    needs: req.query.needs,
                    product: req.query.product,
                    price: req.query.price,
                    price_type: req.query.price_type,
                    manager: req.query.manager,
                    order_status: 0,
                    order_date: req.query.order_date || today,
                    complete_date: req.query.complete_date || complete_day,
                };
                // 3. Call DB insert function
                result = await Service.orderInfoInsert(setReqParams, category);

            } else if (action === 'u') {
                // [주문 정보 update]
                paramCheck = Util.param_check(req, res, fileName, ['id', 'site', 'name', 'telpno', 'address',
                    'needs', 'product', 'price', 'order_status', 'price_type', 'manager']);
                if (paramCheck.status) return res.status(400).send(paramCheck.errMsg);
                setReqParams = {
                    id: req.query.id,
                    site: req.query.site,
                    name: req.query.name,
                    telpno: req.query.telpno,
                    address: req.query.address,
                    needs: req.query.needs,
                    product: req.query.product,
                    price: req.query.price,
                    price_type: req.query.price_type,
                    manager: req.query.manager,
                    order_status: req.query.order_status,
                };
                // 주문 정보 update
                result = await Service.orderInfoUpdate(setReqParams);

            } else if (action === 'status_u') {
                // [주문 상태 정보 update]
                paramCheck = Util.param_check(req, res, fileName, ['needs', 'order_status']);
                if (paramCheck.status) return res.status(400).send(paramCheck.errMsg);
                setReqParams = {
                    category: req.query.category,
                    action: req.query.action,
                    id: req.query.id,
                    needs: req.query.needs,
                    order_status: req.query.order_status,
                };
                // 주문 상태 정보 update
                result = await Service.orderInfoUpdate(setReqParams);

            } else {
                // 전체 목록 및 상세 조회
                setReqParams = {
                    category: req.query.category,
                    start: req.query.start || 1,
                };
                const id = req.query.id
                if (id !== null || id !== '' || id !== undefined) {
                    setReqParams.id = id;

                }
                result = await Service.selectAllList(setReqParams);

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
    },
    /**
     * 입/출고 상태 목록 조회
     *
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    statusList: async (req, res) => {
        const result = await Service.getStatusList();
        res.json(Util.res_ok(result));
    },
    /**
     * 입/출고 전체 목록 count
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    listCount: async (req, res) => {
        try {
            req.paramStatus = 'listCount';
            const validateResult = Util.param_check(req, res, fileName, []);
            if (validateResult.status) return res.status(400).send(validateResult.errMsg);

            const result = await Service.getListCount(req.query.category);
            console.log(result.count);

            res.json(Util.res_ok({'total' : result.count}));

        } catch (err) {
            console.log('---------------------------------------', fileName);
            console.log(`${req.originalUrl} / (method:${req.method})`, fileName);
            console.log(err);
            console.log('---------------------------------------', fileName);
            res.json(Util.res_err(req, res, err));
        }
    },
    /**
     * 입고 지연 상품 목록 조회 API
     *
     * @param req
     * @param res
     * @returns {Promise<*>}
     */
    delayOrder: async (req, res) => {
        try {
            req.paramStatus = 'delayOrderInfo';
            const validateResult = Util.param_check(req, res, fileName, []);
            if (validateResult.status) return res.status(400).send(validateResult.errMsg);
            const setReqParams = {
                start : req.query.start || 1,
            }
            const result = await Service.getDelayOrderList(setReqParams);
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
