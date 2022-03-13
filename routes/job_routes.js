const express = require('express');
const router = express.Router({ mergeParams: true });
const job_controller = require('../controllers/job_controller');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn} = require('../middleware.js');

router.route('/')
    .get(
        isLoggedIn,
        catchAsync(job_controller.job_index_get))
    .post(
        isLoggedIn,
        catchAsync(job_controller.job_create_post));

        //new client page
router.get('/new',isLoggedIn, job_controller.job_create_get);

router.route('/:jobId')
    .get(
        isLoggedIn, 
        catchAsync(job_controller.job_show))
    .put(
        isLoggedIn,
        catchAsync(job_controller.job_update_put))
    .delete(
        isLoggedIn,
        catchAsync(job_controller.job_delete));

router.route('/:jobId/update')
    .get(
        isLoggedIn,
        catchAsync(job_controller.job_update_get));



  module.exports = router;