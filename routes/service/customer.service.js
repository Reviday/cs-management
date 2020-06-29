const APPROOT = require('app-root-path');
const Util = require(`${APPROOT}/util/util`);
const Customer = require(`${APPROOT}/db/models`).Customer;
const CustomerQuery = require(`${APPROOT}/db/models/payload/customer`);
const {Sequelize: {Op}} = require(`${APPROOT}/db/models`);


module.exports = {
    selectAllList: async (reqParams) => {
        let result = null;
        try {
            let query = null;
            /************* 고객 관리 게시판 Select Query *************/
            query = CustomerQuery.selectQueryByCustomer(reqParams);
            result = await Customer.findAll(query);
            return Util.setResponseMessageByCustomers(result);

        } catch (err) {
            throw err;
        }
    },
    /*
    * customInfoInsert()
    * @param requestParam : 고객 정보(DB에 저장할 데이터)
    * */
    customInfoInsert: async (requestParam) => {
        try {
            let result = await Customer.create(requestParam);
            return result._options.isNewRecord;
        } catch (err) {
            throw err;
        }
    },
    customInfoUpdate: async (reqParams) => {
        try {
            //const query = CustomerQuery.updateQueryById(reqParams);
            //console.log('query ::: %j', query);
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

    }
};
