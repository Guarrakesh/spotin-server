const httpStatus = require('http-status');
const { omit, at } = require('lodash');
const { SportEvent } = require('../../models/sportevent.model.js');
const { handler: errorHandler } = require('../../middlewares/error');


const moment = require('moment');

const sanitizeQueryParams = ({
  competition_id,
  _end,
  _start,
  _order,
  _sort,
  id_like,
  extend,
  next_events,
  ...rest
}) => rest;


/**
 * Load sport and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    let query = SportEvent.findById(id);
    if (req._extend) {
      const populates = req._extends.split(',');
      [].concat(populates).forEach(p => {
        query.populate(p);
      });
    }
    const event = await query.exec();

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
exports.get = (req, res) => res.json(req.locals.event.transform());
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
    let filter = sanitizeQueryParams(req.query);

    const { 
      _end = 10,
      _start = 0,
      _order = 1,
      _sort = 'start_at',
    } = req.query;

    if (req.query.q || req.query.name) {
      filter.name = { $regex: req.query.q || req.query.name, $options: 'i' };
      delete filter.q;
    }
    if (req.query.id_like) {
      filter._id = { $in: decodeURIComponent(req.query.id_like).split('|') };
    }
    if (req.query.start_at && !req.query.next_events) {
      const date = moment(req.query.start_at).startOf('day');

      filter.start_at = { $gte: date, $lte: moment(date).endOf('day')}
    } else if (req.query.next_events) {
      // Prendo eventi nell'arco temporale da oggi (o data inserita) in poi   
      const date = req.query.start_at ? moment(req.query.start_at) : moment();
      filter.start_at = { $gte: date.startOf('day') }
    }

    // Accetta il parametro Extend, per popolare i subdocument
    const populates = req.query.extend ? req.query.extend.split(',') : [];


    const limit = parseInt(_end - _start, 10);

    const events = await SportEvent.paginate(filter, {
      sort: _sort,
      offset: parseInt(_start, 10),
      limit,
      populate: populates || null,
    });


    events.docs = events.docs.map(event => event.transform(req));
  
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
