const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
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
  // email: {
  //   type: String,
  //   required: true,
  //   unique: true,
  // },
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
});

userSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

module.exports = mongoose.model('User', userSchema);
