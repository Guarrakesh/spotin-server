const httpStatus = require('http-status');
const { omit } = require('lodash');
const SportEvent = require('../../models/sportevent.model.js');
const { handler: errorHandler } = require('../../middlewares/error');
const bodyParser = require('body-parser');
const {Sport} = require('../../models/sport.model.js');



exports.load = async (req, res, next, id) => {

  try {
    const sport = await Sport.get(id);

    req.locals = { sport };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

exports.get = (req, res) => res.json(req.locals.sport.transform());


exports.list = async (req, res, next) => {

  try {

    const sports = await Sport.find();
    res.set("X-Total-Count", sports.length);
    res.json(sports.map(s => s.transform()));

  } catch (error) {
    next(error)
  }
};

exports.update = async (req, res, next) => {
  const updatedSport = req.body;
  const sport = Object.assign(req.locals.sport, updatedSport);

  sport.save()
    .then(savedSport => res.json(savedSport.transform()))
    .catch(e => (next(e)));

};

exports.create = async (req, res, next) => {
  try {
    const sport = new Sport(req.body);
    const savedSport = await sport.save();
    res.status(httpStatus.CREATED);
    res.json(savedSport.transform());
  } catch (error) {
    next(error);
  }
};


exports.remove = async (req, res, next) => {
  const { sport } = req.locals;

  sport.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
