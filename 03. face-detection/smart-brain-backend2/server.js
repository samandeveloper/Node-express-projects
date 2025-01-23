const express = require ('express');
const bodyParser = require('body-parser');
const cors = require ('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const pg = require('pg');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();
const path = require('path');

const db = knex({
  client: 'pg',
  connection: {
	connectionString: process.env.DATA_URL,
  }
});


app.use(bodyParser.json());
app.use(cors());


//test Endpoint
app.get('/', (req,res)=>{
	//res.send('this is a test');
	//res.send(db.users);
	res.send('it is working');
});

//signin Endpoint
app.post('/signin', (req,res)=>{
	signin.handleSignin(req,res,db,bcrypt)
		
	});

//register Endpoint
app.post('/register', (req,res)=>{
	register.handleRegister(req,res,bcrypt,db)
		
});

app.get('/profile/:id', (req,res)=>{
	profile.handleProfileGet(req,res,db)
		
});

//image Endpoint
app.put('/image', (req,res)=>{
	image.handleImage(req,res,db)
	
});

//image security
app.post('/imageurl',(req,res)=>{
	image.handleApiCall(req,res)
		
});

app.listen(process.env.PORT || 3002, ()=>{
	console.log(`app is running on port {process.env.PORT}`);
});
