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

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 
const db = knex({
  client: 'pg',
  connection: {
	
connectionString: 'postgres://smart_brain_data_user:iHR8jLUrAaqkiN6cn6fh5CLmdPwFfGMb@dpg-cf0ct3kgqg45vesh0480-a/smart_brain_data',
// Hostname: 'dpg-cf0ct3kgqg45vesh0480-a',
// Port: 5432,
// Database: 'smart_brain_data',
// Username: 'smart_brain_data_user',
// Password: 'iHR8jLUrAaqkiN6cn6fh5CLmdPwFfGMb',
// ssl:true
	  
	  
	  hostname: 'dpg-cf0ct3kgqg45vesh0480-a',
	  username:'smart_brain_data_user',
	  password: 'iHR8jLUrAaqkiN6cn6fh5CLmdPwFfGMb',
	  database: 'smart_brain_data',
	  port: 5432
  }
});

//solution for front
// app.use(express.static(path.join(__dirname, 'public')));
// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.get('/*', function(req, res) {
//     res.sendFile('path to index.html');
// })

app.use(bodyParser.json());
app.use(cors());


//  app.use(express.static(path.join(__dirname, 'public')));

// app.get('*', function(req, res) {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

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
