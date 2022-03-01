const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    title: String,
    type: String,
    revenue: {
        upfront: Number,
        ongoing: Number
    },
    date: {
        created: Date,
        inProgress: Date,
        completed: Date
    },
    status: String,
    owners: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    clients: [{
        type: Schema.Types.ObjectId,
        ref: "Client"
    }],
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }],
});


module.exports = mongoose.model('Job', jobSchema );
