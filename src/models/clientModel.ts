import mongoose, { Model, model } from 'mongoose';

import Account, { IAccount } from './accountModel.js';
import { IJob } from './jobModel.js';
import { INote } from './noteModel.js';
// const Account<:Model> = require('./account_model').default;

export interface IClient {
  account: mongoose.Types.ObjectId | IAccount;
  email: string;
  title: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  dob: Date;
  company: string;
  phone: string;
  notes: mongoose.Types.ObjectId[] | INote[];
  jobs: mongoose.Types.ObjectId[] | IJob[];
  address: {
    street: string;
    suburb: string;
    state: string;
    postcode: string;
  };
}

interface ClientModel extends Model<IClient> {
  fullName(): string;
  age(): number;
  home(): string;
  name(): string;
  shortDob(): string;
  birthdate(): string;
  dateValue(): string;
}

//client schema
const clientSchema = new mongoose.Schema<IClient>({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  },
  clientId: String,
  title: String,
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  preferredName: {
    type: String,
    trim: true,
  },
  dob: Date,
  jobTitle: {
    type: String,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },

  email: {
    type: String,
    trim: true,
  },
  address: {
    street: {
      type: String,
      trim: true,
    },
    suburb: {
      type: String,
      trim: true,
    },
    state: String,
    postcode: String,
  },
  phone: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
  jobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
  ],
});

clientSchema.virtual('fullName').get(function (this: IClient) {
  let preferred = this.preferredName ? `(${this.preferredName}) ` : '';
  return `${this.title} ${this.firstName} ${preferred}${this.lastName}`;
});

clientSchema.virtual('name').get(function (this: IClient) {
  let preferred = this.preferredName || this.firstName;
  return `${preferred} ${this.lastName}`;
});

clientSchema.virtual('home').get(function (this: IClient) {
  return `${this.address.street}, ${this.address.suburb} ${this.address.state} ${this.address.postcode}`;
});

clientSchema.virtual('age').get(function (this: IClient) {
  let today = new Date();

  let age = today.getFullYear() - this.dob.getFullYear();
  let m = today.getMonth() - this.dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < this.dob.getDate())) {
    age--;
  }
  return age;
});

clientSchema.virtual('shortDob').get(function (this: IClient) {
  return this.dob.toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

clientSchema.virtual('dateValue').get(function (this: IClient) {
  let dateValue = this.dob
    .toLocaleDateString('en-GB')
    .split('/')
    .reverse()
    .join('-');

  return dateValue;
});

clientSchema.virtual('birthdate').get(function (this: IClient) {
  const birthMonth = this.dob.getMonth();
  const birthDay = this.dob.getDate();
  const currentMonth = new Date().getMonth();
  const currentDay = new Date().getDate();
  const currentYear = new Date().getFullYear();
  let birthdate;
  switch (true) {
    case birthMonth === currentMonth && birthDay === currentDay:
      birthdate = 'Today';
      break;

    case birthMonth === currentMonth && birthDay === currentDay + 1:
      birthdate = 'Tomorrow';
      break;

    case birthMonth === currentMonth && birthDay === currentDay - 1:
      birthdate = 'Yesterday';
      break;

    default:
      birthdate = `${new Date(
        currentYear,
        birthMonth,
        birthDay
      ).toLocaleDateString('en-AU', {
        timeZone: 'Australia/Sydney',
        weekday: 'long',
      })}, ${birthDay}${nth(birthDay)} ${this.dob.toLocaleDateString('en-US', {
        month: 'long',
      })}`;

      break;
  }

  return birthdate;
});

const nth = (d: number) => {
  if (d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export default mongoose.model<IClient, ClientModel>('Client', clientSchema);
