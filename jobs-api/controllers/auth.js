//functions for login and register

const User = require('../models/User')   //import model
const { StatusCodes } = require('http-status-codes')   //or import {StatusCodes} from 'http-status-codes'
const {BadRequestError , UnauthenticatedError} = require('../errors')
const bcrypt = require('bcryptjs')   //for encrypting the password
const jwt = require('jsonwebtoken')

//post register data-- we have name,email,password on register page
const register = async(req,res)=>{
    // console.log(req.body)   // send use exactly what we send to postman in boody: { name: 'john', email: 'john@gmail.com', password: 'password' }
    const {name,email,password} = req.body
    // console.log(req.body)   //answer { name: 'john', email: 'john7@gmail.com', password: 'password' }
    
    //using bcryptjs (we can use it sync or async -- we use async)
    const salt = await bcrypt.genSalt(10)  //this means how many random bytes we'll get--so 10 can be changed
    //create hash password
    const hashPassword = await bcrypt.hash(password,salt)  //if someone break our database they can see the hashed passwords
    if(!name || !email || !password){   //custom error
        throw new BadRequestError('Please provide name,email and password')
    }
    const tempUser = {name,email,password:hashPassword}  //send the object to the variable
    // console.log(tempUser)  //{name: 'john', email: 'john13@gmail.com', password: '$2a$10$IG5g5m29PVN41Ppi.FNzFO9MlHrCSY00SoRntAiW3UeAQ4dNYOgva'}
   
    // const user = await User.create({...req.body})
    //instead of the above line:
    const user = await User.create({...tempUser})  //or (tempUser)--.create make the objcet completed by adding id and version
    // console.log(user)  //  {_id: 6387aa9079e15824700b151f,name: 'john',email: 'john11@gmail.com', password: '$2a$10$qodNZpPQnD7pPAnHc88c1uPRiL9Xk6vaU.nMw0K6bi1wpwtQHaN5q',__v: 0}
    
    const token =jwt.sign({userId:user._id, name:user.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})

    // res.send('register user')
    // res.json(req.body)  //gives us whatever we send them to
    // res.status(StatusCodes.CREATED).json(req.body)  //StatusCodes.CREATED send back 201  -->answer:{ name: 'john', email: 'john@gmail.com', password: 'secret' }
    //or: instead of the above line we can write:
    // res.status(StatusCodes.CREATED).json({user})  //answer: { "user": {"_id": "638794ff0763393c741875ba", "name": "john", "email": "john4@gmail.com","password": "$2a$10$HZM6GJB3N3IfhMo/cKO.EOuW4ssU4FIYbd5sjULZNI5RQjxq.q5te","__v": 0}}
    //or:after adding jwt, instead of the above line: we need the user other than token since when user logged in her/his name will appear on the top of the page-->in localstorage we have the name and token
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token})  //in response we want the user and the token
}

//instead of above register we send the hash to the models>>User.js and we write the register:
// const register = async(req,res)=>{
//     const user = await User.create({...req.body})  //or (req.body)
//     res.status(StatusCodes.CREATED).json({user})  //answer: { "user": {"_id": "638794ff0763393c741875ba", "name": "john", "email": "john4@gmail.com","password": "$2a$10$HZM6GJB3N3IfhMo/cKO.EOuW4ssU4FIYbd5sjULZNI5RQjxq.q5te","__v": 0}}
// }

//instead of the above register (the one which is bold)
//instead of above register we send the hash to the models>>User.js and we write the register:
// const register = async(req,res)=>{
//     const user = await User.create({...req.body})  //or (req.body)
        // const token =jwt.sign({userId:user._id, name:user.name},process.env.JWT_SECRET,{expiresIn:'30d'})
//     res.status(StatusCodes.CREATED).json({user:{name:user.getName()},token})  //answer: { "user": {"_id": "638794ff0763393c741875ba", "name": "john", "email": "john4@gmail.com","password": "$2a$10$HZM6GJB3N3IfhMo/cKO.EOuW4ssU4FIYbd5sjULZNI5RQjxq.q5te","__v": 0}}
// }



//post login data--we have email and password on login page
//we check if we receive the email and passeord-->if not we receive an error
//we check our user inside our database and if we find the user in database we send back the user and if not we send back an error
const login = async(req,res)=>{
    // res.send('login user')
    const{email,password} = req.body
    //repeat the two lines from register
    // const salt = await bcrypt.genSalt(10)
    // const hashPassword = await bcrypt.hash(password,salt)
    // console.log(hashPassword)
    // console.log(password)

    if(!email || !password){ //one or both of the email/pass not provided
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email})   //read:https://mongoosejs.com/docs/api.html#model_Model-findOne
    //now if the user (email) doesn't exist we throw error 
    // console.log(user)   //like  {_id: 6388008a6dd93738d0be53ff,name: 'anna',email: 'anna5@gmail.com',password: <hashed password>,__v: 0}
    if(!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }

    //compare hash passwords: there a method on bcrypt (for hash password   ) to compare called: 
    // const isPasswordMatch = await bcrypt.compare(password,hashPassword)  //.compare method can compare a hash pasword and normal password
    const isMatch = await bcrypt.compare(password,user.password)
    console.log(isMatch)
    // const isPasswordCorrect = await user.comparePassword(password)
    if(!isMatch){
        throw new UnauthenticatedError('Invalid Credentials')
    }  //else send token   

    //compare password-if the password is correct we return a token
    const token =jwt.sign({userId:user._id, name:user.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
    res.status(StatusCodes.OK).json({user:{name:user.name},token})
}

module.exports = {
    register,
    login
}