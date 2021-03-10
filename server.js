const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require ('bcrypt-nodejs');
const cors = require('cors');
const knex = require ('knex');
//const { response } = require('express');

//import the file from controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'megamax',
      password : 'megamax',
      database : 'smart-brain'
    }
  });
   // to see the data from the database
  //db.select('*').from('users').then(data => {
    //  console.log(data);
 // });


const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {res.send(database.users) })
// signin ----------------------------------------
app.post('/signin', (req, res ) => {signin.handleSignin(req, res, db, bcrypt)})

// register---------------------------------------
app.post('/register', (req, res ) => {register.handleRegister(req, res, db, bcrypt)})

//profile/:userId --> GET = user 
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req,res, db)})

//image --> PUT --> user   (counting the rank) increase evrytime user use picturex
app.put('/image' , (req, res) => {image.handleImage(req,res, db)})


app.listen(3000, () => {
    console.log('app is running on port 3000')
})
