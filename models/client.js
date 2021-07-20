const mongoose = require('mongoose');

//client schema
const clientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    
    email: String

});


module.exports =  mongoose.model('Client', clientSchema);