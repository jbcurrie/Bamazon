var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTab = require('console.table');
var customer = require("./bamazonCustomer.js")

var connection = mysql.createConnection({
    host: "localhost",
    port:3306, 
    user:"root",
    password:"password",
    database: "bamazonDB"
})

connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
//   console.log("connected as id: " + connection.threadId);
});

module.exports.SupervisorView = function() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "Menu Options",
            choices:[new inquirer.Separator(),"View Product Sales by Department","Create New Department","Main Menu"]
        }
    ]).then(function(result) {
        switch (result.options) {
            case "View Product Sales by Department":
            viewProdSales();
            break;

            case "Create New Department":
            newDepartment();
            break;

            case "Main Menu":
            customer.mainTree();
            break;
        };
    });
};

function viewProdSales() {
//lists product sales by Department
     var query = "SELECT products.department_name,SUM(products.product_sales) AS product_sales,departments.over_head_costs,";
        query+= " (SUM(products.product_sales) - departments.over_head_costs) AS total_profit";
        query+= " FROM products INNER JOIN departments";
        query+= " ON products.department_name = departments.department_name";
        query+= " WHERE products.department_name = departments.department_name";
        query+= " GROUP BY department_name";
    connection.query(query,function(err, res) {
        if (err) {
            console.log(err);
        }
        // console.log(res);
        console.table(res)
        setTimeout(function() {
        module.exports.SupervisorView();
        },1000);
    })
    
}

function newDepartment() {
    //create new dept. 
    inquirer.prompt([
        {
            type:"input",
            name:"dept",
            message:"Enter the Department Title"
        },
                {
            type:"input",
            name:"overhead",
            message:"Enter the Department Overhead"
        }  
    ]).then(function(results){
        var query = `INSERT INTO departments (department_name,over_head_costs) VALUES (?,?)`;
        connection.query(query,
        [
            results.dept,
            results.overhead
        ],
        function(err,res) {
            if (err) {
                console.log(err);
            }
            // console.log(res);
            console.log(`New Department Added` + "\n" + `Dept:${results.dept} Overhead:${results.overhead}`)
            setTimeout(function() {
                module.exports.SupervisorView();
            },1000);
        })
    })
}