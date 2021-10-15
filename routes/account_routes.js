const express = require('express');
const router = express.Router();
const account_controller = require('../controllers/account_controller');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');

router.route('/register')
    .get(account_controller.account_register_get)
    .post(catchAsync(account_controller.account_register_post));

router.route('/login')
    .get(account_controller.account_login_get)
    .post(passport.authenticate('local', {failureFlash:true, failureRedirect:'/login'}), 
        catchAsync(account_controller.account_login_post));

module.exports = router;
