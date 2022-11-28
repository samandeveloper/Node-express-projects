const express = require('express')
const router = express.Router()

//import from controllers>>products.js
const{
    getAllProducts,    //real route
    getAllProductsStatic,   //testing route
} = require('../controllers/products')

//
router.route('/').get(getAllProducts)                   //  http://localhost:3000/api/v1/products/
router.route('/static').get(getAllProductsStatic)       // http://localhost:3000/api/v1/products/static

module.exports = router