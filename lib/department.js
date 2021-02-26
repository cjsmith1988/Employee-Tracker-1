var connection = require('../db/database');
const cTable = require('console.table');

allDepartments = () => 
{
    const query = `SELECT *
                   FROM department
                   order by id;`;
    return new Promise(function(resolve, reject)
    {
        connection.query(query,(err, res)=> 
        {
            if (err)
            {
                reject(err);
                return;
            }
            else
            {
                resolve(res);
            }
        });
    });
};

module.exports = {allDepartments};