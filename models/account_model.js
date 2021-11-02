const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user_model');
const Client = require('./client_model');

const accountSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    clients: [{
        type: Schema.Types.ObjectId,
        ref: "Client"
    }]
});



module.exports = mongoose.model('Account', accountSchema );

