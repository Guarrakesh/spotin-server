const Joi = require('joi');
const { Event } = require('../models/sportevent.model');


module.exports = {
  // POST /v1/events
  createEvent: {
    body: {
      name: Joi.string().min(6).max(128).required(),
      sport_id: Joi.string().required(),
      competition: Joi.object({
        name: Joi.string().required(), _id: Joi.string().required(), competitorsHaveLogo: Joi.boolean(),
        image_versions: Joi.array()
      }).required(),
      description: Joi.string().min(8).max(255),
      competitors: Joi.array().items(Joi.object({
        _id: Joi.string().required(), name: Joi.string().required(), image_versions: Joi.array()
      })).required(),
      start_at: Joi.date().iso().required(),


    }
  },
  // PUT /v1/Events/:EventId
  replaceEvent: {
    body: {
      name: Joi.string().min(6).max(128).required(),
      sport_id: Joi.string().required(),
      competition: Joi.object({
        name: Joi.string(), _id: Joi.string(), competitorsHaveLogo: Joi.boolean(),
        image_versions: Joi.array()
      }).required(),
      description: Joi.string().min(8).max(255),
      competitors: Joi.array().items(Joi.object({
        _id: Joi.string().required(), name: Joi.string().required(), image_versions: Joi.array()
      })).required(),
      start_at: Joi.date().iso().required(),
    },
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
  // PATCH /v1/Events/:EventId
  updateEvent: {
    body: {
      name: Joi.string().min(6).max(128),
      sport_id:Joi.string(),
      competition: Joi.object({
        name: Joi.string(), _id: Joi.string(), competitorsHaveLogo: Joi.boolean(),
        image_versions: Joi.array()
      }),
      description: Joi.string().min(8).max(255),
      competitors: Joi.array().items(Joi.object({
        _id: Joi.string().required(), name: Joi.string().required(), image_versions: Joi.array()
      })),
      start_at: Joi.date().iso()
    },
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  }

};
