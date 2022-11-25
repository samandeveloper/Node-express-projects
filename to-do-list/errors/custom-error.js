//for not repeating the errors like 404 in function we create this file
//constructor method is a special method for when we create a new instance of a class

//class-extends is a keyword to create a class as a child of another class
class CustomAPIError extends Error {  //we extends it from Error
    //The constructor method is a method of a class for creating an object instance of that class
    constructor(message,statusCode){   //here we pass two arguments
        super(message)    //super method invokes a constructor of a parent class
        this.statusCode = statusCode   //create a statusCode property here
    }
}
//function
const createCustomError = (msg,statusCode)=>{
    return new CustomAPIError(msg,statusCode)
}

module.exports = {createCustomError , CustomAPIError}
