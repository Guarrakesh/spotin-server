const Joi = require('joi');

module.exports = {
  create: {
    body: {
      broadcastId:  Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),

      rating: Joi.object({
        av: Joi.number().min(1).max(5).required(),
        food: Joi.number().min(1).max(5).required(),
        price: Joi.number().min(1).max(5).required(),
        people: Joi.number().min(1).max(5).required(),
        sub: Joi.number().min(1).max(5).required(),
      }),
      comment: Joi.string().max(145),
    }
  },

  
};