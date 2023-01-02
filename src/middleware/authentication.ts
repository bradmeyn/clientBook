import { NextFunction, Request, Response } from 'express';

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('error', 'Please login');
    return res.redirect('/login');
  }
};
