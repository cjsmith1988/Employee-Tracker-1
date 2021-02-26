const inquirer = require('inquirer');
const {allEmployees,empByDept,empByManager} = require('./lib/employee.js');
const {allDepartments} = require('./lib/department.js');
const {allRoles} = require('./lib/role.js');

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
                'View the total utilized budget of a department'
            ]
        })
        .then(action =>
        {
            switch(action.task)
            {
                case 'View All Employees':
                    return allEmployees();
                case 'View All Employees By Department':
                    return empByDept();
                case 'View All Employees By Manager':
                    return empByManager();
                case 'Add Employee':
                    break;
                case 'Remove Employee':
                    break;
                case 'Update Employee Role':
                    break;
                case 'Update Employee Manager':
                    break;
                case 'View All Roles':
                    return allRoles();
                case 'Add Role':
                    break;
                case 'Remove Role':
                    break;
                case 'View All Departments':
                    return allDepartments();
                case 'Add Department':
                    break;
                case 'View the total utilized budget of a department':
                    break;
            }
            return;
        })
        .then(res=>
        {
            console.table(res);
            this.queries();
        });
    }
}

// connection.end();


const x = new company();
x.queries();
