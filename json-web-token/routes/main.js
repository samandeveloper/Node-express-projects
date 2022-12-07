//routes:
const express = require('express')
const router = express.Router()

//import from controllers
const{
    login,
    dashboard
}= require('../controllers/main')

//import auth.js
const authMiddleware = require('../middleware/auth')

//the way we add the authMiddleware below (just dashboard needs it) is to add it after .get before the dashboard
//so every time user clicks on the dashboard, then first it goes to authMiddleware
router.route('/login').post(login)       //means: url/api/v1/login -- post method:send the username/password to the server
router.route('/dashboard').get(authMiddleware,dashboard)  //means: url/api/v1/dashboard -- get method:get data in dashboard


module.exports = router