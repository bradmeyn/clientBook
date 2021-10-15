
const Account = require('../models/account_model');
const User = require('../models/user_model');
const { v4: uuidv4 } = require('uuid');


//Display account registor form on GET
module.exports.account_register_get = (req, res) => {
    res.render('accounts/register')
}

//Handle user creation on POST
module.exports.account_register_post = async (req, res) => {
    
    let account = req.body.account;

    let user = req.body.user;
    let {password} = user;
    account.accountId = uuidv4();
    user.userId = uuidv4();

    const newAccount = new Account(account);
    const newUser = new User(user);
    const registeredUser = await User.register(newUser, password);
    newAccount.users.push(newUser);
    console.log(newAccount);
    await newAccount.save()
    .then(() => res.redirect(`/`));
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