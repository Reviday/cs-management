const APPROOT = require('app-root-path');
const Util = require(`${APPROOT}/util/util`);
const Order = require(`${APPROOT}/db/models`).Order;


module.exports = {
    orderInfoList: async () => {
        try {
            const rows = [];
            const result = await Order.findAll();
            if (result !== null) {
                result.map(value => {
                    let data = value.dataValues; //  Object
                    data.price = Util.addComma(data.price);
                    rows.push(data);
                });
            }
            return rows;
        } catch (err) {
            throw err;
        }
    },
    orderInfoInsert: async (requestParam) => {
        try {
            const result = await Order.create(requestParam);
            return result._options.isNewRecord;

        } catch (err) {
            throw err;
        }
    },
    orderInfoUpdate: () => {

    },
    orderInfoDelte: () => {

    }
};
