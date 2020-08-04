const APPROOT = require('app-root-path');
const moment = require('moment');
const Util = require(`${APPROOT}/util/util`);
const Promise = require(`${APPROOT}/db/models`).Promise;
const PromiseQuery = require(`${APPROOT}/db/models/payload/promise`);
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
            query = PromiseQuery.selectQueryByAll(reqParams);
            result = await Promise.findAll(query);
            return result;

        } catch (err) {
            throw err;
        }
    },
    selectById : async (reqParams) =>{
        let result = null;
        try {
            let query = null;

            query = PromiseQuery.selectQueryById(reqParams);
            result = await Promise.findAll(query);
            return result;

        } catch (err) {
            throw err;
        }
    },
    promiseInfoInsert: async (reqParams) => {
        try {
            const result = await Promise.create(reqParams);
            return result !== null;

        } catch (err) {
            throw err;
        }
    },
    promiseInfoUpdate: async (reqParams) => {
        try {
            const result = await Promise.update(reqParams, {where: {id: reqParams.id}});
            return result !== null;

        } catch (err) {
            throw err;
        }
    },
    promiseInfoDelete: async (reqParams) => {
        try {
            const result = await Promise.destroy({
                where: {
                    id: reqParams.id
                }
            });
            return result !== null;

        } catch (err) {
            throw err;
        }
    }
};
