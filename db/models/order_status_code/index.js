module.exports = (sequelize, DataTypes) => {
    return sequelize.define('order_status_codes',{
        id : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey: true
        },
        order_status : {
            type : DataTypes.INTEGER,
            allowNull : false,
        },
        status_name : {
            type : DataTypes.STRING(10),
            allowNull : false,
        },
        create_at : {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull : false,
        },
        update_at : {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull : false,
        }
    },{
        timestamps : false
    });
};
