var mysql = require("mysql");
var inquirer = require("inquirer");
var consoleTab = require('console.table');
var idList = [];
var db = require('./db');
var cli = require('./cli.js');

module.exports.viewStore = function () {
    var query = db.query(
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


function buyItems(idList) {
    // setTimeout(function () { 
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
            //check to see if item is in list, else throw an err
            for (var k=0; k < idList.length; k++) {
                if (parseInt(choice.item) === idList[k]) {
                    var truthy = true;
                }
            }

            if (truthy === true) {
                var query = db.query("SELECT item_id,product_name,stock_quantity,price FROM products WHERE ?",
                    {
                        item_id:choice.item
                    },
                function(err, results) {
                    if (err) throw err;
                    // console.log(results);
                    if (results[0].stock_quantity < choice.quantity) { 
                        console.log(`Your order exceeds the store max stock! ${results[0].stock_quantity} ${results[0].product_name} available for purchase.`)
                        buyItems(idList);
                    } else {
                        //passes the item_id and quantity to a function that updates the database
                        var stock = results[0].stock_quantity - choice.quantity
                        var quant = choice.quantity
                        var id = results[0].item_id
                        var item = results[0].product_name
                        var price = results[0].price
                        stockUpdate(stock,id,quant,item,price);
                        productSales(id,quant,price);
                    }
                    
                })
            } else {
                console.log(`Something went wrong with your order. Please enter your item ID and quantity again.`);
                buyItems(idList);
            }
        })
    // },2000);
}

function productSales(id,quant,price) {
    // the price of the product multiplied by the quantity purchased is added to the product's product_sales column.
    
    var query = db.query(`UPDATE products SET product_sales=IFNULL(product_sales,0) + ?*? WHERE item_id=?`,
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
    // Once the customer has placed the order, 
    // application checks if store has enough of the product to meet the customer's request.
    var query = db.query("UPDATE products SET stock_quantity=? WHERE item_id=?",
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
            var total = price * quant
            console.log("\n" + `Your total for ${quant} ${item} is $${total.toFixed(2)}.`+ "\n")
            // setTimeout(function() {
                cli.mainTree();
            // },2000);   
        })
};