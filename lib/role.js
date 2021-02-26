var connection = require('../db/database');
const inquirer = require('inquirer');
const { allDepartments } = require('./department');

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

removeRole = () => 
{
    return new Promise(function(resolve, reject)
    {
        allRoles().then(res =>
        {
            return res.map(role=>role.title);
        })
        .then(res=>
        {
            inquirer.prompt(
            {
                type: 'list',
                name: 'role',
                // message: 'What would you like to do?',
                choices: res
            })
            .then(res=>
            {
                return res.role;
            })
            .then( role =>
            {
                const query = `DELETE FROM role
                               WHERE title = ?;`;
                const param = [role];
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
        });
    });
};

addRole = () => 
{
    return new Promise(function(resolve, reject)
    {
        var deptList=[];
        allRoles()
        .then(res =>
        {
            roleList = res.map(role=>role.id+" "+role.title);
            console.log(roleList);
            return allDepartments();
        })
        .then(res=>
        {
            deptList = res.map(dept=>dept.id+" "+dept.name);
            deptList.unshift("0 No Department");
            return deptList;
        })
        .then(res =>
        {
            inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the role title',
                validate: input => 
                {
                    if (input) 
                    {  
                        for(let i =0;i<roleList.length;i++)
                        {
                            let test = roleList[i].split(' ')[1];
                            if (input === test) 
                            {
                                console.log('You have to enter a unique role title!');
                                return false;
                            }
                        }
                        return true;
                    } 
                    else 
                    {
                        console.log('You need to enter the role title!');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary'
            },
            {
                type: 'list',
                name: 'dept',
                message: 'What is the department?',
                choices: res
            }
            ])
            .then( res =>
            {
                deptId = parseInt(res.dept.split(' ')[0]);
                if(deptId===0)
                {
                    deptId = null;
                }

                const query = `INSERT INTO role (title,salary,department_id)
                               VALUES(?,?,?);`;
                const param = [res.title,res.salary,deptId];
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
        });
    });
};

module.exports = {allRoles,removeRole, addRole};