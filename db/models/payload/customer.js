const APPROOT = require('app-root-path');
const {Sequelize: {Op}} = require(`${APPROOT}/db/models`);
module.exports = {
    selectQueryByCustomer: function (reqParams) {
        const start = reqParams.start;
        const searchWord = reqParams.search_word;
        const searchField = reqParams.search_field;

        const result = {
            limit: 10,
            offset: (10 * start) - 10,
            order: [
                ['create_at', 'DESC']
            ]
        };

        if (searchField !== '' && searchField !== '') {
            result.where = {};
            result.where[searchField] = {
                [Op.like]: "%" + searchWord + "%"
            };
        }

        return result;
    },
    selectQueryById: function (reqParams) {
        const name = reqParams.name;
        const telpno = reqParams.telpno;
        return {
            where: {
                name: name,
                telpno: telpno
            }
        };
    },
    updateQueryById: function (reqParams) {

    }

}
