
// const CustomAPIError = require('../errors/custom-error')
//improvement: instead of the above line:
const {CustomAPIError} = require('../errors')
//improvement:add other status codes:
const{StatusCodes} = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {   //four items in errorHandler (500)-->first one is err and last one like all the middlewares is next
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  //return res.status(500).send('Something went wrong try again later')
  //improvement: instead of 500 in the above line:
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Something went wrong try again later')
}

module.exports = errorHandlerMiddleware
