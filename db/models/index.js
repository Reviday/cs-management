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
db.Customer = require('./customer')(sequelize, Sequelize);

module.exports = db;
