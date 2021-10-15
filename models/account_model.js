const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = require('./user_model').schema;
const clientSchema = require('./client_model').schema;

const accountSchema = new Schema({
    accountId: String,
    name: String,
    users: [userSchema],
    // clients: [clientSchema]
});



module.exports = mongoose.model('Account', accountSchema );

