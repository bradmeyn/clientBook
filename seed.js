
const mongoose = require('mongoose');
const Client = require('./models/client');
const dbUrl = 'mongodb://localhost:27017/client-book';

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('database connected')
});



const seedDb = async() => {

    //clear database
    await Client.deleteMany({});

    const cOne = new Client({
        clientId: 1,
        firstName: "Brad",
        lastName: "Meyn",
        age: 31,
        email: "bradmeyn@mail.com"
    });

    await cOne.save();

    const cTwo = new Client({
        clientId: 2,
        firstName: "Emily",
        lastName: "Byram",
        age: 27,
        email: "emilyb@mail.com"
    });

    await cTwo.save();

}

seedDb().then(() =>{
    db.close();
})