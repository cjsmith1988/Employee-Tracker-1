var connection = require('../db/database');
const inquirer = require('inquirer');

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

removeDept = () => 
{
    return new Promise(function(resolve, reject)
    {
        allDepartments().then(res =>
        {
            return res.map(dept=>dept.name);
        })
        .then(res=>
        {
            // console.log(res);
            inquirer.prompt(
            {
                type: 'list',
                name: 'dept',
                // message: 'What would you like to do?',
                choices: res
            })
            .then(res=>
            {
                return res.dept;
            })
            .then( dept =>
            {
                const query = `DELETE FROM department
                               WHERE name = ?;`;
                const param = [dept];
                connection.query(query,param,function (err, res) 
                {
                    if (err)
                    {
                        reject(err);
                        return;
                    }
                    else
                    {
                        resolve(
                            {
                                message: "Removed Department successfully",
                                affectedRows: res.affectedRows
                            });
                    }
                });
            });
        });
    });
};

addDept = () => 
{
    return new Promise(function(resolve, reject)
    {
        var deptList=[];
        allDepartments()
        .then(res =>
        {
            deptList = res.map(dept=>dept.name);
            return deptList;
        })
        .then(res =>
        {
            inquirer.prompt(
            {
                type: 'input',
                name: 'name',
                message: 'Enter the department name',
                validate: input => 
                {
                    if (input) 
                    {
                        for(let i =0; i<deptList.length;i++)
                        {
                            if (input=== deptList[i]) 
                            {
                                console.log('You need to enter a unique department name!');
                                return false;
                            }
                        }
                        return true;
                    } else {
                    console.log('You need to enter the department name!');
                    return false;
                    }
                }
            })
            .then( res =>
            {

                const query = `INSERT INTO department (name)
                               VALUES(?);`;
                const param = [res.name];
                connection.query(query,param,function (err, res) 
                {
                    if (err)
                    {
                        reject(err);
                        return;
                    }
                    else
                    {
                        resolve(
                            {
                                message: "Added Department successfully",
                                affectedRows: res.affectedRows
                            });
                    }
                });
            });
        });
    });
};

budgetByDept = () => 
{
    return new Promise(function(resolve, reject)
    {
        const query = `select department.name as Department, sum(role.salary) AS Budget
                       from role right join department
                       on department.id = role.department_id
                       group by department.name;`;
        const param = [];
        connection.query(query,param,function (err, res) 
        {
            if (err)
            {
                reject(err);
                return;
            }
            else
            {
                // console.log(this.change);
                resolve(res);
            }
        });        
    });
};


module.exports = {allDepartments,removeDept,addDept,budgetByDept};