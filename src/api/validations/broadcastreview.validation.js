const Joi = require('joi');

module.exports = {
  create: {
    body: {
      broadcastId:  Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      eventId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      businessId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      answers: Joi.array().items(Joi.object({
        questionId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
        answerId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
      })).min(1).required(),
      personalRating: Joi.number().min(1).max(5).required(),
      personalNotes: Joi.string().max(145)
    }
  },

  
};