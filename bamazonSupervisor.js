// Challenge #3: Supervisor View (Final Level)
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
            //  the app should list every available item: the item IDs, names, prices, and quantities.
            break;

            case "Create New Department":
            newDepartment();
            //  the app should list every available item: the item IDs, names, prices, and quantities.
            break;

            case "Main Menu":
            customer.mainTree();
            break;
        };
    });
};

function viewProdSales() {
    // When a supervisor selects View Product Sales by Department, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.
    // department_id	department_name	over_head_costs	product_sales	total_profit
    // 01	             Electronics	  10000	           20000	        10000
    // 02	             Clothing	      60000	           100000	        40000
    // The total_profit column should be calculated on the fly using the difference between over_head_costs and product_sales. total_profit should not be stored in any database. You should use a custom alias.
    // If you can't get the table to display properly after a few hours, then feel free to go back and just add total_profit to the departments table.
    //join product sales 
    //create alias for total_profit
    //combine all departments into one category
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
        console.table(res)
        setTimeout(function() {
        module.exports.SupervisorView();
        },1000);
    })
    
}

function newDepartment() {
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

// Make sure your app still updates the inventory listed in the products column.
// Create another Node app called bamazonSupervisor.js. Running this application will list a set of menu options:
// View Product Sales by Department
// Create New Department

// Hint: You may need to look into aliases in MySQL.
// Hint: You may need to look into GROUP BYs.
// Hint: You may need to look into JOINS.
// HINT: There may be an NPM package that can log the table to the console. What's is it? Good question :)