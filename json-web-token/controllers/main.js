//functions

//check username and password in post(login) request --> username and password are available in req.body
//if username and password exist create a new JWT (jason web token) else generate error
//send back to frontend -->only if the username and password are correct then give the token
//setup authentication so only the request with JWT can access the dashboard

//import custom error and jwt
const jwt = require('jsonwebtoken')
// const CustomAPIError = require('../errors/custom-error')  //improvement:remove this line

//improvement:
const{BadRequestError} = require('../errors')  //Note: if we want more than one error add, and write the other errors name since all of them are in errors folder

const login = async (req,res)=>{
    //check if username and password is correct
    const {username , password} = req.body  //post request so it's in req.body
    console.log(username,password)
    //we have three options for checking the user/pass exists or not: 1. mongodb database(we don't have database in this project)  2. Joi package  3. check them user/pass here manually
    if(!username || !password){     //if username or password is empty
        //throw custom error
        // throw new CustomAPIError('Please provide email and password', 400)  //this will check in errors/custom-error.js which related to middleware/error-handler.js  >> if (err instanceof CustomAPIError) line
        //improvement: instead of the above line:
        throw new BadRequestError('Please provide email and password')  
    }

    const id = new Date().getDate()  //answer like 25(if today is 25 it generates 25 every time)--easy way but usually id provides by database
    //create a new token
    const token = jwt.sign({id,username},process.env.JWT_SECRET,{expiresIn:'30d'})   //sign method belongs to jwt--we can provide 3 values--usually payload is object (in this project username and password and id and options (e.g. expire the user/pass in 30 days)--usually user and pass comes from database that we don't have here 
    // console.log(token)  //give one token
    // res.send('Fake Login/Register/Signup Route')
    res.status(200).json({msg:'user created',token})  //we send back the token to the user (frontend)
}

//Improvement: move some of the code below to the auth.js middleware
const dashboard = async (req,res)=>{
    // console.log(req.headers)
    // const authHeader = req.headers.authorization
    // console.log(req.headers.authorization)  //Bearer <token>
    // if(!authHeader || !authHeader.startsWith('Bearer ')){  //if there is no authorization header or it doesn't start with Bearer then we will throw our custom error--startsWith is a js method and the answer is boolean
    //     throw new CustomAPIError('No token provided', 401)  //custom error
    // }  //else
    // const token = authHeader.split(' ')[1]  //we remove all the spaces (we have one space after Bearer) 
    // console.log(token)   //<token>
    
    //now that we have the token we want to check if this token is valid-->do this with jsonwebtoken verify method which has two parameter (token,secret)
    // try{
    //     const decoded = jwt.verify(token,process.env.JWT_SECRET)
    //     // console.log(decoded)  //send dashboard postman>>answer in terminal { id: 27, username: 'john', iat: 1669596482, exp: 1672188482 }
    //     // //to make the name and password of each person dynamic
    
    console.log(req.user)  //answer is username and password
    const luckyNumber = Math.floor(Math.random()*100)
    //req.user.username is just the username--we can not write decoded.username anymore
    res.status(200).json({msg:`Hello, ${req.user.username}`,secret:`Here is your authorized data, your lucky number is ${luckyNumber}`})
    // }catch(error){
    //     //any error with token like expired token handles here-->throw custom error
    //     throw new CustomAPIError('Not authorized to access this route', 401)
    // }


    //generate the random number for Dashboard section
    // const luckyNumber = Math.floor(Math.random()*100)  //number between 0-99
    // res.status(200).json({msg:`Hello, John Doe`,secret:`Here is your authorized data, your lucky number is ${luckyNumber}`})
    //instead of the above line we can add the dynamic line according to the decoded above-->see the try above
}

module.exports = {
    login,
    dashboard
}