import mongoose from 'mongoose';
const noteSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
    },
    title: String,
    category: String,
    date: Date,
    detail: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job',
    },
});
noteSchema.virtual('createdDate').get(function () {
    return this.date.toLocaleDateString('en-gb', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});
export default mongoose.model('Note', noteSchema);
