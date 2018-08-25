const httpStatus = require('http-status');
const { omit, at} = require('lodash');
const SportEvent = require('../models/sportevent.model');
const { handler: errorHandler } = require('../middlewares/error');
const bodyParser = require('body-parser');
const Sport = require('../models/sport.model');
const { Competitor } = require('../models/competitor.model');
/**
 * Load sport and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const event = await SportEvent.get(id);
    req.locals = { event };

    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get SportEvent
 * @public
 */
exports.get = (req, res) => res.json(req.locals.event);



/**
 * Create new SportEvent
 * @public
 */
exports.create = async (req, res, next) => {
  try {

    const sportEvent = new SportEvent(req.body);


    const savedSportEvent = await sportEvent.save();
    res.status(httpStatus.CREATED);
    res.json(savedSportEvent);
  } catch (error) {

    next(error);
  }
};


/**
 * Update existing SportEvent
 * @public
 */
exports.update = (req, res, next) => {

  const event = Object.assign(req.locals.event, req.body);

  event.save()
    .then(savedEvent => res.json(savedEvent))
    .catch(e => next(e));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {

  try {
    let query = req.query;

    //Accetto sia /sports/:id/events che /competitions/:id/events
    if (req.locals.competition) {
      query['competition._id'] = req.locals.competition._id;
    } else {
      query.sport = req.locals.sport._id;
    }
    let events = await SportEvent.find(req.query)
      .populate([
        {
          path: 'sport_id',
          select: ['_id','name']
        },

      ]);

    events = events.map(event => {
      return event.transform(req);
    });

    res.json(events);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { event } = req.locals;

  event.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
