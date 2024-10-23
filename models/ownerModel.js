const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    prodcuts: [],
    picture: String,
    gstin: String
})

module.exports = mongoose.model('owner', userSchema);