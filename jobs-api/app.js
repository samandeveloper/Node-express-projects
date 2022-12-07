//we have two controllers files so we have two routes files too

require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();  //invoke express to the app

//connectDB
const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')  //instead of the routes we can add the auth middleware in app.js

//call the routes
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')   //this package needs more configuration

// bring the routes
//for test
// app.get('/', (req, res) => {  //homepage
//   res.send('jobs api');
// });

//middlewares
//for rateLimiter read Troubleshooting Proxy Issues in the 'express-rate-limit' package--we should add the below line:
app.set('trust proxy', 1)  //for 'express-rate-limit' package
app.use(rateLimiter({  //according to it's document we need more setups for this package
  windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
}))
app.use(express.json());   //for req.body
app.use(helmet())
app.use(cors())
app.use(xss())

//setup for postman
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticateUser,jobsRouter)

//below lines should be before port after the routes
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
