require('dotenv').config();
require('express-async-errors');  //replacing try and catch in async functions

const express = require('express');
const app = express();

//import express-fileupload
const fileUpload = require('express-fileupload')

//using cloudinary website + npm package to store images in the cloud
//use v2
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

// database
const connectDB = require('./db/connect');

//product router
const productRoutes = require("./routes/productRoutes");

// error handler (import middlewares)
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.static('./public'))
app.use(express.json())  ////since we want to create product so we use POST request and we need to have access to the req.body

//invoke express-fileupload
// app.use(fileUpload())
app.use(fileUpload({useTempFiles: true}));    //we add the useTempFiles when we use the cloudinary with express-fileupload package

//homepage URL-test
app.get('/', (req, res) => {
  res.send('<h1>File Upload Starter</h1>');
});

//invoke the product router in the URL route
app.use('/api/v1/products', productRoutes)

// middleware-invoke middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
