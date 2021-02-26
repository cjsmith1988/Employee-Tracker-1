const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    // Your MySQL username
    user: 'root',
    // Your MySQL password
    password: '123456',
    database: 'employeeDB'
  });
  
  connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId + '\n');
    createProduct();
  });
  
//   createProduct = () => {
//     console.log('Inserting a new product...\n');
//     const query = connection.query(
//       'INSERT INTO products SET ?',
//       {
//         flavor: 'Rocky Road',
//         price: 3.0,
//         quantity: 50
//       },
//       function(err, res) {
//         if (err) throw err;
//         console.log(res.affectedRows + ' product inserted!\n');
//         // Call updateProduct() AFTER the INSERT completes
//         updateProduct();
//       }
//     );
//     // logs the actual query being run
//     console.log(query.sql);
//   };