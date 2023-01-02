import mongoose from 'mongoose';
const jobSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
    },
    title: String,
    description: String,
    type: String,
    revenue: Number,
    created: Date,
    due: Date,
    completed: Date,
    status: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note',
        },
    ],
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
    },
});
jobSchema.virtual('activeDays').get(function () {
    let start = this.created;
    let today = this.status === 'Completed' ? this.completed : new Date();
    let diff = today.getTime() - start.getTime();
    let days = Math.ceil(diff / (1000 * 3600 * 24));
    return days;
});
jobSchema.virtual('dueDate').get(function () {
    return this.due.toLocaleDateString('en-gb', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});
jobSchema.virtual('createdDate').get(function () {
    return this.created.toLocaleDateString('en-gb', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});
jobSchema.virtual('completedDate').get(function () {
    return this.completed.toLocaleDateString('en-gb', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});
jobSchema.virtual('dateValue').get(function () {
    let dateValue = this.due
        .toLocaleDateString('en-GB')
        .split('/')
        .reverse()
        .join('-');
    return dateValue;
});
jobSchema.virtual('rev$').get(function () {
    let rev;
    if (!this.revenue) {
        rev = Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(0);
    }
    else {
        rev = Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(this.revenue);
    }
    return rev;
});
export default mongoose.model('Job', jobSchema);
