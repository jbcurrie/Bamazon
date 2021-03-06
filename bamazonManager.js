var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTab = require('console.table');
var db = require('./db');
var cli = require('./cli.js');

module.exports.managerView = function() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "Menu Options",
            choices:[new inquirer.Separator(),"View Products for Sale","View Low Inventory","Add to Inventory","Add New Product","Main Menu"]
        }
    ]).then(function(result) {
        switch (result.options) {
            case "View Products for Sale":
            viewProducts();
            //  lists manager view of items
            break;
            
            case "View Low Inventory":
            lowInventory();
            //  lists all items with an inventory count lower than five.
            break;

            case "Add to Inventory":
            addInventory();
            // prompt to let the manager "add more" of any item currently in the store.
            break;

            case "Add New Product":
            addProduct();
            // allows the manager to add a completely new product to the store.
            break;

            case "Main Menu":
            cli.mainTree();
            break;
        }
    })
}

function viewProducts() {
    var query = db.query("SELECT * FROM products",function(err, results) {
        console.log("\n" + "*****Bamazon Inventory*****" + "\n");
        console.table(results);
        module.exports.managerView()
    })
};

function lowInventory() {
    var query = "SELECT item_id,product_name,stock_quantity FROM products WHERE stock_quantity < 5";
    db.query(query, function(err, res) {
        if (err) {
            console.log(err)
        }
        console.table(res);
        module.exports.managerView()
    });
};

function addInventory() {
    inquirer.prompt([
        {
            type:"input",
            name:"item",
            message:"Enter ID"
        },
        {
            type:"input",
            name:"stock",
            message:"Enter quantity"
        }

    ]).then(function(result) {
        var query = "UPDATE products SET stock_quantity=stock_quantity+? WHERE item_id=?";
        db.query(query,
        [
            result.stock,
            result.item
        ],
        function(err, res) {
            if (err) {
                console.log(err);
            }
            // console.log(res);
            console.log(`${result.stock} of this item added to Item_ID=${result.item}.`)
        })
            module.exports.managerView()
    })
};

function addProduct() {
    inquirer.prompt([
        {
            type:"input",
            name:"product",
            message:"Product Name",
        },
                {
            type:"input",
            name:"style",
            message:"Style/Color",
        },
                {
            type:"input",
            name:"dept",
            message:"Department",
        },
        {
            type:"input",
            name:"price",
            message:"Price",
        },
        {
            type:"input",
            name:"quantity",
            message:"Quantity",
        }
    ]).then(function(result){
        var query = "INSERT INTO products (product_name, style_color, department_name, price, stock_quantity) VALUES (?, ?, ?, ?, ?)";
        db.query(query,
        [
            result.product,
            result.style,
            result.dept,
            result.price,
            result.quantity
        ],
        function(err, res) {
            if (err) {
                console.log(err);
            }
            // console.log(res);
            console.log(`New Product` + "\n" + `Name:${result.product} Style:${result.style} Dept:${result.dept} Price:${result.price} Quantity:${result.quantity}`)
            module.exports.managerView()
        })
    })
}

