const APPROOT = require('app-root-path');
const {Sequelize: {Op}} = require(`${APPROOT}/db/models`);
module.exports = {
    selectQueryByOrder: function (reqParams) {
        const category = reqParams.category;
        const start = reqParams.start;

        let result = null;
        switch (category) {
            case 'order' :
                result = {
                    where: {
                        order_status: {[Op.lte]: 3}
                    },
                    limit: 10,
                    offset: (10 * start) - 10
                };
                break;
            case 'ship' :
                result = {
                    where: {
                        order_status: {[Op.gt]: 3}
                    },
                    limit: 10,
                    offset: (10 * start) - 10
                };
                break;
        }

        return result;
    },
    selectQueryById: function (reqParams) {
        const category = reqParams.category;
        const id = reqParams.id;
        const start = reqParams.start;

        let result = null;
        switch (category) {
            case 'order' :
                result = {
                    where: {
                        // order_status: {[Op.lte]: 3},
                        id : id
                    },
                    limit: 10,
                    offset: (10 * start) - 10
                };
                break;
            case 'ship' :
                result = {
                    where: {
                        //order_status: {[Op.gt]: 3},
                        id : id
                    },
                    limit: 10,
                    offset: (10 * start) - 10
                };
                break;
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
