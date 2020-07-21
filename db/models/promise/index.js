module.exports = (sequelize, DataTypes) => {
    return sequelize.define('c_promises', {
        id : {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        site: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        telpno: {
            type: DataTypes.STRING(14),
            allowNull: false
        },
        start_date: {
            type: 'TIMESTAMP',
            allowNull: false
        },
        end_date: {
            type: 'TIMESTAMP',
            allowNull: false
        },
        memo: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        meeting_category: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        create_at: {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
        },
        update_at: {
            type: 'TIMESTAMP',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
        },
    }, {
        timestamps: false
    });
};
