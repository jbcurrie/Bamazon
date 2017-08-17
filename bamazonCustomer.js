//require inquirer prompt
//require msql
//initiate database
var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTab = require('console.table');
var manager = require("./bamazonManager.js");
var supervisor = require("./bamazonSupervisor.js");
var idList = [];


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
    module.exports.mainTree();
});
// Challenge #1: Customer View

// Then create a Node application called bamazonCustomer.js. Running this application will

//after initiated 'view store' then run options, what would you like to buy, and how many units
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
                viewStore();
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

function viewStore() {
    var query = connection.query(
    "SELECT item_id,product_name,style_color,price FROM products",
    function(err, res) {
        console.log("\n" + "*****Bamazon Store*****" + "\n")
        console.table(res);
        for (obj in res) {
            idList.push(res[obj].item_id);
        }
        // console.log(idList);
        return buyItems(idList)
    })
}
// first display all of the items available for sale. 
// Include the ids, names, and prices of products for sale.

// The app should then prompt users with two messages.
function buyItems(idList) {
        // The first should ask them the ID of the product they would like to buy.
        // The second message should ask how many units of the product they would like to buy.
        //create an array of product objects, display the product name in inquirer and use the item id as an object key for the thenable function
    setTimeout(function () { 
        debugger;
        inquirer.prompt([
            {
                type:"input",
                name:"item",
                message:"Enter the item id for the product you would like to purchase"
            },
            {
                type:"input",
                name:"quantity",
                message:"Please indicate the quantity"
            },
        ]).then(function(choice) {
            // console.log(idList);
            for (var k=0; k < idList.length; k++) {
                if (parseInt(choice.item) === idList[k]) {
                    var truthy = true;
                    //function(result,res)
                    //check if quantity is too high and if product is in database
                    //select the quantity for the item id 
                    // SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1
                }
            }

            if (truthy === true) {
                var query = connection.query("SELECT item_id,product_name,stock_quantity,price FROM products WHERE ?",
                    {
                        item_id:choice.item
                    },
                function(err, results) {
                    if (err) throw err;
                    // console.log(results);
                    //if quantity is greater than user input, subtrack user input from quantity and use the result for the next function
                        // console.log(results[0].stock_quantity);
                        // console.log(choice.quantity);
                        // console.log(results[0].item_id);
                    if (results[0].stock_quantity < choice.quantity) { 
                        console.log(`Your order exceeds the store max stock! ${results[0].stock_quantity} ${results[0].product_name} available for purchase.`)
                        buyItems(idList);
                    } else {
                        var stock = results[0].stock_quantity - choice.quantity
                        var quant = choice.quantity
                        var id = results[0].item_id
                        var item = results[0].product_name
                        var price = results[0].price
                        stockUpdate(stock,id,quant,item,price);
                        productSales(id,quant,price);
                    }
                    //then pass the item_id and quantity to a function that updates the database
                })
            } else {
                console.log(`Something went wrong with your order. Please enter your item ID and quantity again.`);
                buyItems(idList);
            }
        })
    },2000);
}

function productSales(id,quant,price) {
    // Modify your bamazonCustomer.js app so that when a customer purchases anything from the store, 
    // the price of the product multiplied by the quantity purchased is added to the product's product_sales column.
    
    var query = connection.query(`UPDATE products SET product_sales=IFNULL(product_sales,0) + ?*? WHERE item_id=?`,
        [
            quant,
            price,
            id
        ],
        function(err,res) {
            if (err) {
                console.log(err)
            }
            // console.log(res);
        })
}

function stockUpdate(stock,id,quant,item,price) {
    //are you sure you want to purchase...
    // console.log(`${stock} ${id} ${quant} ${item} ${price}`);
    // Once the customer has placed the order, 
    // your application should check if your store has enough of the product to meet the customer's request.
    // SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1
    var query = connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?",
        [
            stock,
            id
        ],
        function(err,res) {
            if (err) {
                console.log(err)
            }
            // console.log(res);
            //update the total price of the order 
            //your total purchase (item name, quant) is price
            var total = price * quant
            console.log("\n" + `Your total for ${quant} ${item} is $${total}.`+ "\n")
            setTimeout(function() {
                module.exports.mainTree();
            },2000);   
        })
};


// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.
// However, if your store does have enough of the product, you should fulfill the customer's order.
// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.