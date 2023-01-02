import express, {
  urlencoded,
  json,
  Request,
  Response,
  NextFunction,
} from 'express';
import Account from './models/accountModel.js';
const app = express();

import dotenv from 'dotenv';
dotenv.config();

const dbUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.DB_URL
    : 'mongodb://127.0.0.1:27017/clientbook';

import { connectDB } from './config/database.js';
connectDB(dbUrl!);

import methodOverride from 'method-override';
import mongoSanitize from 'express-mongo-sanitize';

import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import helmet from 'helmet';

//Routers
import baseRouter from './routes/userRoutes.js';
import clientRouter from './routes/clientRoutes.js';
import noteRouter from './routes/noteRoutes.js';
import jobRouter from './routes/jobRoutes.js';

// Passport Config
import passport from 'passport';
import passportConfig from './config/passport.js';
passportConfig(passport);

//store session in mongo

console.log('app', dbUrl);
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

// set view engine to ejs
// app.set('views', './views');
app.set('view engine', 'ejs');

app.use(urlencoded({ extended: true })); //Parse URL-encoded bodies
app.use(methodOverride('_method')); // for put/delete requests
app.use(express.static('./public')); //make public
app.use(json());
app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(async (req: Request, res: Response, next: NextFunction) => {
  // make current user details available across all templates
  res.locals.currentUser = req.user;

  const account = req.user?.account;
  res.locals.currentAccount = await Account.findById(account);

  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

//routes
app.use('/', baseRouter);
app.use('/clients', clientRouter);
app.use('/clients/:clientId/notes', noteRouter);
app.use('/clients/:clientId/jobs', jobRouter);

//landing page
app.get('/', (req, res) => {
  try {
    res.render('landing');
  } catch (e: any) {
    console.log(e);
  }
});

//custom error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
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
  console.log(`Server running on ${port} in ${process.env.NODE_ENV}`);
});
