const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require ('bcrypt-nodejs');
const cors = require('cors');
const knex = require ('knex');
const { response } = require('express');

const register = require('./controllers/register');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'megamax',
      password : 'megamax',
      database : 'smart-brain'
    }
  });
   // kommentar 
  //db.select('*').from('users').then(data => {
    //  console.log(data);
 // });


const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users);
})
// signin ----------------------------------------
app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

// register---------------------------------------
app.post('/register', (req, res ) => {register.handleRegister(req, res, db, bcrypt)})

//profile/:userId --> GET = user 
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    
    db.select('*').from('users').where ({id})    
     .then(user => {
        if (user.length){
            res.json(user[0])
        }else {
           
            res.status(400).json('Not found')
        }        
    })
    .catch(err => res.status(400).json('Not found'))
    
})
//image --> PUT --> user   (counting the rank) increase evrytime user use picturex
app.put('/image' , (req , res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
})

    // let found = false;
    // database.users.forEach( user => {
    //   if (user.id === id ){
    //       found = true;
    //       user.entries++
    //       return res.json(user.entries);
    //   } 
    // })
    // if (!found){
    //     res.status(400).json('not found');
    // } 

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