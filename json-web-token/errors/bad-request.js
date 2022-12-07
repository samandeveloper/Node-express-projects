//improvement: this file is going to extend from CustomAPIError not Error
const CustomAPIError = require('./custom-error')
//using http-status-codes package:
const {StatusCodes} = require('http-status-codes')

class BadRequestError extends CustomAPIError {  
    constructor(message) {
      super(message)
    //   this.statusCode = 400   //equal to some hardcode (bad request=400) instead of statusCode
    //using http-status-codes, instead of the above line:
    this.statusCode = StatusCodes.BAD_REQUEST  //we find the BAD_REQUEST name in the http-status-codes table
    }
  }
  
  module.exports = BadRequestError