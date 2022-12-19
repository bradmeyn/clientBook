import express, { urlencoded, static, json } from 'express';
const app = express();
require('dotenv').config();
import { join } from 'path';
import methodOverride from 'method-override';
import mongoSanitize from 'express-mongo-sanitize';

import session from 'express-session';
import { create } from 'connect-mongo';
import flash from 'connect-flash';
import helmet from 'helmet';

const connectDB = require('./config/database')();

// Passport Config
import passport, { initialize, session as _session } from 'passport';
require('./config/passport')(passport);

//store session in mongo
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/client-book';
const secret = process.env.SECRET || 'charlieisagoodboy';
const sessionStore = create({
  mongoUrl: dbUrl,
  autoRemove: 'native',
  crypto: {
    secret,
  },
});

const sessionConfig = {
  store: sessionStore,
  name: 'session-cb',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 * 24 }, // 1 day
};

app.use(session(sessionConfig));

sessionStore.on('error', (e) => {
  console.log('Session store error: ', e);
});

//set view engine to ejs
app.set('views', [join(__dirname, 'views'), join(__dirname, 'views/clients')]);
app.set('view engine', 'ejs');

app.use(urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(methodOverride('_method')); // for put/delete requests
app.use(static('public')); //make public
app.use(json());
app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));

app.use(initialize());
app.use(_session());

app.use(flash());

import { findById } from './models/account_model';
app.use(async (req, res, next) => {
  //make current user details available across all templates
  res.locals.currentUser = req.user;

  if (req.user) {
    const account = req.user.account;
    res.locals.currentAccount = await findById(account);
  }
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

//routes
import client_routes from './routes/client_routes';
import account_routes from './routes/account_routes';
import user_routes from './routes/user_routes';
import note_routes from './routes/note_routes';
import job_routes from './routes/job_routes';

app.use('/', account_routes);
app.use('/', user_routes);
app.use('/clients', client_routes);
app.use('/clients/:clientId/notes', note_routes);
app.use('/clients/:clientId/jobs', job_routes);

//landing page
app.get('/', (req, res) => {
  res.render('landing');
});

//custom error handler
app.use((err, req, res, next) => {
  console.log(err);
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = 'Something went wrong';
  }
  if (err.name === 'CastError') {
    (err.message = `Error: Client ID of ${err.value} is not valid`),
      (err.statusCode = 400);
  }
  if (err.code === 11000) {
    (err.message = `Error: Client with ID of ${err.value} already exists`),
      (err.statusCode = 400);
  }
  res.status(statusCode).render('error', { err });
});

// --------------- SERVER ---------------

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
