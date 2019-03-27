const Joi = require('joi');

module.exports = {
  create: {
    body: {
      broadcastId:  Joi.string().regex(/^[a-fA-F0-9]{24}$/),
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      reservationId:  Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      rating: Joi.object({
        av: Joi.number().min(1).max(5).required(),
        food: Joi.number().min(1).max(5).required(),
        price: Joi.number().min(1).max(5).required(),
        people: Joi.number().min(1).max(5).required(),
        sub: Joi.number().min(1).max(5).required(),
      }).required(),
      comment: Joi.string().max(145),
    }
  },

  update: {
    body: {
      status: Joi.number().allow([0,1,-1])
    },
    params: {
      reviewId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),

}
  }

  
};
