const express = require('express');
const router = express.Router();
const client_controller = require('../controllers/client_controller');

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const {validateClient} = require('../middleware.js');

//all clients
router.route('/')
    .get(
        catchAsync( client_controller.client_index))
    .post(
        validateClient, 
        catchAsync (client_controller.client_create_post));

//new client page
router.get('/new', client_controller.client_create_get);


  //Single client
  router.route('/:id')
  .get(
      catchAsync(client_controller.client_show))
  .put(
      validateClient, 
      catchAsync (client_controller.client_update_put))
  .delete(
      catchAsync(client_controller.client_delete));


  router.get('/:id/update', catchAsync( client_controller.client_update_get));

  module.exports = router;