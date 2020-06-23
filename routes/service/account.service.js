const APPROOT = require('app-root-path');
const Util = require(`${APPROOT}/util/util`);
const Members = require(`${APPROOT}/db/models`).Members;


module.exports = {
    selectMemberById: async (reqParams) => {
        try {
            const result = await Members.findByPk(reqParams.id);
            const encryptedPassword = result.dataValues.pass;
            const checksum = Util.encryptPasswd(encryptedPassword, reqParams.password);
            if(!checksum){
                return false;
            }
            return result.dataValues;
        } catch (err) {
            throw err;
        }
    }
};
