const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    
    account: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    title: String,
    description: String,
    type: String,
    revenue: Number,
    dates: {
        created: Date,
        due: Date,
        completed: Date
    },
    status: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    owners: [{
        type: Schema.Types.ObjectId,
        ref: "User"
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
    let diff = today.getTime() - start.getTime();
    let days = Math.ceil(diff / (1000 * 3600 * 24));

    return days;
});


module.exports = mongoose.model('Job', jobSchema );
