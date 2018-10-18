Joi = require('joi');

module.exports = {
  createContactRequest: {
    body: {
      email: Joi.string().email().max(128).required(),
      name: Joi.string().max(128).required(),
      message: Joi.string().max(400).required()
    }
  }
}
