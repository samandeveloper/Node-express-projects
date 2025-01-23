//functions for create new job, update job, edit job, delete job 

const Job = require('../models/job')  //import model
const { StatusCodes } = require('http-status-codes')
const{BadRequestError,NotFoundError} = require('../errors')

//get all jobs:get on homepage
const getAllJobs = async(req,res)=>{   
    //we are looking for the jobs that are only associated with the user
    const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt')  //find all the documents named createdBy and we sort the results using createdAt
    res.status(StatusCodes.OK).json({jobs,count:jobs.length})   //status code =200--adding count is optional
    // res.send('get all jobs')
}

//get a single job:get on /:id (same as _id not the userId)
const getJob = async(req,res)=>{
    // res.send('get single job')
    const {user:{userId},params:{id:jobId}} = req     //destructure req--we have the _id (jobId) from params and userId from user (this is the id for each person like anna)
    //or instead of the above line write the two lines below:
    // const {id:jobId} = req.params 
    // const {userId} = req.user
    
    const job = await Job.findOne({
        _id:jobId,    //jobId from req.param
        createdBy:userId   //userId from req.body
    })

    if(!job){   //if no job exist for the user
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}

//create job:post on homepage
const createJob = async(req,res)=>{
    //transfer the req.user.userId to the req.body.createdBy this way we make the userId and createdBy the same
    req.body.createdBy = req.user.userId  //createdBy is the model name in models>>jobs.js -- the right side is where the left side located
    //Note: userID is different than _id

    //Note: .create method is often used to create new documents
    const job = await Job.create(req.body)     //a method to create is .create
    // res.send('create job')
    // res.json(req.user)
    // res.json(req.body)
    res.status(StatusCodes.CREATED).json({ job })   
    //in the above line answer createdBy answer is generated for someone like anna. so everyone has their own createdBy 
}

//update job:patch or put on /:id (same as _id not the userId)--since we are updating in the body we like some info
const updateJob = async(req,res)=>{
    // res.send('update job')
    const {body:{company,position},user:{userId},params:{id:jobId}} = req

    if(company === '' || position === ''){
        throw new BadRequestError('Company or Position fields cannot be empty')
    }
    //pass in what we want to update, and what job we are looking for and where i want to get back the updated version
    const job = await Job.findByIdAndUpdate({_id:jobId, createBy:userId}, req.body, {
        new:true,   //new means new value should be seen not the old value
        runValidators:true   //it means it can not be empty
    })
    if(!job){   //if no job exist for the user
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})   //send back the job
}

//delete job:delete on /:id (same as _id not the userId)
const deleteJob = async(req,res)=>{
    // res.send('delete job')
    const {user:{userId},params:{id:jobId}} = req
    const job = await Job.findByIdAndRemove({
        _id: jobId,
        createdBy:userId
    })
    if(!job){   //if no job exist for the user
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).send()  //send back the job--we don't have to send back the json here
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}