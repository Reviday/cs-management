const APPROOT = require('app-root-path');
const Util = require(`${APPROOT}/util/util`);
const Order = require(`${APPROOT}/db/models`).Order;
const OrderStatusCode = require(`${APPROOT}/db/models`).OrderStatusCode;
const Customer = require(`${APPROOT}/db/models`).Customer;
const OrderQuery = require(`${APPROOT}/db/models/payload/order`);
const CustomerQuery = require(`${APPROOT}/db/models/payload/order`);
const {Sequelize: {Op}} = require(`${APPROOT}/db/models`);


module.exports = {
    selectAllList: async (reqParams) => {
        try {
            let result = null;
            let query = null;
            const category = reqParams.category;
            if (category === 'order' || category === 'ship') {
                /************* 입출고 관리 게시판 Select Query *************/
                if (reqParams.id === null || reqParams.id === undefined) {
                    /* 전체 조회 */
                    query = OrderQuery.selectQueryByOrder(reqParams);
                    result = await Order.findAll(query);
                    const rows = [];
                    if (result !== null) {
                        result.map(value => {
                            let data = value.dataValues; //  Object
                            data.price = Util.addComma(data.price);
                            rows.push(data);
                        });
                    }
                    return Util.setResponseMessage(rows);
                } else {
                    /* 상세 조회 */
                    query = OrderQuery.selectQueryById(reqParams);
                    result = await Order.findAll(query);
                    if (result !== null) {
                        result = result[0].dataValues;
                    }
                    return Util.setResponseMessage(result);
                }
            } else {
                /************* 고객 관리 게시판 Select Query *************/
                if (reqParams.id === null) {
                    query = CustomerQuery.selectQueryByCustomer(reqParams);
                    result = await Customer.findAll(query);
                } else {
                    query = CustomerQuery.selectQueryById(reqParams);
                    result = await Customer.findByPk(query);
                }
            }
        } catch (err) {
            throw err;
        }
    },
    /*
    * rowInsertAction()
    * @param requestParam : 사용자 데이터(DB에 저장할 데이터)
    * @param category : 게시판 카테고리 종류
    * @param tableName : Insert TableName
    * */
    orderInfoInsert: async (requestParam, category) => {
        let result = null;
        try {
            if (category === 'order') {
                result = await Order.create(requestParam);
            } else if (category === 'customer') {
                result = await Customer.create(requestParam);
            }

            return Util.setResponseMessage(result._options.isNewRecord);
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
                return Util.setResponseMessage(true);
            }
            return Util.setResponseMessage(false);
        } catch (err) {
            throw err;
        }

    },
    orderInfoDelte: () => {

    },
    getStatusList: async () => await OrderStatusCode.findAll()
}
