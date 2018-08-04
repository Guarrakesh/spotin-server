const httpStatus = require('http-status');
const { omit } = require('lodash');
const SportEvent = require('../models/sportevent.model');
const { handler: errorHandler } = require('../middlewares/error');
const bodyParser = require('body-parser');
const {Sport} = require('../models/sport.model');



exports.load = async (req, res, next, id) => {

  try {
    const sport = await Sport.get(id);

    req.locals = { sport };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

exports.get = (req, res) => res.json(req.locals.sport);


exports.list = async (req, res, next) => {

  try {

    const sports = await Sport.find({active: true});
    res.json(sports);

  } catch (error) {
    next(error)
  }
};

exports.update = async (req, res, next) => {

};

exports.create = async (req, res, next) => {
  try {
    const sport = new Sport(req.body);
    const savedSport = await sport.save();
    res.status(httpStatus.CREATED);
    res.json(savedSport);
  } catch (error) {
    next(error);
  }
};

exports.replace = async (req, res, next) => {

};

exports.remove = async (req, res, next) => {

};
