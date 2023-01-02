import { IUser } from '../models/userModel';
import { IAccount } from '../models/accountModel';
import express from 'express';
import passport, { Passport } from 'passport';
import { Types } from 'mongoose';

export {};

declare global {
  namespace Express {
    export interface User extends IUser {}
  }
}
