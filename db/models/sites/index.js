module.exports = (sequelize, DataTypes) => {
    return sequelize.define('sites', {
        site: {
            type: DataTypes.STRING(10),
            allowNull: false,
            primaryKey: true
        },
        s_code: {
            type: DataTypes.INTEGER,
            allowNull: false,

            primaryKey: true
        }
    }, {
        timestamps: false
    });
};
