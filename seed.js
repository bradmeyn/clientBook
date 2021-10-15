
const mongoose = require('mongoose');
const Client = require('./models/client');
const dbUrl = 'mongodb://localhost:27017/client-book';
const { v4: uuidv4 } = require('uuid');

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('database connected')
});



const seedDb = async() => {



    const accountOne = new Account({
        accountId: uuidv4();
        name: 'Test Account',

    })




    //clear database
    await Client.deleteMany({});

    const cOne = new Client({
        clientId: 'test1',
        salutation: 'Mr',
        firstName: "Bradley",
        lastName: "Meyn",
        dateOfBirth: "10/07/1990",
        email: "bradjmeyn@gmail.com",
        phone: '0431558814',
        address: {
            street: '205 Kings Road',
            suburb: 'New Lambton',
            state: 'NSW',
            postcode: '2305'
        }
    });

    await cOne.save();

    const cTwo = new Client({
        clientId: 'test2',
        salutation: 'Miss',
        firstName: "Emily",
        lastName: "Byram",
        dateOfBirth: "26/9/1993",
        email: "emilyb@mail.com",
        phone: '0413235647',
        address: {
            street: '205 Kings Road',
            suburb: 'New Lambton',
            state: 'NSW',
            postcode: '2305'
        }
    });

    await cTwo.save();

}

seedDb().then(() =>{
    db.close();
})