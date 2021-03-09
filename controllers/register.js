const handleRegister = (req, res, db, bcrypt) => {
    const {email, name, password} = req.body;
    //https://www.npmjs.com/package/bcrypt  from 
    // Store hash in your password DB.
    const hash = bcrypt.hashSync(password);

    // Load hash from your password DB.
    //bcrypt.compareSync(myPlaintextPassword, hash); // true
    //bcrypt.compareSync(someOtherPlaintextPassword, hash); // false
      db.transaction(trx =>{
        trx.insert({
          hash: hash,
          email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date()
            })
            .then( user => {
              res.json(user)
            })      
       })    
       .then(trx.commit)
       .catch(trx.rollback) 
    })    
     .catch( err => res.status(400).json('unable to register') )
}

module.exports = {
    handleRegister: this.handleRegister
};