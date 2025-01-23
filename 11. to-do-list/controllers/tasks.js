//create controller function

//import model
const { application } = require('express')
const Task = require('../models/Task')
//import asyncWrapper function
const asyncWrapper = require('../middleware/async')
//import the function from custom-error.js
const{createCustomError} = require('../errors/custom-error')


const getAllTasks = asyncWrapper(async (req,res) =>{
    // try{
        const tasks = await Task.find({})  //query model:model's name.find(), finds all documents using.find method with an empty object
        res.status(200).json({tasks:tasks})  //or in ES6 {tasks}
        //improve the above line
        // res.status(200).json({tasks, amount:tasks.length})
        //or add flag
        // res.status(200).json({success:true, data:{tasks,nbHits:tasks.length}})
        //or
        // res.status(200).json({status:"success", data:{tasks,nbHits:tasks.length}})

    // }catch(error){
        // res.status(500).json({msg:error})
    // }
})

// const createTask =(req,res) =>{
//     // res.send('create task')
//     res.json(req.body)
// }

const createTask = asyncWrapper(async (req,res) =>{  //when we have async function we should have await, try and catch
    // try{
        // const task = await Task.create({name:'first task'})
        //or use destructure
        const task = await Task.create(req.body)   //name of the model.create
        res.status(201).json({task})  // code 200 vs 201: A 201 status code indicates that a request was successful and as a result, a resource has been created but 200 equest was received and understood and is being processed
    // }catch(error){
        // res.status(500).json({msg:error})   //500 code is general server error
    // }
})

// const getTask = (req,res) =>{
//     // res.send('get single task')
//     res.json({id:req.params.id})  //re.params = {id:1}  //req.params.id = 1
// }

//first get task that we want to edit
//edit each task: open a new window and TaskID ,name, completed will show up
const getTask = asyncWrapper(async (req,res,next) =>{ 
    // try{
        //query model: model's name.findOne({}).exec()
        const {id:taskID} = req.params
        const task = await Task.findOne({_id:taskID}) //we use underline since _id is the way postman show us
        //check if the task is null:
        if(!task){          //e.g. one of the id numbers are wrong
            // const error = new Error('Not Found')
            // error.staus = 404
            // return next(error)
            // return res.status(404).json({msg:`No task with id:${taskID}`})   //404 page/folder not found

            //instead of the above lines:
            return next(createCustomError(`No task with id: ${taskID}`, 404))  //second parameter is the status code
        }
        res.status(200).json({task})  //re.params = {id:1}  //req.params.id = 1
    // }catch(error){
        // res.status(500).json({msg:error})  //e.g.when the syntax of the id is wrong like one number is missing
    // }  
       
})

//second update the choosen task
// const updateTask = (req,res) =>{
//     res.send('update task')
// }

//in update we need id and also body (if we update something we need that new info--in seperate edit page the Name field or completed will be update) and we have to add some options since our validations are not working right away
//so get params and body
const updateTask = asyncWrapper(async (req,res) =>{
    // try{
        const{id:taskID} = req.params
        const data = req.body    //data is an object including name and completed so data is variable and we can not destructure it
        // console.log({id:taskID})        
        // // console.log(data)          /{ name: 'testing edit func', completed: false }
        // console.log(req.body)        //{ name: 'testing edit func', completed: false }
        // console.log(data.name)       //testing edit func
        // res.status(200).json({_id:taskID,data})     //or res.status(200).json({_id:taskID,req.params})
        // const task = await Task.findOneAndReplace({_id:taskID},req.body)  //or instead of req.body we can use data
        
        //if we try update function with name:"" still receive the empty name and we don't want it so we should use validation (add the third parameter below)
        const task = await Task.findOneAndReplace({_id:taskID},req.body, {
            new:true,   //new means new value should be seen not the old value
            runValidators:true,   //name is require--it can't be empty
        }) 

        if(!task){
            // return res.status(404).json({msg:`No task with id: ${taskID}`})
            //instead of the above line:
            return next(createCustomError(`No task with id: ${taskID}`, 404))  //second parameter is the status code

        }
        res.status(200).json({task})
    // }
    // catch(error){
    //     res.status(500).json({msg:error})
    // }
})

const deleteTask = asyncWrapper(async(req,res) =>{
    // try{
        const{id:taskID} = req.params
        const task = await Task.findOneAndDelete({_id:taskID})
        //check if the task is null or not
        if(!task){
            // return res.status(404).json({msg:`No task with id:${taskID}`})
            //instead of the above line:
            return next(createCustomError(`No task with id: ${taskID}`, 404))  //second parameter is the status code

        }
        res.status(200).json({task})   //json form is useful for postman but we can write this line like: res.status(200).send()  //or res.status(200).json({task:null, status:'success'}) 
    // }catch(error){
    //     res.status(500).json({msg:error})
    // }
})

//export controllers
module.exports ={
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask,
}