// 13. Create a models folder. Create a "User.model.js" file with the schema of the user inside

const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  username: {type: String, required: true},
  password: {type: String, required: true}
})

const UserModel = model('User', userSchema)

module.exports = UserModel