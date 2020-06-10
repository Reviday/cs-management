const APPROOT = require('app-root-path');
const {Sequelize: {Op}} = require(`${APPROOT}/db/models`);
module.exports = {
    orderInfoListQuery: function (title, start) {
        const result = {
            where: {
                order_status: {[Op.gt]: 3}
            },
            limit: 10,
            offset: (10 * start) - 10
        };

        if (title === 'order') {
            result.where.order_status = {[Op.lte]: 3};
        } else {
            result.where.order_status = {[Op.gt]: 3};
        }

        return result;
    },
    orderInfoUpdateQuery: function (reqParams) {
        // title에 따라서 Query 적용
        const result = {};
        if (reqParams.title === 'order') {
            result.site = reqParams.site;
            result.name = reqParams.name;
            result.telpno = reqParams.telpno;
            result.product = reqParams.product;
            result.price = reqParams.price;
            result.address = reqParams.address;
            result.needs = reqParams.needs;
            result.price = reqParams.price;

        } else {
            result.order_status = reqParams.order_status;
            result.needs = reqParams.needs;
        }

        return result;
    }
}
