const APPROOT = require('app-root-path');
const moment = require('moment');
const Util = require(`${APPROOT}/util/util`);
const Customer = require(`${APPROOT}/db/models`).Customer;
const CustomerQuery = require(`${APPROOT}/db/models/payload/customer`);
const {Sequelize: {Op}} = require(`${APPROOT}/db/models`);

//push
module.exports = {
    /**
     * 고객정보 전체 조회
     *
     * @param reqParams
     * @returns {Promise<*[]>}
     */
    selectAllList: async (reqParams) => {
        let result = null;
        try {
            let query = null;
            /************* 고객 관리 게시판 Select Query *************/
            query = CustomerQuery.selectQueryByCustomer(reqParams);
            result = await Customer.findAll(query);
            return Util.setResponseMessage(result);

        } catch (err) {
            throw err;
        }
    },
    /**
     * 고객정보 상세보기
     *
     * @param reqParams
     * @returns {Promise<*[]>}
     */
    selectById : async (reqParams) => {
        let result = null;
        try {
            let query = null;
            query = CustomerQuery.selectQueryById(reqParams);
            result = await Customer.findAll(query);
            return Util.setResponseMessage(result);

        } catch (err) {
            throw err;
        }
    },
    /**
     * 고객정보 등록
     *
     * @param requestParam
     * @returns {Boolean} Result Flag Query Action
     */
    customInfoInsert: async (requestParam) => {
        try {
            let result = await Customer.create(requestParam);
            return result._options.isNewRecord;
        } catch (err) {
            throw err;
        }
    },
    /**
     * 고객정보 업데이트
     *
     * @param reqParams
     * @returns {Promise<boolean>}
     */
    customInfoUpdate: async (reqParams) => {
        /*TODO 2020.07.06
        * 첨부파일 upsert 추가 필요
        * */
        try {
            const result = await Customer.update(reqParams, {
                where: {
                    name: reqParams.name,
                    telpno: reqParams.telpno
                }
            });
            return result !== null;

        } catch (err) {
            throw err;
        }

    },
    /**
     * 고객정보 삭제
     *
     * @param reqParams
     * @returns {Promise<boolean>}
     */
    customInfoDelete: async (reqParams) => {
        try {
            const result = await Customer.destroy({
                where: {
                    name: reqParams.name,
                    telpno: reqParams.telpno
                }
            });
            return result !== null;

        } catch (err) {
            throw err;
        }
    },
    /**
     * 고객정보 유무 확인
     *
     * @param reqParams
     * @returns {Int} Count
     */
    existCustomerInfo : async (reqParams) => {
        let result = null;
        try {
            const query = CustomerQuery.selectQueryById(reqParams);
            result = await Customer.findAndCountAll(query);
            return result;

        } catch (err) {
            throw err;
        }
    },
    /**
     * 입/출고 게시판에서 '주문등록'시, 고객정보의 lastorder update
     *
     * @param reqParams
     * @returns {Promise<*>}
     */
    updateLastOrderDateInfo : async (reqParams) => {
        let result = null;
        const date = new Date();
        const today = moment(date).format('YYYY-MM-DD');
        try {
            const query = {lastorder : today, update_at : date}
            const whereQuery = CustomerQuery.selectQueryById(reqParams);
            result = await Customer.update(query, whereQuery);
            return result;

        } catch (err) {
            throw err;
        }

    }
};
