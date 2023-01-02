import express from 'express';
const clientRouter = express.Router();
import { createClient, createClientView, deleteClient, getClient, getClients, searchClient, updateClient, updateClientView, } from '../controllers/clientController.js';
// import { catchAsync } from '../utils/catchAsync';
// import AppError from '../utils/AppError';
import { isLoggedIn } from '../middleware/authentication.js';
//all clients
clientRouter.route('/').get(isLoggedIn, getClients).post(isLoggedIn, 
// validateClient,
createClient);
//new client page
clientRouter.get('/new', isLoggedIn, createClientView);
clientRouter.post('/logout', (req, res, next) => {
    req.logout((e) => {
        if (e)
            return next(e);
    });
    req.flash('success', 'logged out');
    res.redirect('/login');
});
//Single client
clientRouter
    .route('/:clientId')
    .get(isLoggedIn, getClient)
    .put(isLoggedIn, 
// validateClient,
updateClient)
    .delete(isLoggedIn, deleteClient);
// clientRouter.route('/:clientId/details').get(isLoggedIn, catchAsync(getC));
//Search route for navbar
clientRouter.route('/search').post(isLoggedIn, searchClient);
clientRouter.get('/:clientId/update', updateClientView);
export default clientRouter;
