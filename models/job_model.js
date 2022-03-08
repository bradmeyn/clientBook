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
    dates: {
        created: Date,
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

jobSchema.virtual('activeDays')
.get(function() {
    let start = this.dates.created;
    let today = new Date();
    let diff = start.getTime() - today.getTime();
    let days = Math.ceil(diff / (1000 * 3600 * 24));

    return days;
});


module.exports = mongoose.model('Job', jobSchema );
