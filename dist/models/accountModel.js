import mongoose from 'mongoose';
const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    clients: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
        },
    ],
});
export default mongoose.model('Account', accountSchema);
