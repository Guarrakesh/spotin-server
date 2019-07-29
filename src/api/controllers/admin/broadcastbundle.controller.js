const httpStatus = require('http-status');
const moment = require('moment');

const { omit } = require('lodash');
const { handler: errorHandler } = require('../../middlewares/error');
const { Business } = require('../../models/business.model');
const { Broadcast } = require('../../models/broadcast.model');
const offerSchema = require('../../models/offer.schema');
const { BroadcastBundle } = require('../../models/broadcastbundle.model');
const EventsAppealEvaluator = require('../../models/appeal/StandardEventsAppealEvaluator');
const ApiError = require('../../utils/APIError');

exports.load = async(req, res, next, id) => {
  try {
    const bundle = await BroadcastBundle.findById(id);
    req.locals = { bundle };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }

};

exports.list = async (req, res, next) => {
  try {

    const filterQuery = omit(req.query, ['_end', '_sort', '_order', '_start']);
    const {_end = 10, _start = 0, _order = -1, _sort = "_id" } = req.query;

    broadcasts = await BroadcastBundle.paginate(filterQuery, {
      sort: {[_sort]: _order},
      offset: parseInt(_start),
      limit: parseInt(_end - _start),

    });
    res.json(broadcasts);
  } catch (error) {
    next(error);
  }
};

exports.get = (req, res, next) => {
  try {
    const { bundle } = req.locals;
    res.json(bundle);
  } catch (e) {
    next(e);
  }


};


exports.create = async (req, res, next) => {
  try {
    const business =  await Business.findById(req.body.business);

    const startDate = moment(req.body.start).startOf('day').toISOString();
    const endDate = moment(req.body.end).endOf('day').toISOString();

    const events = await business.getBroadcastableEvents(startDate, endDate);
    if (!events || events.length === 0) {
      return next(new ApiError({ message: 'Non ci sono eventi per questa settimana', status: 422, isPublic: true }));
    }
    const evaluator = new EventsAppealEvaluator(events);
    const evaluatedEventsMap = evaluator.evaluate();
    const sortedEvents = events
        .sort((a, b) => evaluatedEventsMap.get(b.id) - evaluatedEventsMap.get(a.id));
    const bundle = await BroadcastBundle.buildBundle(business, sortedEvents);

    await bundle.save();
    res.json(bundle);
  } catch (e) {
    e.stackTraceLimit = 9999;
    console.log(e.stack, e.message);

    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { bundle } = req.locals;
    const updatedBundle = Object.assign(bundle, req.body);


    if (updatedBundle.isModified('published')) {
      req.locals.bundle = updatedBundle;
      return await publish(req, res, next);
    } else {

      updatedBundle.save()
          .then(savedBus => res.json(savedBus))
          .catch(e => next(e));

    }


  } catch (e) {
    next(e);
  }
}
const publish = async (req, res, next) => {
  try {
    const { bundle } = req.locals;
    const business = await Business.findById(bundle.business.id);
    // Controllo se il locale puo' acquistare il bundle
    if (!business.canBroadcastBundle(bundle)) {
      return next(new ApiError({ message: 'Non puoi acquistare questo bundle. Controlla i tuoi spot.', status: 422, isPublic: true }));
    }
    await bundle.publish();
    res.status = httpStatus.CREATED;
    res.json(bundle);
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {

    const { bundle } = req.locals;

    bundle.remove()
        .then(() => res.status(200).end())
        .catch(e => next(e))
  } catch (e) {
    next(e);
  }
};
