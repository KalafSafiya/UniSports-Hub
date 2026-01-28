const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASS,
  {
    host: process.env.MYSQL_HOST,
    port: 3306,        // keep this
    dialect: 'mysql',
    timezone: '+05:30',
    logging: false
  }
);

sequelize.authenticate()
  .then(() => console.log('MySQL connected'))
  .catch(err => console.error('MySQL connection error:', err));

module.exports = sequelize;