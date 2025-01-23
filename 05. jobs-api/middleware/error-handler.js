//at first before checking other mongoose errors (README.MD file)
// const { CustomAPIError } = require('../errors')
// const { StatusCodes } = require('http-status-codes')
// const errorHandlerMiddleware = (err, req, res, next) => {
//   console.log(err)  //err is an object
//     if (err instanceof CustomAPIError) { //if our error is one of the custom ones if not there will be a new custom object
//       return res.status(err.statusCode).json({ msg: err.message })
//     }
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
// }

// module.exports = errorHandlerMiddleware


//adding other mongoose errors:
//if we receive the err object with the code 11000 then give us the keyvalue
// const { CustomAPIError } = require('../errors')  //we don't need this line anymore
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err)  //err is an object

  //write an error for the errors that are not in the classes that we already have
  //e.g. for this error is when we register a user twice then we want to change the error that we receive
  let customError = {
    //set default
    statusCode : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,  //if in the error i already have status code then use it, if not go with the general error (right side of ||)
    msg:err.message || 'Something went wrong try again later'
  }
    //we don't need the below line anymore:
    // if (err instanceof CustomAPIError) { //if our error is one of the custom ones if not there will be a new custom object
    //   return res.status(err.statusCode).json({ msg: err.message })
    // }

    //Validation Errors -- when in register form (in register form we must have name,email,password) we remove some of them e.g. we just have the name
  if(err.name === 'ValidationError'){
    console.log(Object.values(err.errors))  //answer: array of objects
    customError.msg = Object.values(err.errors).map((item)=>
      (item.message).join(','))  //in each object we are accessing the message and with "," we join the message together
      //e.g. answer of the above line (when we don't password and email): please provide the email, please provide the password
      customError.statusCode = 400   //bad request
  }

  // Cast Error --in get single job if the id is not correct 
  if(err.name === 'CastError'){
    customError.msg = `No item found with id: ${err.value}`
    customError.statusCode = 404  //not found
  }

    //Duplicate (Email) error--when in register form we register a user twice
    if(err.code && err.code === 11000){  //check if the err.code exists if yes, then chceck if it equals to 11000
      // customError.msg = `Duplicate value entered for ${err.keyValue} field, please choose another value`
      //the above line answer instead of ${err.keyValue} we receive [object Object] so we need to add :
      customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`    //Object.keys() is a method for object and returns the key--answer: email field
      customError.statusCode = 400  //bad request
    }


      // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })   //500-main error
      //Duplicate (Email)--instead of the above line we can write the line below:
      return res.status(customError.statusCode).json({ msg:customError.msg })
}

module.exports = errorHandlerMiddleware
