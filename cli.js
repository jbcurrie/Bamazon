//require customer, manager, supervisor
    //all decision trees go here
var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTab = require('console.table');
var manager = require("./bamazonManager.js");
var supervisor = require("./bamazonSupervisor.js");
var customer = require("./bamazonCustomer.js")
var db = require('./db');

module.exports.mainTree = function() {
    inquirer.prompt([
        {
            type:"list",
            name:"option",
            message:"Welcome to Bamazon!" + "\n" + "What would you like to do?",
            choices:[new inquirer.Separator(),"View Store","Manage Inventory","Supervisor View"]
        }
    ]).then(function(result){
        switch (result.option) {
            case "View Store":
                customer.viewStore();
                break;

            case "Manage Inventory":
                manager.managerView();
                break;

            case "Supervisor View":
                supervisor.SupervisorView();
                break;
        }
    })
}
module.exports.mainTree()