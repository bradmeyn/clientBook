const express = require('express');
const app = express();
const path = require('path');
const port =  process.env.PORT || 3000;
const methodOverride = require('method-override');

const Dog = require('./models/dog');

const mongoose = require('mongoose');
const dbUrl = 'mongodb://localhost:27017/dogBook';

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('database connected')
});

//set view engine to ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: true})); //Parse URL-encoded bodies
app.use(methodOverride('_method'));

//landing page
app.get('/', (req, res) => {
  res.render('home')
});

//all dogs
app.route('/dogs')
    .get( async (req, res) => {
      const dogs = await Dog.find({});
      console.log(dogs);
      res.render('dogs/index', {dogs});
  })
  .post(async (req, res) => {

    let {birthDay, birthMonth, birthYear, ...dog} = req.body.dog;
    
    // console.log(clientData, birthDay, birthMonth, birthYear);

    dog.dateOfBirth = `${birthYear}-${birthMonth}-${birthDay}`;
    console.log(dog.dateOfBirth);
    
    const newDog = new Dog(dog);
    await newDog.save()
    .then(dog => res.redirect(`dogs/${dog._id}`));


    
  });

  //new client page
  app.get('/dogs/new', (req, res) => {
    res.render('dogs/new');
  });


  //Single client
  app.route('/dogs/:id')
  .get( async (req, res) => {
      const id = req.params.id;
<<<<<<< HEAD
      const dog = await Dog.findById(id);
      res.render("dogs/show", {dog});
=======
      const c = await Dog.findById(id);
      res.render("dogs/show", {c});
>>>>>>> 2e9094ea9a2710baddd7695a80723a6dfb68a8f0
  })
  .put(async (req, res) => {

      const id = req.params.id;
      const updatedDog = req.body.dog;
      await Dog.findByIdAndUpdate(id, {...updatedDog});
      console.log(updatedDog);
    //   const c = await Client.findByIdAndUpdate(id);
    res.redirect(`${id}`);
  })
  .delete( async (req, res) => {
    const id = req.params.id;
    await Dog.findByIdAndDelete(id);
    res.redirect('/dogs')
  });


  app.get('/dogs/:id/update', async (req, res) => {
    const id = req.params.id;
    const dog = await Dog.findById(id);
    res.render("dogs/update", {dog});
  })


app.listen(port,() => {
    console.log(`Server running on ${port}`);
});