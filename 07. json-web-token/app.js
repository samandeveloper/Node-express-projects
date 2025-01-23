require('dotenv').config();
require('express-async-errors');  //this package works instead of asyncWrapper--async middleware (instead of try and catch)

const express = require('express');
const app = express();

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const mainRouter = require('./routes/main')  //bring routes

// middleware
app.use(express.static('./public'));
app.use(express.json());  //one of the routes is post and we want to access req.body

app.use('/api/v1', mainRouter)   //define a path for the routes
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
