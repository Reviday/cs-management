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
        const mySite = reqParams.userSite;
        const searchWord = reqParams.searchWord;
        const searchField = reqParams.searchField;
        const searchTelpno = reqParams.searchTelpno;

        // 1. 기본 검색 Query 구성
        let result = null;
        const date = new Date();
        const today = moment(date).format('YYYY-MM-DD');
        switch (category) {
            case 'all' :
                result = {
                    attributes: [
                        "id", "site", "name", "product", "price", "order_date", "price_type", "manager",
                        "complete_date", "update_at", "order_status", "needs", "order_status", "address",
                        "telpno", "zipcode", "detail_addr"
                    ],
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
            case 'checklist' :
                result = {
                    attributes: [
                        "id", "site", "name", "product", "price", "order_date", "price_type", "manager",
                        "complete_date", "update_at", "order_status", "needs", "order_status", "address",
                        "telpno", "zipcode", "detail_addr"
                    ],
                    include: [{
                        model: db.OrderStatusCode,
                        required: false,
                        attributes: ["status_name"]
                    }],
                    limit: 10,
                    offset: (10 * start) - 10,
                    where: {
                        complete_date: today
                    },
                    order: [
                        ['create_at', 'DESC']
                    ]

                };
                break;
            case 'order' :
                result = {
                    attributes: [
                        "id", "site", "name", "product", "price", "order_date", "price_type", "manager",
                        "complete_date", "update_at", "order_status", "needs", "order_status", "address",
                        "telpno", "zipcode", "detail_addr"
                    ],
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
                        //order_status: {[Op.gt]: 3}
                        order_status: 4
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

        // 2020.07.07 추가
        // 주문정보 조회 시, 계정 별 지점 데이터를 이용한 특정 지점만 조회.
        if ((mySite !== '') && (category === 'order' || category === 'ship')) result.where['site'] = mySite;

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
    /**
     * 입/출고 주문 등록
     *
     * @param reqParams
     * @returns {{}}
     */
    orderInfoUpdateQuery: function (reqParams) {
        // title에 따라서 Query 적용
        const result = {};
        if ((reqParams.category === 'order' || reqParams.category === 'ship') && reqParams.action === 'u') {
            result.site = reqParams.site;
            result.name = reqParams.name;
            result.telpno = reqParams.telpno;
            result.product = reqParams.product;
            result.price = reqParams.price;
            result.zipcode = reqParams.zipcode;
            result.address = reqParams.address;
            result.detail_addr = reqParams.detail_addr;
            result.needs = reqParams.needs;
            result.price = reqParams.price;
            result.manager = reqParams.manager;
            result.price_type = reqParams.price_type;
            result.order_date = reqParams.order_date;
            result.complete_date = reqParams.complete_date;

        } else {
            result.order_status = reqParams.order_status;
            result.needs = reqParams.needs;
            result.order_date = reqParams.order_date;
            result.complete_date = reqParams.complete_date;
        }

        return result;
    },
    /**
     * 입고지연 목록 조회
     *
     * @param reqParams
     * @returns {{include: [{model: *, attributes: [string], required: boolean}], offset: number, limit: number, where: {order_status: {}, complete_date: {}}}}
     */
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
    /**
     * DB의 모든 테이블의 COUNT(*) API
     *
     * @param category
     * @param selectedSite  {String} : 선택한 지점(사이트)
     * @param searchField   {String} : 검색 필드명
     * @param searchKeyword {Stringr}: 검색 키워드
     * @returns Select Query {{}}
     */
    orderInfoListCountQuery: function (category, selectedSite, searchField, searchKeyword) {
        let query = {};
        const date = new Date();
        const today = moment(date).format('YYYY-MM-DD');
        if (category === 'order') {
            // 1. 입고 정보 게시판 count
            query = {
                where: {
                    order_status: {[Op.lte]: 3}
                }
            };
        } else if (category === 'ship') {
            // 2. 출고 정보 게시판 count
            query = {
                where: {
                    order_status: {[Op.gt]: 3}
                }
            };
        } else if (category === 'delay') {
            // 3. 입고 지연
            query = {
                where: {
                    order_status: {[Op.lte]: 3},
                    complete_date: {[Op.lte]: today}
                }
            };
        } else if (category === 'today_order_list') {
            // 4. 금일 입고 count
            query = {
                where: {
                    complete_date: today
                }
            };
        }

        if(selectedSite !== ''){
            query.where.site = selectedSite;
        }

        if(searchField !== '' && searchKeyword !== ''){
            query.where[searchField] = searchKeyword;
        }

        return query;
    }
}
