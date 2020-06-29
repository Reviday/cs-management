const APPROOT = require('app-root-path');
const {Sequelize: {Op}} = require(`${APPROOT}/db/models`);
module.exports = {
    selectQueryByCustomer: function (reqParams) {
        const start = reqParams.start;
        return {
            limit: 10,
            offset: (10 * start) - 10
        };
    },
    selectQueryById: function (reqParams) {
        const name = reqParams.name;
        const telpno = reqParams.telpno;
        return {
            where : {
                name : name,
                telpno : telpno
            }
        };
    }
}
