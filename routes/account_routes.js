const express = require('express');
const router = express.Router();
const account_controller = require('../controllers/account_controller');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');


const {isLoggedIn} = require('../middleware.js');


router.route('/register')
    .get(account_controller.account_register_get)
    .post(catchAsync(account_controller.account_register_post));

router.route('/login')
    .get(account_controller.account_login_get)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), account_controller.account_login_post);

router.route('/logout')
    .get(account_controller.account_logout)
module.exports = router;


router.route('/dashboard')
.get(
  isLoggedIn,
  catchAsync(account_controller.dashboard_get));