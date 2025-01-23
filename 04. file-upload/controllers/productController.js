//frontend seperate to two sections: top for uploading info and button to show the info
const Product = require('../models/Product')   //import Product.js model
const {StatusCodes} = require('http-status-codes')  //third-party modeule which we installed before

//Note: in the frontend what we want is the form for inserting our product and below that there is a list of all our products so we need two routes
//1.createing the products
const createProduct = async(req,res) =>{
  // res.send('create product')
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({product})
}

//2.getting all the products
const getAllProducts = async (req, res) => {
  // res.send("list of products");
  const products = await Product.find({})  //find all the products so we use {}
  res.status(StatusCodes.OK).json({products})
};


module.exports = {
    createProduct,
    getAllProducts,
}