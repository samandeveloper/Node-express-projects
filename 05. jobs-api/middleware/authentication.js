//we are using jwt so we need to create an authentication middleware--we use this middleware in routes folder
//Important Note: we want to add this auth to all the routes including auth.js and jobs.js
//we want to add it in the auth.js since this is a login and register part so each person should login to their own page
//also we must add it to the jobs.js since each person has their own jobs and no one can see my jobs and i can't see other peopke's jobs
//SO WE WANT TO PROTECT ALL OF OUR JOBS AS WELL AS OUR ROUTES
//now we have two ways of adding them: 
//way1. add them in the routes (auth.js and jobs.js) one by one 
//way2. add it to the app.js  

const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require('../errors')  //adding {} cause us not to mention the exact path after errors

const auth = async (req,res,next) =>{
    //check header--if it has Brearer or not
    const authHeader = req.headers.authorization
    console.log(req.headers.authorization)  //Bearer <token>
    if(!authHeader || !authHeader.startsWith('Bearer ')){  
        throw new UnauthenticatedError('Authentication invalid')
    }
    const token =  authHeader.split(' ')[1] 
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const{userId,name} = payload
        //attach the user to the job routes
        req.user = {userId,name} //or remove the const{userId,name} = payload line and we can write {userId: payload.userId, name:payload.name}   
        next()
    }catch(error){
        throw new UnauthenticatedError('Authentication invalid')
    }

}

module.exports = auth


//Note: instead of the above try we can write:
// try{
//     const payload = jwt.verify(token, process.env.JWT_SECRET)
//     const user = User.findById(payload.id).select('-password')
//     req.user = user
//     next()
// }