import mongoose, { Types, Model } from 'mongoose';
import { IAccount } from './accountModel.js';
import { IClient } from './clientModel.js';
import { INote } from './noteModel.js';
import { IUser } from './userModel.js';

export interface IJob {
  account: Types.ObjectId | IAccount;
  title: string;
  owner: Types.ObjectId | IUser;
  creator: Types.ObjectId | IUser;
  description: string;
  type: string;
  revenue: number;
  created: Date;
  due: Date;
  completed: Date;
  status: string;
  notes: Types.ObjectId[] | INote[];
  client: Types.ObjectId | IClient;
}

interface JobModel extends Model<IJob> {
  activeDays(): string;
  dueDate(): string;
  createdDate(): string;
  completedDate(): string;
  dateValue(): string;
  rev$(): string;
}

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

jobSchema.virtual('activeDays').get(function (this: IJob) {
  let start = this.created;
  let today = this.status === 'Completed' ? this.completed : new Date();
  let diff = today.getTime() - start.getTime();
  let days = Math.ceil(diff / (1000 * 3600 * 24));

  return days;
});

jobSchema.virtual('dueDate').get(function (this: IJob) {
  return this.due.toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

jobSchema.virtual('createdDate').get(function (this: IJob) {
  return this.created.toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

jobSchema.virtual('completedDate').get(function (this: IJob) {
  return this.completed.toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

jobSchema.virtual('dateValue').get(function (this: IJob) {
  let dateValue = this.due
    .toLocaleDateString('en-GB')
    .split('/')
    .reverse()
    .join('-');

  return dateValue;
});

jobSchema.virtual('rev$').get(function (this: IJob) {
  let rev;

  if (!this.revenue) {
    rev = Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(0);
  } else {
    rev = Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(this.revenue);
  }

  return rev;
});

export default mongoose.model<IJob, JobModel>('Job', jobSchema);
