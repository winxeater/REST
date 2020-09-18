const mysql = require('mysql');

var pool = mysql.createPool({
    "user" : "root",//process.env.MYSQL_USER,
    "password" : "123",//process.env.MYSQL_PASS,
    "database" : "test",//process.env.MYSQL_DB,
    "host" : "localhost",//process.env.MYSQL_HOST,
    "port" : 3306//process.env.MYSQL_PORT
})

exports.pool = pool;