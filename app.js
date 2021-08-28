const express = require('express');
const app = express();
const path = require('path');
const port =  process.env.PORT || 3000;
const methodOverride = require('method-override');

const Client = require('./models/client');
const AppError = require('./utils/AppError');
const catchAsync = require('./utils/catchAsync');
const mongoose = require('mongoose');
const dbUrl = 'mongodb://localhost:27017/client-book';

// const ejs = require('ejs');



// const clients = require('./routes/clients');

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('database connected')
});

//set view engine to ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true})); //Parse URL-encoded bodies
app.use(methodOverride('_method'));
app.use(express.static('public'))

//landing page
app.get('/', (req, res) => {
  res.render('home')
});

//all clients
app.route('/clients')
    .get( catchAsync( async (req, res) => {
      const clients = await Client.find({});
      res.render('clients/index', {clients});
  }))
  .post(catchAsync (async (req, res) => {
    
    let client = req.body.client;
  
    client.address.suburb = client.address.suburb.toUpperCase();
    client.dob.fullDate = `${client.dob.birthDay}/${client.dob.birthMonth}/${client.dob.birthYear}`;
    client.clientId = Date.now();
    console.log(client);
    
    const newClient = new Client(client);
    await newClient.save()
    .then(client => res.redirect(`clients/${client._id}`));


    
  }));

  //new client page
  app.get('/clients/new', (req, res) => {
    res.render('clients/new');
  });


  //Single client
  app.route('/clients/:id')
  .get( catchAsync(async (req, res) => {
   

      const id = req.params.id;
      const c = await Client.findById(id);
      res.render("clients/show", {c});
  }))
  .put( catchAsync (async (req, res) => {

      const id = req.params.id;
      const updatedClient = req.body.client;
      await Client.findByIdAndUpdate(id, {...updatedClient});
      console.log(updatedClient);
    //   const c = await Client.findByIdAndUpdate(id);
    res.redirect(`${id}`);
  }))
  .delete( catchAsync(async (req, res) => {
    const id = req.params.id;
    await Client.findByIdAndDelete(id);
    res.redirect('/clients')
  }));


  app.get('/clients/:id/update', catchAsync( async (req, res) => {
    const id = req.params.id;
    const c = await Client.findById(id);
    res.render("clients/update", {c});
  }));

  app.all('*', (req, res, next) => {
    next(new AppError("Page Not Found", 404))
  });


  //custom error handler
  app.use((err, req, res, next) => {
    
    const {statusCode = 500} = err;
    if(!err.message) { err.message = 'Something went wrong'};
    if(err.name === 'CastError') {err.message = `Error: Client ID of ${err.value} is not valid`, err.statusCode = 400};
    if(err.code === 11000) {err.message = `Error: Client with ID of ${err.value} already exists`, err.statusCode = 400};
    res.status(statusCode).render('error', {err});
  })


app.listen(port,() => {
    console.log(`Server running on ${port}`);
});