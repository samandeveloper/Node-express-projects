//routes for login and register (from controllers>>auth.js)

const express = require('express')
const router = express.Router()

//import controllers>>auth.js
const {
    login,
    register
} = require('../controllers/auth.js')

//way1: use router.methodname
router.post('/register',register)   //or router.route('/register').post(register)-->domain/api/v1/auth/register
router.post('/login',login)         //or router.route('/login').post(login)-->domain/api/v1/auth/login

module.exports = router