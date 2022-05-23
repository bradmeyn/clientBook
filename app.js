require('dotenv').config();
const express = require('express');
const app = express();

const path = require('path');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const helmet = require('helmet');

const connectDB = require('./config/database')();

// Passport Config
const passport = require('passport');
require('./config/passport')(passport);

//store session in mongo
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/client-book';
const secret = process.env.SECRET || 'charlieisagoodboy';
const sessionStore = MongoStore.create({
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
app.set('views', [
  path.join(__dirname, 'views'),
  path.join(__dirname, 'views/clients'),
]);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(methodOverride('_method')); // for put/delete requests
app.use(express.static('public')); //make public
app.use(express.json());
app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

const Account = require('./models/account_model');
app.use(async (req, res, next) => {
  //make current user details available across all templates
  res.locals.currentUser = req.user;

  if (req.user) {
    const account = req.user.account;
    res.locals.currentAccount = await Account.findById(account);
  }
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

//routes
const client_routes = require('./routes/client_routes');
const account_routes = require('./routes/account_routes');
const user_routes = require('./routes/user_routes');
const note_routes = require('./routes/note_routes');
const job_routes = require('./routes/job_routes');

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
