import mongoose, { Types } from 'mongoose';
import { IClient } from './clientModel.js';
import { IUser } from './userModel.js';

export interface IAccount {
  id: Types.ObjectId;
  name: string;
  users: Types.ObjectId[] | IUser[];
  clients: Types.ObjectId[] | IClient[];
}

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

export default mongoose.model<IAccount>('Account', accountSchema);
