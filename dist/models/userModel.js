import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: String,
    firstName: String,
    lastName: String,
    authorisation: String,
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note',
        },
    ],
});
userSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
});
export default mongoose.model('User', userSchema);
