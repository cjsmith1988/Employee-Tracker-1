const mysql = require('mysql2');

const connection = mysql.createConnection(
{
    host: 'localhost',
    // port: 3306,
    user: 'root',
    password: '123456',
    database: 'companyDB'
});
  
connection.connect(err => 
{
    if (err) throw err;
    // console.log('connected as id ' + connection.threadId + '\n');
});

module.exports = connection;