
const User = require('../models/user');



//Display user registor form on GET
module.exports.user_register_get = (req, res) => {
    res.render('users/register')
}

//Handle user creation on POST
module.exports.user_register_post = (req, res) => {
   
}