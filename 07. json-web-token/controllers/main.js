//import custom error and jwt
const jwt = require('jsonwebtoken')
const CustomAPIError = require('../errors/custom-error')

const login = async (req,res)=>{
    //check if username and password is correct
    const {username , password} = req.body  
    console.log(username,password)
    if(!username || !password){     //if username or password is empty
        //throw custom error
        throw new CustomAPIError('Please provide email and password', 400)  
    }

    const id = new Date().getDate()  
    //create a new token
    const token = jwt.sign({id,username},process.env.JWT_SECRET,{expiresIn:'30d'})   //sign method in jwt
    res.status(200).json({msg:'user created',token})  //we send back the token to the user (frontend)
}

const dashboard = async (req,res)=>{
    console.log(req.headers)
    const authHeader = req.headers.authorization
    console.log(req.headers.authorization)  //Bearer <token>
    if(!authHeader || !authHeader.startsWith('Bearer ')){  
        throw new CustomAPIError('No token provided', 401)  //custom error
    }  //else
    const token = authHeader.split(' ')[1]  //we remove all the spaces (we have one space after Bearer) 

    //check if this token is valid-->do this with jsonwebtoken verify method which has two parameter (token,secret)
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const luckyNumber = Math.floor(Math.random()*100)
        res.status(200).json({msg:`Hello, ${decoded.username}`,secret:`Here is your authorized data, your lucky number is ${luckyNumber}`})
    }catch(error){
        //any error with token like expired token handles here-->throw custom error
        throw new CustomAPIError('Not authorized to access this route', 401)
    }
}

module.exports = {
    login,
    dashboard
}