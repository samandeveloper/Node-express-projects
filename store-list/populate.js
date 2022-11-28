//we want to create this file as the items and dynamicly invoke it in mongoosedb atlas
//see the products.json
//Attention: while working with this file in terminal>>cntl+c then node product.js


require('dotenv').config()
const connectDB = require('./db/connect')
const Product = require('./models/product')
const jsonProducts = require('./products.json') 


//we want to connect to the database and then use the model to automatically add those json products
//we want to remove all the products that are currently there and then use the create and pass the json product
//Attention: products.json in the array of objects so we can use .create method and pass the whole of it to the database
const start  = async()=>{
    try{
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany()  //optional:in Product (models>>product.js) we don't have any product but we are making sure that if we have some products in that file first delete them ALL using deleteMany() method
        //read: https://mongoosejs.com/docs/api.html#model_Model-create
        await Product.create(jsonProducts)  //terminal node populate.js>>answer in terminal: success, answer in mongoosedb atlas>> 04-STORE_API is created with all the products
        console.log('success')      //in trminal >> node populate >>answer:success
        //we use the exit method ( process.exit() ) since we generate our file once and we don't want to continue the code
        process.exit(0)    //0 means everything went well 
        //if in terminal>>populate then answer:success and then it will the exit automatically (cntl+c)
    }catch(error){
        console.log(error)
        process.exit(1)     //1 is when we pas for the error code
    }
}

start()