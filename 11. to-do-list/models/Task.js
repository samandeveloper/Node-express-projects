//what is schema: Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.

//the purpose of this file: in mongoose db atlas we said there is no set for creating the documents (one can be array,string,etc)
//but in this project we want to have string for tasks and boolean for true and false
//so we use schema to set up a structure for all the documents
//models: read: https://mongoosejs.com/docs/models.html

//models: go to starter and create a folder "models" >>inside create this file (Task.js)
//validation (add validation to our schema): using model and schema in Task.js we organize the structure but we still can insert empty value and we don't want it.

//queries(methods on models): a query is what is returened when calling many model methods
//Mongoose models provide several static helper functions for CRUD operations. Each of these functions returns a mongoose Query object.
//read https://mongoosejs.com/docs/queries.html
//in this document it says queries are not promises but we can use await/async in front of it as convenient


//import mongoose
const mongoose = require('mongoose')

//schema is the structure for the data--object >>key:value
const TaskSchema = new mongoose.Schema({
    // name: String,
    // completed:Boolean

    //validation: instead of above two lines:
    name:{
        type:String,
        // require:true  //means if we didn't insert something in the name, give me an error
        //or add a message too
        required:[true,'must provide name'],
        //if we add name like :{"name": "    john    "} this will be shown with the space>>to prevent:
        trim:true,
        //we don't want the name to be more than 20 charecters
        maxlength:[20, 'name can not be more than 20 charecters']
    },
    completed: {
        type:Boolean,
        default: false, //by default each task is not completed and only we navigate to a task page and check completed, we can complete the task
        //we don't need to say required: true in completed since in this project it's not obligatory
    },
})

//exports the modal is like below>> mongoose.model(name, schema variable)
module.exports = mongoose.model('Task', TaskSchema)