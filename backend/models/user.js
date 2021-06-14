const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
email: { type: String,  unique:true, required: true }, // email unique
password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);