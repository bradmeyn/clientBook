const express = require('express');
const app = express();
const path = require('path');
const port =  process.env.PORT || 3000;
const methodOverride = require('method-override');

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

app.use(express.urlencoded({extended: true})); //Parse URL-encoded bodies
app.use(methodOverride('_method'));

//landing page
app.get('/', (req, res) => {
  res.render('home')
});

//all clients
app.route('/clients')
    .get( async (req, res) => {
      const clients = await Client.find({});
      console.log(clients);
      res.render('clients/index', {clients});
  })
  .post(async (req, res) => {

    let {birthDay, birthMonth, birthYear, ...clientData} = req.body.client;
    
    // console.log(clientData, birthDay, birthMonth, birthYear);

    clientData.dateOfBirth = `${birthYear}-${birthMonth}-${birthDay}`;
    console.log(clientData.dateOfBirth);
    
    const newClient = new Client(clientData);
    await newClient.save()
    .then(client => res.redirect(`clients/${client._id}`));


    
  });

  //new client page
  app.get('/clients/new', (req, res) => {
    res.render('clients/new');
  });


  //Single client
  app.route('/clients/:id')
  .get( async (req, res) => {
      const id = req.params.id;
      const c = await Client.findById(id);
      res.render("clients/show", {c});
  })
  .put(async (req, res) => {

      const id = req.params.id;
      const updatedClient = req.body.client;
      await Client.findByIdAndUpdate(id, {...updatedClient});
      console.log(updatedClient);
    //   const c = await Client.findByIdAndUpdate(id);
    res.redirect(`${id}`);
  })
  .delete( async (req, res) => {
    const id = req.params.id;
    await Client.findByIdAndDelete(id);
    res.redirect('/clients')
  });


  app.get('/clients/:id/update', async (req, res) => {
    const id = req.params.id;
    const c = await Client.findById(id);
    res.render("clients/update", {c});
  })


app.listen(port,() => {
    console.log(`Server running on ${port}`);
});