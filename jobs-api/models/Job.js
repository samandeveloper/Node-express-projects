//read: 
const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
    //Note: when we create a job we only have the company and position
    //when we are modifiying (editing) the job then we have the status too.
    company:{
        type:String,
        required:[true,'Please provide company name'],
        maxlength:50
    },
    position:{
        type:String,
        required:[true,'Please provide cposition'],
        maxlength:100
    },
    status:{
        type:String,
        enum:['interview','declined','pending'],  //we have 3 options
        default:'pending'  //if it's not pending it's one on the enum array
    },
    //createBy refers to a specific user--IT GIVES US A SPECIFIC NUMBER FOR EACH USER
    createdBy:{   //every time we create a job we will assign it to one of the users
        type: mongoose.Types.ObjectId,   //ObjectId is a unique identifier for each document in mongoose--it can use as a type in schema
        ref: 'User',   //which model are we referencing
        required: [true,'Please provide user']  //we don't want to create a job without the user
    }
}, { timestamps: true })

//Note about timestamp: https://mongoosejs.com/docs/timestamps.html
// Mongoose schemas support a timestamps option. If you set timestamps: true, Mongoose will add two properties of type Date to your schema:
// createdAt: when document created--a date representing when this document was created
// updatedAt: when document updated--a date representing when this document was last updated

module.exports = mongoose.model('Job', JobSchema)

