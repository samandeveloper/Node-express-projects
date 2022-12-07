//How this project works?
//jwt=json web tokens (for not letting anyone access to our app)
//suppose we have two routes: a login/register and a dashboard route
//when we login, then we receive a token (data/token is a random number in this project) then with that token we can get data in dashboard route
//we receive this token in local storage in browser (the frontend designed this way)
//the restricted access to a route or resource is an important matter. e.g. the login route is not restricted since every one can see it.

require('dotenv').config();
require('express-async-errors');  //this package works instead of asyncWrapper--async middleware (instead of try and catch)

const express = require('express');
const app = express();

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const mainRouter = require('./routes/main')  //bring routes

// middleware
app.use(express.static('./public'));
app.use(express.json());  //because one of the routes is post and we want to access req.body

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


//Improvement:Note1: we will make some improvements in this project:
//first: setup the authentication project. since in real world application there will be many routes that use the dashboard route.
//so we will add some of the dashboard routes to the middleware to not repeat ourselfs. in auth.js

