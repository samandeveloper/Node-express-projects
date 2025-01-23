//we have two options in this file: router.method one by one or use the chain of routers
//remember Router doesn't need any installation

const express = require('express')
const router = express.Router()   //instead of app we use router

//add controllers (here in routes we import what we exported in controllers)
const{
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    deleteTask,

} = require('../controllers/tasks')


//way2:go with chain of methods 
router.route('/').get(getAllTasks).post(createTask)
router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask)

//exports
module.exports = router