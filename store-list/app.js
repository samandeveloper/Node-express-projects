//we didn't create frontend for this project. we have some products and we want to search between them using search box, or category or color,...

//connect to .env
require('dotenv').config()
//import async errors-asyncWrapper package :express-async-errors
require('express-async-errors')

const express = require('express')
const app = express()
//bring middlewarws
const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')
const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

//middleware
app.use(express.json())   //we don't need this line in this project
app.use(notFoundMiddleware)
app.use(errorMiddleware)

//routes
app.get('/', (req,res)=>{
    res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>')
})

//products routes: 
//1. for manual testing(http://localhost:3000/api/v1/products/static)  
//2. for the real path(http://localhost:3000/api/v1/products/)
app.use('/api/v1/products', productsRouter)   //the second parameter is related to the routes>>products.js

//connect to database
const port = process.env.PORT || 3000
const start = async()=>{   //this function return a promise that's why we use async
    try{
        await connectDB(process.env.MONGO_URI)   
        app.listen(port, console.log(`Server is listening to port ${port}`))
    }catch(error){
        console.log(error)
    }
}

start()  //invoke the start function


//Note:in this project instead of using asyncWrapper we use the alternative package: express-async-errors
//install it (npm i express-async-errors --save) and then use require to call it
//According to it's document: in this package instead of using next() we can throw Error