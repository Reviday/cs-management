'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const configFile = require(__dirname + '/../config/config.json');
const runMode = configFile.runMode;
const config = configFile[runMode];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.log('Unable to connect to the database:', err);
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Order = require('./order')(sequelize, Sequelize);
db.OrderStatusCode = require('./order_status_code')(sequelize, Sequelize);
db.Customer = require('./customer')(sequelize, Sequelize);
db.Members = require('./members')(sequelize, Sequelize);

//OrderStatusCode.hasOne(Order, {foreignKey : 'order_status'});
// ON `p_order`.`order_status` = `order_status_code`.`order_status`
db.Order.hasOne(db.OrderStatusCode, {foreignKey : 'order_status', sourceKey : 'order_status'});
// `belongsTo` inserts the association key in the source model
db.OrderStatusCode.belongsTo(db.Order, {foreignKey: 'order_status', targetKey :'order_status'});

module.exports = db;
