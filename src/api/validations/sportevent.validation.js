const Joi = require('joi');
const { Event } = require('../models/sportevent.model');


module.exports = {
  // POST /v1/events
  createEvent: {
    body: {
      name: Joi.string().min(6).max(128).required(),
      sport: Joi.string().required(),
      competition: Joi.string(),
      description: Joi.string().min(8).max(255),
      competitors: Joi.array().items(Joi.object({competitor: Joi.string().required()})),
      providers: Joi.array().items(Joi.string()),
      start_at: Joi.date().iso().required(),

      spots: Joi.number()
    }
  },
  // PUT /v1/Events/:EventId
  replaceEvent: {
    body: {
      name: Joi.string().min(6).max(128).required(),
      sport: Joi.string().required(),
      competition: Joi.string(),
      description: Joi.string().min(8).max(255),
      competitors: Joi.array().items(Joi.object({competitor: Joi.string().required()})),
      start_at: Joi.date().iso().required(),

      spots: Joi.number()
    },
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
  // PATCH /v1/Events/:EventId
  updateEvent: {
    body: {
      sport:Joi.string(),
      name: Joi.string().min(6).max(128),
      competition: Joi.string(),
      description: Joi.string().min(8).max(255),
      competitors: Joi.array().items(Joi.object({competitor: Joi.string().required()})),
      start_at: Joi.date().iso(),
      providers: Joi.array().items(Joi.string()),

      spots: Joi.number()
    },
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  }

};
