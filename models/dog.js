const mongoose = require('mongoose');

//client schema
const dogSchema = new mongoose.Schema({
    dogId: Number,
    Name: String,
    Breed: String,
    Sex: String,
    dateOfBirth: String,
    About: String,
    


});


module.exports =  mongoose.model('Dog', dogSchema);
