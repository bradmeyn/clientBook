const mongoose = require('mongoose');

//client schema
const dogSchema = new mongoose.Schema({
    dogId: Number,
    name: String,
    breed: String,
    sex: String,
    age: Number,
    about: String,
    owner: String,
    email: String,
    
});


module.exports =  mongoose.model('Dog', dogSchema);
