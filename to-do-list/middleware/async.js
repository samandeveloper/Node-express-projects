//avoid all the try and catch in task.js --this also can be done using npm package "express-async-errors"
const asyncWrapper=(fn)=>{
    return async(req,res,next) =>{  //in express middlewares by default we have req,res,next--next in express allows the next route handler (next middleware) in line to handle the request
        try{
            await fn(req,res,next)  //this is the way we pass the req,res,next
        }catch(error){
            next(error)   //we send an error to the next middleware which is in error-handler.js
        }
    }
}

module.exports = asyncWrapper