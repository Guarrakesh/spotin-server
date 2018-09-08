const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omit } = require('lodash');
const { handler: errorHandler } = require('../middlewares/error');
const bodyParser = require('body-parser');
const {Competitor} = require('../models/competitor.model');
const { Sport } = require('../models/sport.model');


exports.load = async (req, res, next, id) => {
  try {
    const competitor = await Competitor.findById(id);
    req.locals = { competitor };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

exports.get = (req, res) => res.json(req.locals.competitor);


exports.list = async (req, res, next) => {
  try {

    const { _end = 10, _start = 0, _sort = "_id", _order = 1} = req.query;
    const filterQuery = omit(req.query, ['_end', '_order', '_sort', '_start']);
    const competitors = await Competitor.paginate(filterQuery, {
      sort: { [_sort]: _order },
      offset: parseInt(_start),
      limit: parseInt(_end - _start)
    });


    res.json(competitors);
  } catch (error) {
    next(error)
  }
};

exports.create = async (req, res, next) => {
  try {
    const competitor = new Competitor(req.body);

    const savedComp = await competitor.save();
    res.status(httpStatus.CREATED);
    res.json(savedComp);

  } catch (error) {
    next(error);
  }
};

exports.update = (req, res, next) => {

  const updatedComp = Object.assign(req.locals.competitor, req.body);

  updatedComp.save()
    .then(savedComp => res.json(savedComp))
    .catch(e => next(e));

};

exports.remove = (req,res, next) => {
  const { competitor } = req.locals;

  competitor.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
}
