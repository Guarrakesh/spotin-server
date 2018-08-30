const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omit } = require('lodash');
const {SportEvent} = require('../models/sportevent.model');
const { handler: errorHandler } = require('../middlewares/error');
const bodyParser = require('body-parser');
const {Competition} = require('../models/competition.model');
const { Sport } = require('../models/sport.model');


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


    const filterQuery = omit(req.query, ['_end', '_order', '_sort', '_start']);

    if (req.locals && req.locals.sport)
      filterQuery.sport = req.locals.sport._id;

    if (req.query.id_like) {
      filterQuery._id = { $in: req.query.id_like.split('|')};
      delete filterQuery['id_like'];
    }

    let competitions = Competition.find(filterQuery);

    //handle sort
    if (req.query._sort) competitions.sort({[req.query._sort]: req.query._order.toLowerCase()});

    //handle GET_MANY, dove il campo {field}_like contiene valori multipli separati da |

    competitions = await competitions.lean().exec();
    const transformed = competitions.map(async comp => {
      const obj = Object.assign({},comp);
      let weekEvents = await SportEvent.getWeekEvents(comp._id);

      obj['week_events'] = weekEvents;

      return obj;

    });

    const results = await Promise.all(transformed);
    res.set("X-Total-Count", results.length);
    res.json(results);
  } catch (error) {
    next(error)
  }
};

exports.create = async (req, res, next) => {
  try {
    const competition = new Competition(req.body);

    const savedComp = await competition.save();
    res.status(httpStatus.CREATED);
    res.json(savedComp);

  } catch (error) {
    next(error);
  }
};

exports.update = (req, res, next) => {

    const updatedComp = Object.assign(req.locals.competition, req.body);

    updatedComp.save()
      .then(savedComp => res.json(savedComp))
      .catch(e => next(e));

};

exports.remove = (req,res, next) => {
  const { competition } = req.locals;

  competition.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
}
