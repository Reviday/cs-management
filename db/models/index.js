'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const configFile = require(__dirname + '/../config/config.json');
const runMode = configFile.runMode;
const config = configFile[runMode];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Order = require('./order')(sequelize, Sequelize);

module.exports = db;
