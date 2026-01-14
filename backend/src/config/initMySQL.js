const mysql = require('mysql2/promise');
require('dotenv').config();

async function initMySQL() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS
    });

    await connection.query(
        `CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DB}\``
    );

    console.log('MySQL database ensured');
    await connection.end();
}

module.exports = initMySQL;
