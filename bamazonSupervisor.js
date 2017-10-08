var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTab = require('console.table');
var db = require('./db');
var cli = require('./cli.js');


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
            cli.mainTree();
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
    db.query(query,function(err, res) {
        if (err) {
            console.log(err);
        }
        console.log("\n" + "*****Bamazon Total Product Sales and Profit by Department*****" + "\n");
        console.table(res)
        module.exports.SupervisorView();
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
        db.query(query,
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
            module.exports.SupervisorView();
        })
    })
}