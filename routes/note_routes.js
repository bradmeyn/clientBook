const express = require('express');
const router = express.Router({ mergeParams: true });
const note_controller = require('../controllers/note_controller');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const {validateClient, isLoggedIn} = require('../middleware.js');

router.route('/')
    .get(
        isLoggedIn,
        catchAsync(note_controller.note_index_get))
    .post(
        isLoggedIn,
        catchAsync(note_controller.note_create_post));

router.route('/:noteId')
    .get(
        isLoggedIn, 
        catchAsync(note_controller.note_show))
    .put(
        isLoggedIn,
        catchAsync(note_controller.note_update_put))
    .delete(
        isLoggedIn,
        catchAsync(note_controller.note_delete));

router.route('/:noteId/update')
    .get(
        isLoggedIn,
        catchAsync(note_controller.note_update_get));



  module.exports = router;