const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const User = require('./user_model');

const noteSchema = new Schema({
    
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    title: String,
    category: String,
    date: Date,
    detail: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
});


module.exports = mongoose.model('Note', noteSchema );

