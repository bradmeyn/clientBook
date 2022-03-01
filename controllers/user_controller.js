const Account = require('../models/account_model');
const User = require('../models/user_model');
const Client = require('../models/client_model');
const Note = require('../models/note_model');


//Display user login form on GET
module.exports.user_login_get = (req, res) => {
    console.log("/login");
    res.render('users/login')
}

//Handle user login on POST
module.exports.user_login_post = async (req, res) => {
    req.flash('success', 'Welcome back ' + req.user.firstName);
    res.redirect('/dashboard')
    }

//Display user dashboard
module.exports.user_dashboard_get = async (req, res) => {
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