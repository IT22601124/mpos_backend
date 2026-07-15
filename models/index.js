'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const baseConfig = require(__dirname + '/../config/config.json')[env];
const config = {
  ...baseConfig,
  username: process.env.DB_USER || baseConfig.username,
  password: Object.prototype.hasOwnProperty.call(process.env, 'DB_PASSWORD')
    ? process.env.DB_PASSWORD
    : baseConfig.password,
  database: process.env.DB_NAME || baseConfig.database,
  host: process.env.DB_HOST || baseConfig.host,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : baseConfig.port
};
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
