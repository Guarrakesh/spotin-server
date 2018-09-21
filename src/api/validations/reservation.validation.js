const Joi = require('joi');

module.exports = {
  createReservation: {
    body: Joi.object({
      broadcast: Joi.string().required(),
    })
  }
};
