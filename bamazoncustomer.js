var inquirer = require('inquirer');
var mysql = require ('mysql2');
var Table = require('cli-table2');
var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'password',
    database : 'bamazon_db',

});

connection.connect();

var display = function(){
connection.query('SELECT*FROM products',(e,res)=>{

    if(e)throw err;
         
    console.log('------------------------')
    console.log ('welcome to Bamazon')
    console.log('---------------------')
    console.log('')
    console.log('find your product below')
    console.log('');
var table = new Table({
    head: ['product id', 'product Description','Cost']
  , colWidths: [12,50,8],
  colAligns:['center','left','right'],
  style:{
      head:['aqua'],
      compact: true
  }
});
for (var i = 0; i<res.length; i++){
    table.push([res[i].item_id,res[i].product_name,res[i].price]);
}
console.log(table.toString());
console.log('');
});
};

var shopping = function(){
    inquirer.prompt({
      name :'productToBuy',
      type: 'input',
      message:'Please enter the product Id of the item you wish to purchase.!' 
    }).then (function(answer1){

        var selection = answer1.productToBuy;
        db.query('SELECT*FROM products WHERE item_id = ?', selection, function(
            err, res){
            if(err) throw err;
            if (res.length ===0){
            console.log('that product is does not exist, please enter a product from the list above')
            
        
       shopping();

    }else{
            inquirer.prompt({
              name :'quantity',
              type: 'input',
              message: 'how many items would you like to purchase?'

            })
            .then(function(answer2){
                var quantity = answer2.quantity;
                if (quantity>res[0].stock_quanty){
                    console.log('Apologies we only have'+res [0].stock_quantity+
                    'item of the product selected'
                    )
                    shopping();
                }else{
                    console.log('');
                    console.log(res[0].product_name+'purchase')
                    console.log(quantity+'qty@$'+res[0].price);

                    var newQuantity = res[0].stock_quantity-quantity;
                    connection.query(
                        'UPDATE products SET stock_quantity='+ newQuantity+'WHERE id='+res[0].id, function(err,resupdate){
                            if(err)throw err;
                            console.log('');
                            console.log('your order has been proceed');
                            console.log('thank you for shopping with us');
                            console.log('');
                            connection.end();
                        }
                    ); 
                }
            });
        }
      
    });
    });
};

display();