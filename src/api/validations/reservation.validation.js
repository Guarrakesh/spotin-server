const Joi = require('joi');

module.exports = {
  createReservation: {
    body: Joi.object({
      broadcast: Joi.string().required(),
      userId: Joi.string().required(),
    })
  },

  listReservations: {
    params: {
      broadcastId: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/),
    },
  }
};
