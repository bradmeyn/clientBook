import express from 'express';
const baseRouter = express.Router();
import { loginView, userDashboardView, userLogin, userLogout, getUserJobs, getUserNotes, getRegisterView, registerUser, } from '../controllers/userController.js';
import passport from 'passport';
import { isLoggedIn } from '../middleware/authentication.js';
baseRouter
    .route('/login')
    .get(loginView)
    .post(passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: true,
}), userLogin);
baseRouter.route('/register').get(getRegisterView).post(registerUser);
baseRouter.route('/logout').get(userLogout);
baseRouter.route('/dashboard').get(isLoggedIn, userDashboardView);
baseRouter.route('/notes').get(isLoggedIn, getUserNotes);
baseRouter.route('/jobs').get(isLoggedIn, getUserJobs);
export default baseRouter;
