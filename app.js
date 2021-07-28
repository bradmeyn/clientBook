const express = require('express');
const app = express();
const path = require('path');
const port =  process.env.PORT || 3000;

const Client = require('./models/client');

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

//landing page
app.get('/', (req, res) => {
  res.render('home')
});

//all clients
app.route('/clients')
    .get(async (req, res) => {
      const clients = await Client.find({});
      console.log(clients);
      res.render('clients/index', {clients});
  })
  .post((req, res) => {
    res.send('create a client');
  });

  //new client page
  app.get('/clients/new', (req, res) => {

    
    res.render('clients/new');
  });


  //Single client
  app.route('/clients/:id')
  .get((req, res) => {
    res.send('/client show');
  })
  .put((req, res) => {
    res.send('you have sent a post request');
  })
  .delete((req, res) => {
    res.send('you have sent a post request');
  });

  app.get('/clients/:id/update', (req, res) => {
    res.send('update client')
  })


app.listen(port,() => {
    console.log(`Server running on ${port}`);
});