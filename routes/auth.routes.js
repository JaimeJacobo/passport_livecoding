// 18. Import router, passport, bcrypt and the User model. Export the router 
const router = require('express').Router()
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('../models/User.model')


// Create middleware for checking if the user is logged in

// ****** Route for checking if the user is logged in
router.get('/verify', (req, res)=>{
  if(req.isAuthenticated()){
     res.send(req.user)
  } else {
    res.send({})
  }
})

// Route for sending the errors to the client
router.get('/errors', (req, res)=>{
  res.send({message: req.flash("error")})
})

// Route POST to sign up a new user
router.post('/signup', (req, res)=>{
  const {username, password} = req.body

  const hashedPassword = bcrypt.hashSync(password, 10);

  User.create({username, password: hashedPassword})
    .then((user)=>{
      res.send(user)
    })
    .catch((err)=>{
      res.send(err)
    })
})

// Route POST to log in
router.post('/login', passport.authenticate("local", {
  successRedirect: '/auth/verify',
  failureRedirect: '/auth/errors',
  failureFlash: true,
  passReqToCallback: true
}))


// Route POST to log out
router.post('/logout', (req, res)=>{
  req.logout()
  res.redirect('/auth/verify')
})

module.exports = router;