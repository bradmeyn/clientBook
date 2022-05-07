const Account = require('../models/account_model');
const User = require('../models/user_model');
const Client = require('../models/client_model');
const Note = require('../models/note_model');
const Job = require('../models/job_model');

//Display account registor form on GET
module.exports.account_register_get = (req, res) => {
  res.render('accounts/register');
};

//Handle user creation on POST
module.exports.account_register_post = async (req, res, next) => {
  try {
    let account = req.body.account;
    let user = req.body.user;
    let { password } = user;

    const newAccount = new Account(account);
    const newUser = new User(user);
    newAccount.users.push(newUser);
    newUser.account = newAccount;
    await newAccount.save();

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash('success', `Hello ${user.firstName}`);
      res.redirect('/dashboard');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
};

//Display account login form on GET
module.exports.account_login_get = (req, res) => {
  res.render('accounts/login');
};
