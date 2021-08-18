
const mongoose = require('mongoose');
const Dog = require('./models/dog');
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

    const cOne = new Dog({
        dogId: 1,
        name: "Charlie",
        breed: "Cavoodle",
        sex: "male",
        age: 2,
        about: "A good boy that loves playing ball",
        owner: "Brad",
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