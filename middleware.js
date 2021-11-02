
const AppError = require('./utils/AppError');

const {clientSchema} = require('./joiSchemas.js');

module.exports.isLoggedIn = (req, res, next) => {
    
    if(!req.isAuthenticated()) {
        req.flash('error', 'Please login');
        return res.redirect('/login')
    }
    next();

}



module.exports.validateClient = (req, res, next) =>{

      const {error} = clientSchema.validate(req.body);
      if(error){
          const msg = error.details.map(el => el.message).join(',')
          throw new AppError(msg,400)
      } else {
          next()
      }
}


