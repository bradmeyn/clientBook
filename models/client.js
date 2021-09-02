const mongoose = require('mongoose');

//client schema
const clientSchema = new mongoose.Schema({
    clientId: Number,
    salutation: String,
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    dob: {
        birthDay: String,
        birthMonth: String,
        birthYear: String,
        fullDate: String
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    address: {
        street: {
            type: String,
            trim: true
        },
        suburb: {
            type: String,
            trim: true,
            uppercase: true
        },
        state: String,
        postcode: String,
    }

});


module.exports =  mongoose.model('Client', clientSchema);