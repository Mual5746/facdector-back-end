const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require ('bcrypt-nodejs');
const cors = require('cors');
const knex = require ('knex');
const { response } = require('express');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'megamax',
      password : '',
      database : 'smart-brain'
    }
  });
   // kommentar 
  //db.select('*').from('users').then(data => {
    //  console.log(data);
 // });


const app = express();

const database = {
    users:[
        {
           id : '123',
           name: 'Jon',
           password: 'ban',
           email: 'jon@gmail.com',
           entries: 0,
           joined: new Date()
        },
        {
           id : '124',
           name: 'Jony',
           password: 'banna',
           email: 'jony@gmail.com',
           entries: 0,
           joined: new Date()
        },
    ] ,
    login: [
        {
          id: '987',
          hash: '',
          email: 'jon@gmail.com'

    }
]
}
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users);
})
app.post('/signin', (req, res) => {

    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password){
            res.json('success')
        } else {
            res.status(400).json('error logging in')
        }
})

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
      db('users')
        .returning('*')
        .insert({
          email: email,
          name: name,
          joined: new Date()
        
    })
    .then( user => {
      res.json(user)
    })
     .catch( err => res.status(400).json('unable to register') )
})
//profile/:userId --> GET = user 
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach( user => {
      if (user.id === id ){
          found = true;
          return res.json(user[0]);
      } 
    } )
    if (!found){
        res.status(400).json('not found');
    }
})
//image --> PUT --> user   (counting the rank) increase evrytime user use picturex
app.post('/image' , (req , res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach( user => {
      if (user.id === id ){
          found = true;
          user.entries++
          return res.json(user.entries);
      } 
    })
    if (!found){
        res.status(400).json('not found');
    } 
})
//comment
// bcrypt.hash(password, null, null, function(err, hash) {
//     // Store hash in your password DB.
//     console.log(hash);
// });
    // Load hash from your password DB.
    // bcrypt.compare("bacon", hash, function(err, res) {
    //     // res == true
    // });
    // bcrypt.compare("veggies", hash, function(err, res) {
    //     // res = false
    // });
     





app.listen(3000, () => {
    console.log('app is running on port 3000')
})


/*
/ --> res = this is working 
/sigin --> POST = succes/fail
/register --> POST = user 
/profile/:userId --> GET = user 
/image --> PUT --> user   (counting the rank)
*/