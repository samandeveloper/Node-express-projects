//read https://mongoosejs.com/docs/validation.html and https://mongoosejs.com/docs/schematypes.html
//also for .pre and .methods.createJWT read: https://mongoosejs.com/docs/middleware.html

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')   //for encrypting the password
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {  //for name we can also write lowercase and minlength and maxlength
        type:String,
        required:[true, 'Please provide name'],
        minlength:3,
        maxlength:50
    },
    email:{
        type:String,
        require:[true, 'please provide email'],
        //match is one of the objects in string
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
        unique:true,   //unique email--if user register with one email they can not register again eith the same email--unique creates unique index but it's not a validator-->when user register a duplicate email, it gives an error
    },
    password:{
        type:String,
        require:[true,'please provide password'],
        minlength:6,
        // maxlength:12  //our password become hash and hash is longer than 12 so if we don't remove this line we receive an error.
    }
})

//hash the password using mongoose middle ware--we can remove all the UserSchema .pre completly and in controllers>>auth.js we can use the first register instead of the second one
//we can remove the hashing password in controllers >> auth.js and move it like this here
//since pre is a middleware method so we need to add next()
// UserSchema.pre('save', async function(){  //use the old way of async since this will always point to the document(row)
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password,salt)   //this.password=password object
//     next()  //the mongoose document said in mongoose5.x we can remove the next() and use async/await and it still works
// })  


//read: instance method in https://mongoosejs.com/docs/guide.html#methods
//every document we create we can have functions on them
// UserSchema.methods.createJWT = function(){
//     return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
// }


//compare hash password (instead of writing in controllers>>auth.js)
// UserSchema.methods.comparePassword = async function (canadidatePassword){
//     const isMatch = await bcrypt.compare(canadidatePassword, this.password)   //this.password is the document password
//     return isMatch
// }

module.exports = mongoose.model('User', UserSchema)  //user is name