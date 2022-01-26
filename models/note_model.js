const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const User = require('./user_model');

const noteSchema = new Schema({
    
    title: String,
    date: String,
    details: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
});


module.exports = mongoose.model('Note', noteSchema );

