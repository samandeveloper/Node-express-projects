//Improvement: import 3 files here (custom-error.js, bad-request.js, unauthenticated.js) and export them as one big object

const CustomAPIError = require('./custom-error')
const BadRequestError = require('./bad-request')
const UnauthenticatedError = require('./unauthenticated')

module.exports = {
    CustomAPIError,
    BadRequestError,
    UnauthenticatedError
}