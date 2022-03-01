const express = require('express');
const router = express.Router();
const account_controller = require('../controllers/account_controller');
const catchAsync = require('../utils/catchAsync');


router.route('/register')
    .get(account_controller.account_register_get)
    .post(catchAsync(account_controller.account_register_post));

    module.exports = router;