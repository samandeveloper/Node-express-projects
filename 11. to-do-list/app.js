//Note:the reason on our path we have v1 is because if we change the version in the future then we can guide others to v2 for example--this path address is similar to the hacker news api
//Note: post is the only method that we can't have :/id at the end of the path url-in GET method we can add /:id at the end of it or not
//Note:we should use router since we don't want our app.js file become too big--create two folders controllers and routes

const express = require('express')
const app = express()
//import
const tasks = require('./routes/tasks')
//import mongoose module
const connectDB = require('./db/connect')
require('dotenv').config()  //we don't have to assign this to the variable
//
const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
//middleware
app.use(express.static('./public'))   //for bringing the static files we need the midleware
app.use(express.json())             //Note: if we don't write this we don't have the data in req.body
app.use('/api/v1/tasks', tasks)    //root route--gives us all the data
app.use(notFound)                   //pass the notFound middleware
app.use(errorHandlerMiddleware)        //pass the errorHandlerMiddleware

//routes for testing in postman:

//on frontend projectwe have all our tasks list >> GET request--get all the tasks
//app.get('/api/v1/tasks')           

//when we type in the input a new task >>POST request--create a new task
//app.post('/api/v1/tasks')         

//for each task if we click on edit we open a new tab on browser >>GET request for one single task-get single task
//Note: the reason we add /:id in the below get method is convention.in GET method we can have a simple url or /:id at the end of url
//app.get('/api/v1/tasks/:id')      

//also there is a completed button to check and come back homepage, here the completed task has a line through it >>Update request
//we use patch instead of put method for the update
// put vs patch: when you use put you try to replace the existing resource but patch is for partial update

//app.patch('/api/v1/tasks/:id')    

//we can delete each task with delete button on homepage
//app.delete('/api/v1/tasks/:id')    



//choose a port
const port = process.env.PORT || 3000  //we add process.env.PORT for the time we deploy the project somewhere other than local
//for testing the above line in terminal >>> PORT=6000 node app.js
// app.listen(port,console.log(`server is listening on port ${port}`))

//for the reason that we said in connect.js we want to first connect to db then spin up the server:
//connect db send me a promise so we use async function and await keyword
const start = async() =>{
    try{
        await connectDB(process.env.MONGO_URI)      //process.env.nameof varible in .env file
        app.listen(port,console.log(`server is listening on port ${port}`))
    }catch(error){
        console.log(error)
    }
}

//we should invoke it
start()

