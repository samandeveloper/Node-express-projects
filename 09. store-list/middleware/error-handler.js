//error handler has four parameter instead of three (we added err too)
const errorHandlerMiddleware = async (err, req, res, next) => {
  console.log(err)   //for testing asyncWrapper
  return res.status(500).json({ msg: 'Something went wrong, please try again' })
}

module.exports = errorHandlerMiddleware
