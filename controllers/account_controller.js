
const Account = require('../models/account_model');
const User = require('../models/user_model');
const Client = require('../models/client_model');


//Display account registor form on GET
module.exports.account_register_get = (req, res) => {
    res.render('accounts/register')
}

//Handle user creation on POST
module.exports.account_register_post = async (req, res, next) => {
    try {
        let account = req.body.account;
        let user = req.body.user;
        let {password} = user;

        const newAccount = new Account(account);
        const newUser = new User(user);
        newAccount.users.push(newUser);
        newUser.account = newAccount;
        await newAccount.save();
        console.log(newAccount);
        const registeredUser = await User.register(newUser, password);
        
        //test client 
        const clientOne = new Client({
            clientId: 'ClientOne',
            salutation: 'Mr',
            account: newAccount._id,
            firstName: 'test',
            lastName: 'client',
            dob: {
                birthDay: '10',
                birthMonth: '07',
                birthYear: '1990',
                fullDate: '10/07/1990'
            },
            phone: '0413235647',
            email: 'bradjmeyn@gmail.com',
            address: {
                street: '205 Kings Road',
                suburb: 'New Lambton',
                state: 'NSW',
                postcode: '2305',
            }
        });
        await clientOne.save(() => console.log('client saved', clientOne));

    req.login(registeredUser, err => {
        if(err) return next(err);

       
        
        req.flash('success', `Hello ${user.firstName}`);
        res.redirect('/clients');
    })

    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}


//Display account login form on GET
module.exports.account_login_get = (req, res) => {
    res.render('accounts/login')
}

//Handle user login on POST
module.exports.account_login_post = async (req, res) => {
req.flash('success', 'Welcome back');
res.redirect('/clients')
}

module.exports.account_logout = (req, res) => {
    req.logout();
    res.redirect('/login');
}