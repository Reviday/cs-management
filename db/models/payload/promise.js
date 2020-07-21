const APPROOT = require('app-root-path');
const Util = require(`${APPROOT}/util/util.js`);
const db = require(`${APPROOT}/db/models`);
const {Sequelize, Sequelize:{Op}} = require(`${APPROOT}/db/models`);
module.exports = {
    selectQueryByAll: function (reqParams) {
        const betweenDay = Util.getNowMonthDay(reqParams.nowMonth);
        return {
            attributes: [
                "id",
                "site",
                "name",
                "telpno",
                [Sequelize.fn('DATE_FORMAT',
                    Sequelize.col('start_date'),'%Y-%m-%d %H:%i'), 'start_date'],
                [Sequelize.fn('DATE_FORMAT',
                    Sequelize.col('end_date'),'%Y-%m-%d %H:%i'), 'end_date'],
                "memo",
                "meeting_category"
            ],
            include: [{
                model: db.MeetingCateCode,
                required: false,
                attributes: ["disc"]
            }],
            where : {
                start_date : {
                    [Op.between]: [betweenDay.startDay,betweenDay.endDay]
                },
                end_date : {
                    [Op.between]: [betweenDay.startDay,betweenDay.endDay]
                }
            }
        };
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
