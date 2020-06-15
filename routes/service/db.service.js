const APPROOT = require('app-root-path');
const Util = require(`${APPROOT}/util/util`);
const Order = require(`${APPROOT}/db/models`).Order;
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
                if (reqParams.id === null) {
                    query = OrderQuery.selectQueryByOrder(reqParams);
                    result = await Order.findAll(query);
                } else {
                    query = OrderQuery.selectQueryById(reqParams);
                    result = await Order.findByPk(query);
                }
            } else {
                if (reqParams.id === null) {
                    query = CustomerQuery.selectQueryByCustomer(reqParams);
                    result = await Customer.findAll(query);
                } else {
                    query = CustomerQuery.selectQueryById(reqParams);
                    result = await Customer.findByPk(query);
                }

            }

            const rows = [];
            if (result !== null) {
                result.map(value => {
                    let data = value.dataValues; //  Object
                    data.price = Util.addComma(data.price);
                    rows.push(data);
                });
            }
            return Util.setResponseMessage(rows);
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
            const query = Payload.orderInfoUpdateQuery(reqParams);
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

    }
};
