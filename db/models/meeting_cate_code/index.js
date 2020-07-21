module.exports = (sequelize, DataTypes) => {
    return sequelize.define('meeting_codes',{
        meeting_category : {
            type : DataTypes.INTEGER,
            allowNull : false,
            primaryKey: true
        },
        disc : {
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
