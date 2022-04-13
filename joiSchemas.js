const Joi = require('joi');

module.exports.clientSchema = Joi.object({
client: Joi.object({
  title: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  preferredName: Joi.string(),
  dob: Joi.string(),
  job: Joi.string(),
  company: Joi.string(),
  phone: Joi.string().max(10),
  email: Joi.string().email(),
  address: Joi.object({
      street: Joi.string(),
      suburb: Joi.string(),
      state: Joi.string(),
      postcode: Joi.string().max(4),
  })

    }).required()
  });