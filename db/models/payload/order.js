const APPROOT = require('app-root-path');
const moment = require('moment');
const db = require(`${APPROOT}/db/models`);
const {Sequelize: {Op}} = require(`${APPROOT}/db/models`);
module.exports = {
    /**
     * 입출고 게시판 조회 쿼리
     * @param reqParams - category : 입고(order) 또는 출고(ship) ,start : 시작 페이지
     * @returns {null}
     * @example {Parameters}
     category:order
     action:l
     start:2 (페이지 처리 파라미터)
     id:7 (상세보기 시, 필수 파라미터)
     search_word:유진호(검색 시, 검색어)
     search_field:name(검색 시, 적용할 컬럼명)
     search_telpno:01036257342(고객 전화 번호)
     */
    selectQueryByOrder: function (reqParams) {
        const category = reqParams.category;
        const start = reqParams.start;
        const searchWord = reqParams.search_word;
        const searchField = reqParams.search_field;
        const searchTelpno = reqParams.search_telpno;

        // 1. 기본 검색 Query 구성
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
                    offset: (10 * start) - 10,
                    order: [
                        ['create_at', 'DESC']
                    ]

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
                    offset: (10 * start) - 10,
                    order: [
                        ['create_at', 'DESC']
                    ]
                };
                break;
        }

        // 2. Order 게시판에서 검색하는 경우, Like SQL 추가
        if (searchField !== '' && searchField !== '') {
            result.where[searchField] = {
                [Op.like]: "%" + searchWord + "%"
            };
        }

        // 3. Customer 게시판에서 고객정보 상세 보기 하는 경우, pk : name, telpno로
        //   고객 최근 주문 데이터 조회
        if (searchTelpno !== '' && searchField === 'name') {
            result.where['telpno'] = searchTelpno;
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
            result.manager = reqParams.manager;
            result.price_type = reqParams.price_type;

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
    },
    orderInfoListCountQuery: function (category) {
        let query = {};
        const date = new Date();
        const today = moment(date).format('YYYY-MM-DD');
        if (category === 'order') {
            query = {
                where: {
                    order_status: {[Op.lte]: 3}
                }
            };
        } else if (category === 'ship') {
            query = {
                where: {
                    order_status: {[Op.gt]: 3}
                }
            };
        } else if (category === 'delay') {
            query = {
                where: {
                    order_status: {[Op.lte]: 3},
                    complete_date: {[Op.lte]: today}
                }
            };
        }

        return query;
    }
}
