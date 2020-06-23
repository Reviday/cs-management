module.exports = (sequelize, DataTypes) => {
    const Members = sequelize.define('members', {
        id: {
            type: DataTypes.STRING(15),
            allowNull: false,
            primaryKey: true
        },
        pass: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        site: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        auth: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
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
        }
    }, {
        timestamps: false
    });


    return Members;
};
