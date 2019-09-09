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
    businessTypes: Joi.array().items(Joi.string()).required(),
    email: Joi.string().email(),
    phone: Joi.string().regex(/^(([+]|00)39)?((3[1-6][0-9]))(\d{6,7})$/g),
  }
};

const router = express.Router();

router
    .route('/')

    .post(validate(requestBroadcast), controller.create);


module.exports = router;
