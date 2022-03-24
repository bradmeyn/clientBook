const Account = require('../models/account_model');
const User = require('../models/user_model');
const Client = require('../models/client_model');
const Note = require('../models/note_model');
const Job = require('../models/job_model');

//Display user login form on GET
module.exports.user_login_get = (req, res) => {
    //test client 

   
    res.render('users/login')
}

//Handle user login on POST
module.exports.user_login_post = async (req, res) => {
    req.flash('success', 'Welcome back ' + req.user.firstName);
    res.redirect('/dashboard')
    }

//Display user dashboard
module.exports.user_dashboard_get = async (req, res) => {
    await Client.deleteMany({});
    await Note.deleteMany({});
    await Job.deleteMany({});
    const acc = req.user.account;
    
    const clientOne = new Client({
        account: acc,
        clientId: Date.now(),
        salutation: 'Mr',
        firstName: 'Bradley',
        lastName: 'Meyn',
        preferredName: 'Brad',
        dob: new Date(1990,6,10),
        occupation: 'Junior Developer',
        employer: 'Google',
        email: 'bradjmeyn@gmail.com',
        address: {
            street: '205 Kings Road',
            suburb: 'New Lambton',
            state: 'NSW',
            postcode: '2305',
        },
        phone: {
            number: '0413235647',
            phoneType: 'mobile'
        }
    });

    await clientOne.save();

    const clientTwo = new Client({
        account: acc,
        clientId: '123456789101112',
        salutation: 'Miss',
        firstName: 'Emily',
        lastName: 'Byram',
        preferredName: 'Emily',
        dob: new Date(1990,6,10),
        occupation: 'Science Teacher',
        employer: 'Maitland High School',
        email: 'eebyram@gmail.com',
        address: {
            street: '205 Kings Road',
            suburb: 'New Lambton',
            state: 'NSW',
            postcode: '2305',
        },
        phone: {
            number: '0431558814',
            phoneType: 'mobile'
        }
    });

    clientOne.relationship = {partner: clientTwo, status: "Partner" };
    clientTwo.relationship = {partner: clientOne._id, status: "Partner" };

    await clientOne.save();
    await clientTwo.save();



    await clientOne.save();
    // await clientTwo.save();

    
    

    // clientOne.save(()=>{
    //     console.log('Brad: ', clientOne);
    // });
    // clientTwo.save(()=>{
    //     console.log('Emily: ', clientTwo);
    // });

    // await clientTwo.save();

    // const nOne = {
    //     account: acc,
    //     title: 'Test Note',
    //     category: 'Phone call',
    //     date: new Date(),
    //     detail: "Called Brad to catch up and see how he's going",
    //     author: req.user
    // };

    // const noteOne = new Note(nOne);
    // noteOne.save();
    // clientOne.notes.push(noteOne);

    // const nTwo = {
    //     account: acc,
    //     title: 'Test Two',
    //     category: 'Phone call',
    //     date: new Date(),
    //     detail: "Called Brad to catch up and see how he's going",
    //     author: req.user
    // };

    // const noteTwo = new Note(nTwo);
    // noteTwo.save();
    // clientOne.notes.push(noteTwo);

    // const nThree = {
    //     account: acc,
    //     title: 'Test Three',
    //     category: 'Phone call',
    //     date: new Date(),
    //     detail: "Called Brad to catch up and see how he's going",
    //     author: req.user
    // };

    // const noteThree = new Note(nThree);
    // noteThree.save();
    // clientOne.notes.push(noteThree);

    // const nFour = {
    //     account: acc,
    //     title: 'Test Four',
    //     category: 'Phone call',
    //     date: new Date(),
    //     detail: "Called Brad to catch up and see how he's going",
    //     author: req.user
    // };

    // const noteFour = new Note(nFour);
    // noteFour.save();
    // clientOne.notes.push(noteFour);

    // const jOne = {
    //     account: acc,
    //     title: 'Test Job 1',
    //     type: 'New Client',
    //     revenue: {
    //         upfront: 5000,
    //         ongoing: 3000
    //     },
    //     dates: {
    //         created: new Date()
    //     },
    //     status: 'In Progress',

    //     owners: [req.user],
    // };

    // const jobOne = new Job(jOne);
    // jobOne.save();
    // clientOne.jobs.push(jobOne);

    // const jTwo = {
    //     account: acc,
    //     title: 'Test Job 2',
    //     type: 'Review',
    //     revenue: {
    //         upfront: 2000,
    //         ongoing: 1000
    //     },
    //     dates: {
    //         created: new Date()
    //     },
    //     status: 'Finalising',

    //     owners: [req.user],
    // };

    // const jobTwo = new Job(jTwo);
    // jobTwo.save();
    // clientOne.jobs.push(jobTwo);

    // await clientOne.save(() => {
    //     console.log("New Client with related ", clientOne);

    // });
    
    res.render('users/dashboard'); 
  }

//Display user dashboard
module.exports.user_notes_get = async (req, res) => {
    try {
    
        const account = req.user.account;
        const notes  = await Note.find({account});
        res.render('users/notes',{notes, page: 'notes'});
       
    } catch(e) {
        console.log(e);
        req.flash('error', e.message);
        res.redirect('/');
    }
   
}



module.exports.user_logout = (req, res) => {
    req.logout();
    res.redirect('/login');
}