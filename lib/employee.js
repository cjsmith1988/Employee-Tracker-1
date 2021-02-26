var connection = require('../db/database');
const {allDepartments} = require('./department.js');
const {allRoles} = require('./role.js');
const inquirer = require('inquirer');

allEmployees = () => 
{   
    const query = `SELECT emp1.id, emp1.first_name, emp1.last_name, role.title, dept.name AS Department, role.salary, CONCAT_WS(' ', emp2.first_name, emp2.last_name ) AS Manager
    FROM employee AS emp1 LEFT JOIN employee AS emp2 
    ON emp1.manager_id = emp2.id
    LEFT JOIN role
    ON emp1.role_id = role.id
    LEFT JOIN department as dept
    ON role.department_id = dept.id
    order by emp1.id;`;
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

allManagers = () => 
{   
    const query = `SELECT distinct emp2.id, CONCAT_WS(' ', emp2.first_name, emp2.last_name ) AS Manager
    FROM employee AS emp1 LEFT JOIN employee AS emp2 
    ON emp1.manager_id = emp2.id
    where emp2.first_name is NOT NULL
    order by emp2.id;`;
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

empByDept = () => 
{
    return new Promise(function(resolve, reject)
    {
        allDepartments().then(res =>
        {
            return res.map(dept=>dept.name);
        })
        .then(res=>
        {
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
                const query = `SELECT emp1.id, emp1.first_name, emp1.last_name, role.title, dept.name AS Department, role.salary, CONCAT_WS(' ', emp2.first_name, emp2.last_name ) AS Manager
                FROM employee AS emp1 LEFT JOIN employee AS emp2 
                ON emp1.manager_id = emp2.id
                LEFT JOIN role
                ON emp1.role_id = role.id
                LEFT JOIN department as dept
                ON role.department_id = dept.id
                where dept.name = ?
                order by emp1.id;`;
                const param = [dept];
                connection.query(query,param,(err, res)=> 
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
        });
    });
};

empByManager = () => 
{
    return new Promise(function(resolve, reject)
    {
        allManagers().then(res =>
        {
            return res.map(man=>man.Manager);
        })
        .then(res=>
        {
            inquirer.prompt(
            {
                type: 'list',
                name: 'manager',
                // message: 'What would you like to do?',
                choices: res
            })
            .then(res=>
            {
                return res.manager;
            })
            .then( manager =>
            {
                const query = `SELECT emp1.id, emp1.first_name, emp1.last_name, role.title, dept.name AS Department, role.salary, CONCAT_WS(' ', emp2.first_name, emp2.last_name ) AS Manager
                FROM employee AS emp1 LEFT JOIN employee AS emp2 
                ON emp1.manager_id = emp2.id
                LEFT JOIN role
                ON emp1.role_id = role.id
                LEFT JOIN department as dept
                ON role.department_id = dept.id
                having Manager = ?
                order by emp1.id;`;
                const param = [manager];
                connection.query(query,param,(err, res)=> 
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
        });
    });
};

removeEmployee = () => 
{
    return new Promise(function(resolve, reject)
    {
        allEmployees().then(res =>
        {
            return res.map(man=>man.first_name+' '+man.last_name);
        })
        .then(res=>
        {
            inquirer.prompt(
            {
                type: 'list',
                name: 'employee',
                // message: 'What would you like to do?',
                choices: res
            })
            .then(res=>
            {
                return res.employee;
            })
            .then( employee =>
            {
                const [first,last] = employee.split(' ');
                const query = `DELETE FROM employee
                               WHERE first_name = ? AND last_name = ?;`;
                const param = [first,last];
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

updateEmpRole = () => 
{
    return new Promise(function(resolve, reject)
    {
        var empList=[];
        var roleList = [];
        allEmployees()
        .then(res =>
        {
            empList = res.map(emp=>emp.first_name+' '+emp.last_name);
            return allRoles();
        })

        .then(res =>
        {
            roleList = res.map(role=>role.id+" "+role.title);
            role.unshift('0 No Role');
            return {empList, roleList};
        })
        .then(res=>
        {
            console.log(res);
            inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Choose employee you want to update role for?',
                choices: res.empList
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is the new role?',
                choices: res.roleList
            }
            ])
            .then( res =>
            {
                const [first,last] = res.employee.split(' ');
                let role_id =parseInt(res.role.split(' ')[0]);
                if (role_id === 0) 
                {
                    role_id = null;
                }
                const query = `UPDATE employee
                               SET role_id = ?
                               WHERE first_name = ? AND last_name = ?;`;
                const param = [role_id,first,last];
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

updateManager = () => 
{
    return new Promise(function(resolve, reject)
    {
        var empList=[];
        var managerList = [];
        var emp_id ;
        allEmployees()
        .then(res =>
        {
            empList = res.map(emp=>emp.id+" "+emp.first_name+' '+emp.last_name);

            managerList = res.map(man=>man.id+" "+man.first_name+' '+man.last_name);
            managerList.unshift('0 No Manager');
            return {empList, managerList};
        })
        .then(res=>
        {
            // console.log(res);
            inquirer.prompt(
            {
                type: 'list',
                name: 'employee',
                message: 'Choose employee you want to update MAnager for?',
                choices: res.empList
            })
            .then(res=>
            {
                emp_id = res.employee.split(' ')[0];
                managerList = managerList.filter(item=>res.employee!==item);
                inquirer.prompt(
                {
                    type: 'list',
                    name: 'manager',
                    message: 'who is the new manager?',
                    choices: managerList
                })
                .then( res =>
                {        
                    let manager_id = parseInt(res.manager.split(' ')[0]);
                    if(manager_id===0)
                    {
                        manager_id = null;
                    }
                    const query = `UPDATE employee
                                   SET manager_id = ?
                                   WHERE id = ?;`;
                    const param = [manager_id,emp_id];
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
    });
};

addEmployee = () => 
{
    return new Promise(function(resolve, reject)
    {
        var managerList=[];
        var roleList = [];
        allEmployees()
        .then(res =>
        {
            managerList = res.map(emp=>emp.id+' '+emp.first_name+' '+emp.last_name);
            managerList.unshift('0 No Manager');
            return allRoles();
        })
        .then(res =>
        {
            roleList = res.map(role=>role.id+" "+role.title);
            roleList.unshift('0 No Role');
            return {managerList, roleList};
        })
        .then(res =>
        {
            inquirer.prompt([
            {
                type: 'input',
                name: 'first',
                message: 'Enter the employee first name',
                validate: input => 
                {
                    if (input) 
                    {
                    return true;
                    } else {
                    console.log('You need to enter the employee first name!');
                    return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'last',
                message: 'Enter the employee last name',
                validate: input => 
                {
                    if (input) 
                    {
                    return true;
                    } else {
                    console.log('You need to enter the employee last name!');
                    return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'role',
                message: 'Choose the role?',
                choices: res.roleList
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Who is the new manager?',
                choices: res.managerList
            }
            ])
            .then( res =>
            {
                let roleId = parseInt(res.role.split(' ')[0]);
                let managerId = parseInt(res.manager.split(' ')[0]);
                if(roleId===0)
                {
                    roleId = null;
                }
                if(managerId===0)
                {
                    managerId = null;
                }
                const query = `INSERT INTO employee (first_name,last_name,role_id,manager_id)
                               VALUES(?,?,?,?);`;
                const param = [res.first,res.last,roleId,managerId];
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

module.exports = 
{
    allEmployees,
    empByDept,
    empByManager,
    removeEmployee,
    updateEmpRole,
    updateManager,
    addEmployee
};