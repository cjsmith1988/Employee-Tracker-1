var connection = require('../db/database');
const cTable = require('console.table');

allRoles = () => 
{
    const query = `SELECT role.id, role.title, role.salary, department.name AS Department
                   FROM role left join department
                   ON role.department_id = department.id
                   order by role.id;`;
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

module.exports = {allRoles};