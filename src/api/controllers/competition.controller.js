const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omit } = require('lodash');
const SportEvent = require('../models/sportevent.model');
const { handler: errorHandler } = require('../middlewares/error');
const bodyParser = require('body-parser');
const {Competition} = require('../models/competition.model');



exports.load = async (req, res, next, id) => {
  try {
    const competition = await Competition.get(id);
    req.locals = { competition };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

exports.get = (req, res) => res.json(req.locals.competition);


exports.list = async (req, res, next) => {
  try {

    let competitions = await Competition.find({
      sport_id: mongoose.Types.ObjectId(req.locals.sport._id)
    }).lean().exec();
    const transformed = competitions.map(async comp => {
      const obj = Object.assign({},comp);
      let weekEvents = await SportEvent.getWeekEvents(comp._id);

      obj['week_events'] = weekEvents;

      return obj;

    });

    const results = await Promise.all(transformed);

    res.json(results);
  } catch (error) {
    next(error)
  }
};
