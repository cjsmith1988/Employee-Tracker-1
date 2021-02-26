Insert INTO department (name) VALUES
("Engineering"),
("Sales"),
("Finance"),
("Legal");

Insert INTO role (title,department_id,salary) VALUES
("Lead Engineer",1,150000),
("Software Engineer",1,120000),
("Sales Lead",2,100000),
("Salesperson",2,80000),
("Accountant",3,125000),
("Legal Team Lead",4,250000),
("Lawyer",4,190000);

Insert INTO employee (first_name,last_name,role_id,manager_id) VALUES
("Ashley","Rodriguez",1,NULL),
("Malia","Brown",5,NULL),
("sarah","Lourd",6,NULL),
("John","Doe",3,1),
("Mike","Chan",4,4),
("Kevin","Brown",2,1),
("Tom","Allen",7,3),
("Christian","Eckenrode",1,5);