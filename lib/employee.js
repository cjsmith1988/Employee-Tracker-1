var connection = require('../db/database');
const {allDepartments} = require('./department.js');
const inquirer = require('inquirer');
const cTable = require('console.table');

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

module.exports = {allEmployees,empByDept,empByManager};