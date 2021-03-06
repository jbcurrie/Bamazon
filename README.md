# Bamazon
An inventory app in node.js and mySql.

## [Video Review](https://youtu.be/qEOb88sy_oA)

![](https://media.giphy.com/media/xT9Igys4bK2B1TFRIY/giphy.gif)

### To get started:
1. Clone the repository and install the dependencies using the code below:
```
    git clone https://github.com/jbcurrie/Bamazon.git
    cd Bamazon
    npm install
```   
2. Load the `schema.sql` file into mySQL to create the database. Import the *product.csv* and *department.csv* files into mySQL to populate the database with products.

3. run `node cli.js` in your bash terminal to open the app.
  
* **Technologies:** *node.js*, *mySql*

## Customer View
* `View Store` Customers are prompted to input the ID and quantity of the item they would like to purchase.
* Bamazon checks if the store has enough of the product to meet the customer's request.
* If the order is eligible, the SQL database is updated with the remaining quantity and total product sales
* The customer receives confirmation of their purchase

## Manager View
  * If a manager selects `View Products for Sale`, the app lists every available item: the item IDs, names, prices, and quantities.
  * If a manager selects `View Low Inventory`, Bamazon lists all items with an inventory count lower than five.
  * If a manager selects `Add to Inventory`, Bamazon should displays a prompt that will let the manager "add more" of any item currently in the store.
  * If a manager selects `Add New Product`, Bamazon allows the manager to add a completely new product to the store.

## Supervisor View
   * `View Product Sales by Department` Supervisors can view an updated `total_sales` figure for each department
   * `Create New Department`Supervisors can create a new department.

