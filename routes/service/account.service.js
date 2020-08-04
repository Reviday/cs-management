const APPROOT = require('app-root-path');
const Util = require(`${APPROOT}/util/util`);
const Members = require(`${APPROOT}/db/models`).Members;
const Sites = require(`${APPROOT}/db/models`).Sites;

// push
module.exports = {
    selectMemberById: async (reqParams) => {
        try {
            const result = await Members.findByPk(reqParams.id);
            if (result !== null) {
                const encryptedPassword = result.dataValues.pass;
                if (!encryptedPassword) {
                    return false;
                }
                const checksum = Util.encryptPasswd(encryptedPassword, reqParams.password);
                if (!checksum) {
                    return false;
                }
                return result.dataValues;
            } else {
                return false;
            }


        } catch (err) {
            throw err;
        }
    },
    selectListBySite: async () => {
        try {
            return await Sites.findAll();
        } catch (err) {
            throw err;
        }

    }
};
