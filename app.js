const inquirer = require('inquirer');
var connection = require('./db/database');
const cons = require('console.table');
const {allEmployees,empByDept,empByManager,removeEmployee,updateEmpRole,updateManager,addEmployee} = require('./lib/employee.js');
const {allDepartments,removeDept,addDept,budgetByDept} = require('./lib/department.js');
const {allRoles,removeRole,addRole} = require('./lib/role.js');

class company
{
    queries ()
    {
        inquirer.prompt(
        {
            type: 'list',
            name: 'task',
            message: 'What would you like to do?',
            choices: 
            [
                'View All Employees',
                'View All Employees By Department',
                'View All Employees By Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Roles',
                'Add Role',
                'Remove Role',
                'View All Departments',
                'Add Department',
                'Remove Department',
                'View the total utilized budget of a department',
                'Close Application'
            ]
        })
        .then(action =>
        {
            console.log(`
=============================================================================================
                                ${action.task.toUpperCase()}
=============================================================================================
            `);
            switch(action.task)
            {
                case 'View All Employees':
                    return allEmployees();
                case 'View All Employees By Department':
                    return empByDept();
                case 'View All Employees By Manager':
                    return empByManager();
                case 'Add Employee':
                    return addEmployee();
                case 'Remove Employee':
                    return removeEmployee();
                case 'Update Employee Role':
                    return updateEmpRole();
                case 'Update Employee Manager':
                    return updateManager();
                case 'View All Roles':
                    return allRoles();
                case 'Add Role':
                    return addRole();
                case 'Remove Role':
                    return removeRole();
                case 'View All Departments':
                    return allDepartments();
                case 'Add Department':
                    return addDept();
                case 'Remove Department':
                    return removeDept();
                case 'View the total utilized budget of a department':
                    return budgetByDept();
                case 'Close Application':
                    return "end";
            }
            return;
        })
        .then(res=>
        {
            if(res ==="end")
            {
                connection.end();
            }
            else
            {
                console.table(res);
                console.log(`
=============================================================================================
                `);
                this.queries();
            }
        });
    }
}


console.log(`
=============================================================================================
                                START EMPLOYEE TRACKER
=============================================================================================
`);

const x = new company();
x.queries();
