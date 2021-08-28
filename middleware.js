
const AppError = require('./utils/AppError');

const {clientSchema} = require('./joiSchemas.js');





module.exports.validateClient = (req, res, next) =>{

      const {error} = clientSchema.validate(req.body);
      if(error){
          const msg = error.details.map(el => el.message).join(',')
          throw new AppError(msg,400)
      } else {
          next()
      }
}
