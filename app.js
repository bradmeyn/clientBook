const express = require('express');
const app = express();
const path = require('path');
const port =  process.env.PORT || 3000;
const methodOverride = require('method-override');

const session = require('express-session');
const flash = require('connect-flash');

//routes
const client_routes = require('./routes/client_routes');
const account_routes = require('./routes/account_routes');
const note_routes = require('./routes/note_routes');

const mongoose = require('mongoose');

const User = require('./models/user_model');
const Account = require('./models/account_model');
const dbUrl = 'mongodb://localhost:27017/client-book';

//passport
const passport = require('passport');
const LocalStrategy = require('passport-local');



// const clients = require('./routes/clients');

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('database connected')
});

//set view engine to ejs
app.set('views',[path.join(__dirname, 'views'), path.join(__dirname, 'views/clients')]);
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true})); //Parse URL-encoded bodies
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.json());


const sessionConfig = {
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }

};

app.use(session(sessionConfig));
app.use(flash());



//passport persistent sessions
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use( async (req, res, next) => {
  //make current user details available across all templates
  res.locals.currentUser = req.user;

  if(req.user){
    const account = req.user.account
    res.locals.currentAccount = await Account.findById(account);
  }
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', account_routes);
app.use('/clients', client_routes);
app.use('/clients/:id/notes', note_routes);

//landing page
app.get('/', (req, res) => {
  res.render('landing')
});


  //custom error handler
  app.use((err, req, res, next) => {
    
    const {statusCode = 500} = err;
    if(!err.message) { err.message = 'Something went wrong'};
    if(err.name === 'CastError') {err.message = `Error: Client ID of ${err.value} is not valid`, err.statusCode = 400};
    if(err.code === 11000) {err.message = `Error: Client with ID of ${err.value} already exists`, err.statusCode = 400};
    res.status(statusCode).render('error', {err});
  });


  // app.post('/search', (req, res) => {
  // console.log(req.body);
  // })


app.listen(port,() => {
    console.log(`Server running on ${port}`);
});