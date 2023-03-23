require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
//middlewarws
const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')
const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

//middleware
app.use(express.json())  
app.use(errorMiddleware)

//routes
app.get('/', (req,res)=>{
    res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>')
})

//products routes: 
//1. for manual testing(http://localhost:3000/api/v1/products/static)  
//2. for the real path(http://localhost:3000/api/v1/products/)
app.use('/api/v1/products', productsRouter)   //the second parameter is related to the routes>products.js



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

start()  
