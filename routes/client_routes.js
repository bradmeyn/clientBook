const express = require('express');
const router = express.Router();
const client_controller = require('../controllers/client_controller');

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const {validateClient, isLoggedIn} = require('../middleware.js');

//all clients
router.route('/')
    .get(
        isLoggedIn,
        catchAsync(client_controller.client_index))
    .post(
        isLoggedIn,
        validateClient, 
        catchAsync (client_controller.client_create_post));

//new client page
router.get('/new',isLoggedIn, client_controller.client_create_get);

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'logged out');
    res.redirect('/login');
});


  //Single client
  router.route('/:id')
  .get(
    isLoggedIn,
    catchAsync(client_controller.client_show))
  .put(
    isLoggedIn,
    validateClient, 
    catchAsync (client_controller.client_update_put))
  .delete(
    isLoggedIn,
    catchAsync(client_controller.client_delete));

  //Search route for navbar
  router.route('/search')
  .post(
    isLoggedIn,
    catchAsync(client_controller.client_search));


  router.get('/:id/update', catchAsync( client_controller.client_update_get));

  module.exports = router;