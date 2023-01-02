import mongoose, { Types, Model } from 'mongoose';
import { IUser } from './userModel.js';
import { IClient } from './clientModel.js';
import { IAccount } from './accountModel.js';
import { IJob } from './jobModel.js';

export interface INote {
  id: Types.ObjectId;
  account: Types.ObjectId | IAccount;
  title: string;
  category: string;
  date: Date;
  detail: string;
  author: Types.ObjectId | IUser;
  client: Types.ObjectId | IClient;
  job: Types.ObjectId | IJob;
}

interface NoteModel extends Model<INote> {
  createdDate(): string;
}

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

noteSchema.virtual('createdDate').get(function (this: INote) {
  return this.date.toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

export default mongoose.model<INote, NoteModel>('Note', noteSchema);
