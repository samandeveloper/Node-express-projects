//routes:
const express = require('express')
const router = express.Router()

//import from controllers
const{
    login,
    dashboard
}= require('../controllers/main')

router.route('/login').post(login)       //means: url/api/v1/login -- post method:send the username/password to the server
router.route('/dashboard').get(dashboard)  //means: url/api/v1/dashboard -- get method:get data in dashboard


module.exports = router