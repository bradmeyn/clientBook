const mongoose = require('mongoose');

//client schema
const clientSchema = new mongoose.Schema({
    clientId: Number,
    salutation: String,
    firstName: String,
    lastName: String,
    dob: {
        birthDay: String,
        birthMonth: String,
        birthYear: String,
        fullDate: String
    },
    phone: String,
    email: String,
    address: {
        street: String,
        suburb: String,
        state: String,
        postcode: String,
    }

});


module.exports =  mongoose.model('Client', clientSchema);