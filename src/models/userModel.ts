import mongoose, { Types } from 'mongoose';
import { IAccount } from './accountModel.js';
import { INote } from './noteModel.js';

export interface IUser {
  id: Types.ObjectId;
  account: Types.ObjectId | IAccount;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  authorisation: string;
  notes: Types.ObjectId[] | INote[];
}

interface UserModel extends mongoose.Model<IUser> {
  fullName(): string;
}

const userSchema = new mongoose.Schema<IUser, UserModel>({
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

userSchema.virtual('fullName').get(function (this: IUser) {
  return this.firstName + ' ' + this.lastName;
});

export default mongoose.model<IUser, UserModel>('User', userSchema);
