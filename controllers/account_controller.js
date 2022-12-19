const Account = require('../models/account_model');
const User = require('../models/user_model');
const populateDb = require('../utils/populateDb');
const bcrypt = require('bcrypt');

//Display account registration form on GET
module.exports.account_register_get = async (req, res) => {
  res.render('accounts/register');
};

//Handle user creation on POST
module.exports.account_register_post = async (req, res, next) => {
  try {
    let errors = [];
    const { account, user } = req.body;

    //check for empty fields missed on client side
    if (emptyField(account) || emptyField(user)) {
      console.log('empty field');
      errors.push({ msg: 'Please enter all fields' });
    }

    //check if username exists
    const existingUser = await User.exists({ username: user.username });
    if (existingUser) {
      console.log(existingUser);
      errors.push({ msg: 'Username already exists' });
    }

    if (errors.length > 0) {
      console.log('invalid registration details');
      res.render('accounts/register', { errors, account, user });
    } else {
      //initial registration checks
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;

      //create new account
      const newAccount = new Account(account);
      const newUser = new User(user);

      //create new user and add user to account
      newAccount.users.push(newUser);
      await newAccount.save();

      newUser.account = newAccount;
      newUser.save();

      //populate demo account with clients
      if (newAccount.name === 'Demo') {
        await populateDb(newAccount, newUser);
      }
      req.login(newUser, () => {
        res.redirect('/dashboard');
      });
    }
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
};

const emptyField = (obj) => {
  return Object.values(obj).some(
    (property) => property === null || property === ''
  );
};
