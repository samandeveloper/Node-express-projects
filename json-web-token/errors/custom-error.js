//Improvement: create 3 other files in errors folder: bad-request.js, unauthenticated.js, index.js

class CustomAPIError extends Error {  
  constructor(message) {   //remeve statusCode as a second parameter
    super(message)
    // this.statusCode = statusCode   //remove this line
  }
}

module.exports = CustomAPIError


//Improvement:Note2: we use the custom error which is a class for error 400 and 401. both of them are from one class
//now we want to change the custom-error and write seperate files for each error
//after doing this we can call each error by they status code like 400
//or having better approach using "http-status-codes" package. using this package benefit is if we want status code 200 we type OK instead of 200. There is a http code table for that.
