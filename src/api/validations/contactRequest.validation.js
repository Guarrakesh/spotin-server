Joi = require('joi');

module.exports = {
  createContactRequest: {
    body: {
      email: Joi.string().email().max(128).required(),
      name: Joi.string().min(2).max(128).required(),
      message: Joi.string().min(3).max(400).required()
    }
  }
}
