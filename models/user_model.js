const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Account = require('./account_model');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    username: String,
    firstName: String,
    lastName: String,
    authorisation: String,
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema );

