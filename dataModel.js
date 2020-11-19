const mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String
})


const User =mongoose.model("users", userSchema)

module.exports = User;
