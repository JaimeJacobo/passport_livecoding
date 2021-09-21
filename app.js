require('dotenv').config();

const port = process.env.PORT || 5555

//3. Import the packages we just installed
const bcrypt = require('bcrypt')
const flash = require('connect-flash')
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

//14. Import the User model
const User = require('./models/User.model')

//4. Set up the server with express
const app = express()

//5. Add the middleware for req.body
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//6. Connect your app to Mongo Atlas through Mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uwtd8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
.then((result)=>{
  console.log('Connected to Mongo Atlas')
})
.catch((err)=>{
  console.log(`Error connecting to the DB: ${err}`)
})

//8. Configure the middleware for the session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
)

//9. Configure the serialization of the user
passport.serializeUser((user, callback)=>{
  callback(null, user._id)
})

//10. Configure the deserialization of the user
passport.deserializeUser((id, callback)=>{
  User.findById(id)
    .then((result)=>{
      callback(null, result)
    })
    .catch((err)=>{
      callback(err)
    })
})

//11. Configure the middleware for flash
app.use(flash())


//12. Configure the middleware for the Strategy
passport.use(
  new LocalStrategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true
  }, (req, username, password, next)=>{
    User.findOne({username})
    .then((user)=>{
      if(!user){
        return next(null, false, {message: 'Incorrect username'})
      }

      if(!bcrypt.compareSync(password, user.password)){
        return next(null, false, {message: 'Incorrect password'})
      }

      return next(null, user)

    })
    .catch((err)=>{
      next(err)
    })
  })
)

//15. Configure passport middleware
app.use(passport.initialize())
app.use(passport.session())

// 17. Connect the router to app.js
app.use("/auth", require('./routes/auth.routes'))


app.listen(port, ()=>{
  console.log(`Connected in Port ${port}`)
})