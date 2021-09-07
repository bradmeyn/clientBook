const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/user_controller');

const catchAsync = require('../utils/catchAsync');

router.route('/register')
    .get(user_controller.user_register_get)
    .post(catchAsync(user_controller.user_register_post));


module.exports = router;