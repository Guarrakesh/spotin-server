const Joi = require('joi');
const { Sport } = require('../models/sport.model');


module.exports = {
  // POST /v1/competitions
  createCompetition: {
    body: {
      name: Joi.string().min(3).max(128).required(),
      country: Joi.string().max(128),
      sport: Joi.string().required(),
    }
  },

  // PATCH /v1/competition/:id
  updateCompetition: {
    body: {

      name: Joi.string().min(3).max(128),
      country: Joi.string().max(128),
      sport: Joi.string(),
    },
    params: {
      id: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  }

};
