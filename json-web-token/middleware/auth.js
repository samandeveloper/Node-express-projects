//create a async function with req,res and next

const jwt = require('jsonwebtoken')  
//const CustomAPIError = require('../errors/custom-error')
//improvement:instead of the above line we should:
const {UnauthenticatedError} = require('../errors')

const authenticationMiddleware = async (req,res,next) =>{
    //console.log(req.headers.authorization)
    //bring the below lines from ontrollers
    const authHeader = req.headers.authorization
    console.log(req.headers.authorization)  //Bearer <token>
    if(!authHeader || !authHeader.startsWith('Bearer ')){  //if there is no authorization header or it doesn't start with Bearer then we will throw our custom error--startsWith is a js method and the answer is boolean
        // throw new CustomAPIError('No token provided', 401)  //custom error
        //improvement: instead of the above line--and we remove 401
        throw new UnauthenticatedError('No token provided') 
    }  //else
    const token = authHeader.split(' ')[1]  //we remove all the spaces (we have one space after Bearer) 
    console.log(token)   //<token>


    //from try
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        // console.log(decoded)  //send dashboard postman>>answer in terminal { id: 27, username: 'john', iat: 1669596482, exp: 1672188482 }
        const{id,username} = decoded  //select the id and username from decoded
        req.user = {id,username}  //assign them to req.user which is a new object--Note: instead of req.user we can call it req.anyname 
        next()  //with next I'll pass it to the dashboard and then the next route that doesn't exist in this project
    }
    //if we couldn't verify the token-->custom error
    catch(error){
        //any error with token like expired token handles here-->throw custom error
        // throw new CustomAPIError('Not authorized to access this route', 401)
        //instead of the above line:
        throw new UnauthenticatedError('Not authorized to access this route')
    }
}

module.exports = authenticationMiddleware

