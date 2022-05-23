const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
  },
  title: String,
  category: String,
  date: Date,
  detail: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
  },
  job: {
    type: Schema.Types.ObjectId,
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

module.exports = mongoose.model('Note', noteSchema);
