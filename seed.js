
const mongoose = require('mongoose');
<<<<<<< HEAD
const Dog = require('./models/dog');
=======
const Client = require('./models/client');
>>>>>>> 2e9094ea9a2710baddd7695a80723a6dfb68a8f0
const dbUrl = 'mongodb://localhost:27017/dogBook';

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('database connected')
});



const seedDb = async() => {

    //clear database
    await Dog.deleteMany({});

<<<<<<< HEAD
    const cOne = new Dog({
        dogId: 1,
        name: "Charlie",
        breed: "Cavoodle",
        sex: "male",
        age: 2,
        about: "A good boy that loves playing ball",
        owner: "Brad",
=======
    const cOne = new Client({
        clientId: 1,
        firstName: "Brad",
        lastName: "Meyn",
        age: 31,
>>>>>>> 2e9094ea9a2710baddd7695a80723a6dfb68a8f0
        email: "bradmeyn@mail.com"
    });

    await cOne.save();

    const cTwo = new Dog({
        dogId: 2,
        name: "Bonnie",
        breed: "Schnoodle",
        sex: "female",
        age: 1,
        about: "Still learning to use the doggy door",
        owner: "Tom",
        email: "bonnie@mail.com"
    });

    await cTwo.save();

}

seedDb().then(() =>{
    db.close();
})