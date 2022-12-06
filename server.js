import mysql from "mysql2";
import inquirer from "inquirer";
import { resolvePtr } from "dns";

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "9richardlane",
    database: "company_db",
  },
  console.log(`Connected to the company_db database.`)
);

let menu = {
  name: "menu",
  type: "list",
  message: "select your option",
  choices: [
    {
      value: "View all departments",
      key: "view-all-departments",
    },
    {
      value: "View all roles",
      key: "view-all-roles",
    },
    {
      value: "View all employees",
      key: "view-all-employees",
    },
    {
      value: "Add a department",
      key: "add-a-department",
    },
    {
      value: "Add a role",
      key: "add-a-role",
    },
    {
      value: "Add an employee",
      key: "add-an-employee",
    },
    {
      value: "Update an employee role",
      key: "update-an-employee-role",
    },
  ],
};

let init = async () => {
  let choice = await inquirer.prompt(menu);
  console.log(choice);
  if (choice.menu == "View all departments") {
    viewalldepartments();
  } else if (choice.menu == "View all roles") {
    viewallroles();
  } else if (choice.menu == "View all employees") {
    viewallemployees();
  } else if (choice.menu == "Add a department") {
    addnewdepartment();
  } else if (choice.menu == "Add a role") {
    addnewrole();
  } else if (choice.menu == "Add an employee") {
    addemployee();
  } else if (choice.menu == "Update an employee role"){
    updaterole();
  }
};
init();

let viewalldepartments = () => {
  db.query("SELECT * FROM department", (err, result) => {
    console.table(result);
  });
};

let viewallroles = () => {
  db.query(
    "SELECT department.*, role.*, role.id AS role_id FROM role INNER JOIN department on role.department_id = department.id",
    (err, result) => {
      console.table(result);
    }
  );
};

let viewallemployees = () => {
  db.query(
    `SELECT e.id AS "Employee ID", 
  e.first_name AS "First Name",
  e.last_name AS "Last Name",
  role.title AS "Role Title",
  department.name AS "Department",
  role.salary AS "Salary",
  CONCAT(m.first_name, ' ', m.last_name) AS "Manager Name"
  FROM employee e
  LEFT JOIN role ON e.role_id = role.id
  LEFT JOIN employee m ON m.id = e.manager_id
  LEFT JOIN department ON role.department_id = department.id
`,
    (err, result) => {
      console.table(result);
    }
  );
};

let addnewdepartment = async () => {
  const departmentquestions = {
    name: "name",
    type: "input",
    message: "enter department name",
  };

  let answer = await inquirer.prompt(departmentquestions);
  let departmentname = answer.name;
  db.query(
    "INSERT INTO department (name) VALUES (?)",
    [departmentname],
    (err, result) => {
      console.log("department added");
      console.log(err);
    }
  );
};

let addnewrole = async () => {
  const rolequestions = [
    {
      name: "role",
      type: "input",
      message: "enter role",
    },
    {
      name: "salary",
      type: "input",
      message: "enter salary",
    },
    {
      name: "department",
      type: "input",
      message: "enter department_id",
    },
  ];

  let answer = await inquirer.prompt(rolequestions);
  db.query(
    "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)",
    [answer.role, answer.salary, answer.department],
    (err, result) => {
      console.log("role added");
    }
  );
};

let addemployee = async () => {
  const employeequestion = [
    {
      name: "firstname",
      type: "input",
      message: "enter first name",
    },
    {
      name: "lastname",
      type: "input",
      message: "enter last name",
    },
    {
      name: "role",
      type: "input",
      message: "enter role id",
    },
    {
      name: "manager",
      type: "input",
      message: "enter manager id",
    },
  ];
  let answer = await inquirer.prompt(employeequestion);
  db.query(
    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
    [answer.firstname, answer.lastname, answer.role, answer.manager],
    (err, result) => {
      console.log("employee added");
      console.log(err);
    }
  );
};

let updaterole = () => {
  db.query("SELECT * FROM employee", async (err, result) => {
    let employeeid = [];

    for (let i = 0; i < result.length; i++) {
      employeeid.push(result[i].id);

    }
    let question = [
        {
          name: "employeeid",
          type: "list",
          choices: employeeid,
          message: "select employee id"
        },
        {
            name: "role",
            type: "input",
            message: "enter role id"
          }
      ];
      let answer = await inquirer.prompt(question)
      db.query("UPDATE employee SET role_id = ? WHERE id = ?", [answer.role, answer.employeeid], (err, result) => {
        console.log("employee role updated");
      })
  });

  
};
