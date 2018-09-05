const httpStatus = require('http-status');
const { omit, at} = require('lodash');
const {SportEvent} = require('../models/sportevent.model');
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
    const event = await SportEvent.findById(id);
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
    let query = omit(req.query, ['competition_id', 'sport', '_end', '_start', '_order', '_sort']);
    const {_end = 10, _start = 0, _order = 1, _sort = "start_at" } = req.query;
    const { locals } = req;

    //Accetto sia /sports/:id/events che /competitions/:id/events che /events
    if (locals && locals.competition) {
      query['competition'] = req.locals.competition._id;
    } else if (locals && locals.sport) {
      query.sport = req.locals.sport._id;
    } else if (req.query.competition_id) {
      console.log(req.query.competition_id);
      query['competition'] = req.query.competition_id;
    }
    if (req.query.id_like) {
      query._id = { $in: req.query.id_like.split('|')};
      delete query['id_like'];
    }
    const limit = parseInt(_end - _start);
    let events = await SportEvent.paginate(query, {
      sort: _sort,
      offset: parseInt(_start),
      limit: limit,
      populate: ['sport', 'competition','competitors._id'],
    });

    events.docs = events.docs.map(event => {
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
