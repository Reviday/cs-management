module.exports = (sequelize, DataTypes) => {
    return sequelize.define('custom_info',{
        site : {
            type : DataTypes.STRING(10),
            allowNull : false,
        },
        name : {
            type : DataTypes.STRING(10),
            allowNull : false,
        },
        telpno : {
            type : DataTypes.STRING(14),
            allowNull : false,
        },
        address :{
            type : DataTypes.TEXT,
            allowNull : true
        },
        interest_style :{
            type : DataTypes.TEXT,
            allowNull : true
        },
        interest_skin : {
            type : DataTypes.TEXT,
            allowNull : true
        },
        birth : {
            type : DataTypes.DATE,
            allowNull : true
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
