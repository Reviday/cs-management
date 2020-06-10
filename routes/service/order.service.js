const APPROOT = require('app-root-path');
const Util = require(`${APPROOT}/util/util`);
const Order = require(`${APPROOT}/db/models`).Order;
const Payload = require(`${APPROOT}/db/models/payload/order`);
const {Sequelize: {Op}} = require(`${APPROOT}/db/models`);


module.exports = {
    orderInfoList: async (reqParams) => {
        try {
            const rows = [];
            const query = Payload.orderInfoListQuery(reqParams.title, reqParams.start);
            console.log('query ::: %j', query);
            const result = await Order.findAll(query);
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
    orderInfoInsert: async (requestParam) => {
        try {
            const result = await Order.create(requestParam);
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
