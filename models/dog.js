const mongoose = require('mongoose');

//client schema
const dogSchema = new mongoose.Schema({
    dogId: Number,
<<<<<<< HEAD
    name: String,
    breed: String,
    sex: String,
    age: Number,
    about: String,
    owner: String,
    email: String,
    
=======
    Name: String,
    Breed: String,
    Sex: String,
    dateOfBirth: String,
    About: String,
    


>>>>>>> 2e9094ea9a2710baddd7695a80723a6dfb68a8f0
});


module.exports =  mongoose.model('Dog', dogSchema);
