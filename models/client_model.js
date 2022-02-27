const { number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Account = require('./account_model');
//client schema
const clientSchema = new Schema({
    clientId: String,
    salutation: String,
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    dob: Date,
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
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
    

});



module.exports =  mongoose.model('Client', clientSchema);