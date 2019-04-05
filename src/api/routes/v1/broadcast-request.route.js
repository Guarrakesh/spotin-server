const express = require('express');
const controller = require('../../controllers/v1/broadcast-request.controller');
const validate = require('express-validation');
const Joi = require('joi');

const requestBroadcast = {
  body: {
    event: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    maxDistance: Joi.number().required(),
    numOfPeople: Joi.number().required(),
    userPosition: Joi.object({latitude: Joi.number(), longitude: Joi.number()}),
    location: Joi.string().required().max(128),
    note: Joi.string().allow('').max(250),
    email: Joi.string().email().required(),
  }
};

const router = express.Router();

router
    .route('/')

    .post(validate(requestBroadcast), controller.create);


module.exports = router;
