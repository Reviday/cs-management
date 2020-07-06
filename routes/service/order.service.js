const APPROOT = require('app-root-path');
const Util = require(`${APPROOT}/util/util`);
const Order = require(`${APPROOT}/db/models`).Order;
const OrderStatusCode = require(`${APPROOT}/db/models`).OrderStatusCode;
const Customer = require(`${APPROOT}/db/models`).Customer;
const OrderQuery = require(`${APPROOT}/db/models/payload/order`);
const CustomerQuery = require(`${APPROOT}/db/models/payload/order`);
const {Sequelize: {Op}} = require(`${APPROOT}/db/models`);


module.exports = {
    /**
     * 입/출고 전체 목록 조회 및 상세 조회
     *
     * @param reqParams
     * @returns {Promise<*[]|*>}
     */
    selectAllList: async (reqParams) => {
        try {
            let result = null;
            let query = null;
            if (reqParams.id === null || reqParams.id === undefined) {
                /* 전체 조회 */
                query = OrderQuery.selectQueryByOrder(reqParams);
                result = await Order.findAll(query);
                return Util.setResponseMessage(result);
            } else {
                /* 상세 조회 */
                query = OrderQuery.selectQueryById(reqParams);
                result = await Order.findAll(query);
                if (result !== null) {
                    return Util.setResponseMessage(result[0]);
                }

            }

        } catch (err) {
            throw err;
        }
    },

    /**
     * 입/출고 게시판 주문 등록
     *
     * @param requestParam : {needs, telpno: *, product: ({allowNull: boolean, type: *}|string|string), address: *, manager, start: (*|number), complete_date: *, order_status: number, order_date: *, site: *, price, name: *, price_type, category: *}
     * @param category : board_category
     * @returns {Promise<*[]|*>}
     */
    orderInfoInsert: async (requestParam, category) => {
        let result = null;
        try {
            if (category === 'order') {
                result = await Order.create(requestParam);
            } else if (category === 'customer') {
                result = await Customer.create(requestParam);
            }

            return result._options.isNewRecord;
        } catch (err) {
            throw err;
        }
    },
    orderInfoUpdate: async (reqParams) => {
        try {
            const rows = [];
            const query = OrderQuery.orderInfoUpdateQuery(reqParams);
            console.log('query ::: %j', query);
            const result = await Order.update(query, {where: {id: reqParams.id}});
            if (result !== null) {
                return true;
            }
            return false;
        } catch (err) {
            throw err;
        }

    },
    orderInfoDelete: () => {

    },
    /**
     * 입/출고 상태 목록 값 조회 API
     *
     * @returns {Promise<*>}
     */
    getStatusList: async () => await OrderStatusCode.findAll(),

    /**
     * 모든 테이블 COUNT(*) 조회 함수
     *
     * @param category
     * @returns {Promise<<{rows: Model[]; count: number}>>}
     */
    getListCount: async (category) => {
        if(category === 'customer'){
            return Customer.findAndCountAll();

        }else {
            let query = OrderQuery.orderInfoListCountQuery(category);
            return Order.findAndCountAll(query);
        }

    },

    /**
     * 입고 지연 상품 조회 함수
     *
     * @param {object} reqParams
     * @returns {Promise<*[]|*|boolean>}
     */
    getDelayOrderList: async (reqParams) => {
        const query = OrderQuery.delayOrderInfoQuery(reqParams);
        let result = null;
        result = await Order.findAll(query);
        const rows = [];
        if (result !== null) {
            return Util.setResponseMessage(result);
        } else {
            return false;
        }

    },
}
