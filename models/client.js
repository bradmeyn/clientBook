const mongoose = require('mongoose');

//client schema
const clientSchema = new mongoose.Schema({
    // clientId: Number,
    firstName: String,
    lastName: String,
    dateOfBirth: String,
    phoneNo: String,
    email: String

});


module.exports =  mongoose.model('Client', clientSchema);