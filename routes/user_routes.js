const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware.js');

router
  .route('/login')
  .get(user_controller.user_login_get)
  .post(
    passport.authenticate('local', {
      failureRedirect: '/login',
      // successRedirect: '/dashboard',
      failureFlash: true,
    }),
    user_controller.user_login_post
  );

router.route('/logout').get(user_controller.user_logout);

router
  .route('/dashboard')
  .get(isLoggedIn, catchAsync(user_controller.user_dashboard_get));

router
  .route('/notes')
  .get(isLoggedIn, catchAsync(user_controller.user_notes_get));

router
  .route('/jobs')
  .get(isLoggedIn, catchAsync(user_controller.user_jobs_get));

module.exports = router;
