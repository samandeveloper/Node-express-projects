//we write the error handler for the middleware>>async.js
//read: https://expressjs.com/en/guide/error-handling.html#writing-error-handlers

//add a function from custom-error.js here:
const{customAPIError} = require('../errors/custom-error')

//we should have four parameters (err,req,res,next)-->next()function to call the next middleware function if the response of the current middleware is not terminated.
const errorHandlerMiddleware = (err,req,res,next)=>{
    if(err instanceof customAPIError){   //instanceof output is boolean
        return res.status(err.statusCode).json({msg:err.message})
    }
    console.log(err)
    return res.status(500).json({msg:err})   //or {err:err}  or {msg:'sth went wrong,try again}
}

module.exports = errorHandlerMiddleware