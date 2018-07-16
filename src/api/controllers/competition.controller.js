const httpStatus = require('http-status');
const { omit } = require('lodash');
const SportEvent = require('../models/sportevent.model');
const { handler: errorHandler } = require('../middlewares/error');
const bodyParser = require('body-parser');
const {Competition} = require('../models/competition.model');
const mongoose = require('mongoose');


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

    let competitions = await Competition.find({sport_id: mongoose.Types.ObjectId(req.locals.sport._id)}).lean();

    competitions =  competitions.map(async comp => {
      let weekEvents = await SportEvent.getWeekEvents(comp._id);
      comp.weekEvents = weekEvents;

      return comp;

    });

    Promise.all(competitions).then((result) => res.json(result));
  } catch (error) {
    next(error)
  }
};
