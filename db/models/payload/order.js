const APPROOT = require('app-root-path');
const moment = require('moment');
const db = require(`${APPROOT}/db/models`);
const {Sequelize: {Op}} = require(`${APPROOT}/db/models`);
module.exports = {
    /**
     * 입출고 게시판 조회 쿼리
     * @param reqParams - category : 입고(order) 또는 출고(ship) ,start : 시작 페이지
     * @returns {null}
     */
    selectQueryByOrder: function (reqParams) {
        const category = reqParams.category;
        const start = reqParams.start;

        let result = null;
        switch (category) {
            case 'order' :
                result = {
                    attributes: ["id", "site", "name", "product", "price", "order_date", "price_type", "manager",
                        "complete_date", "update_at", "order_status", "needs", "order_status", "address", "telpno"],
                    where: {
                        order_status: {[Op.lte]: 3}
                    },
                    include: [{
                        model: db.OrderStatusCode,
                        required: false,
                        attributes: ["status_name"]
                    }],
                    limit: 10,
                    offset: (10 * start) - 10
                };
                break;
            case 'ship' :
                result = {
                    attributes: ["id", "site", "name", "product", "price", "order_date", "price_type", "manager",
                        "complete_date", "update_at", "order_status", "needs", "order_status", "address"],
                    where: {
                        order_status: {[Op.gt]: 3}
                    },
                    include: [{
                        model: db.OrderStatusCode,
                        required: false,
                        attributes: ["status_name"]
                    }],
                    limit: 10,
                    offset: (10 * start) - 10
                };
                break;
        }

        return result;
    },
    selectQueryById: function (reqParams) {
        const id = reqParams.id;

        return {
            where: {
                id: id
            },
            include: [{
                model: db.OrderStatusCode,
                required: false,
                attributes: ["status_name"]
            }]
        };
    },
    orderInfoUpdateQuery: function (reqParams) {
        // title에 따라서 Query 적용
        const result = {};
        if ((reqParams.category === 'order' || reqParams.category === 'ship') && reqParams.action === 'u') {
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
    },
    delayOrderInfoQuery: function (reqParams) {
        const date = new Date();
        const today = moment(date).format('YYYY-MM-DD');
        console.log(today);
        return {
            where: {
                order_status: {[Op.lte]: 3},
                complete_date: {[Op.lte]: today}
            },
            include: [{
                model: db.OrderStatusCode,
                required: false,
                attributes: ["status_name"]
            }],
            limit: 10,
            offset: (10 * reqParams.start) - 10
        };
    }
}
