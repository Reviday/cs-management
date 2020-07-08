module.exports = (sequelize, DataTypes) => {
    //push
    const Order = sequelize.define('p_order', {
        site: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        telpno: {
            type: DataTypes.STRING(14),
            allowNull: false,
        },
        zipcode: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        detail_addr: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        needs: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        product: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        price_type: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        order_status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        order_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        manager: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        complete_date: {
            type: DataTypes.DATE,
            allowNull: false,
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

    Order.associate = function (models) {
        Order.belongsTo(models.OrderStatusCode, {
            foreignKey: 'order_status',
            targetKey: 'order_status'
        });
    };

    return Order;
};
