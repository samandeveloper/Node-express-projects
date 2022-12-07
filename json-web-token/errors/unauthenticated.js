//Improvement
const CustomAPIError = require('./custom-error')
//using http-status-codes package:
const {StatusCodes} = require('http-status-codes')

class UnauthenticatedError extends CustomAPIError {  
    constructor(message) {
      super(message)
      //this.statusCode = 401   //equal to some hardcode (unauthenticated=401) instead of statusCode
      //using http-status-codes, instead of the above line:
      this.statusCode = StatusCodes.UNAUTHORIZED   //we find the UNAUTHORIZED name in the http-status-codes table
    }
  }
  
  module.exports = UnauthenticatedError