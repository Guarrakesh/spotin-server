const httpStatus = require('http-status');
const { omit, omitBy} = require('lodash');
const {SportEvent} = require('../../models/sportevent.model.js');
const { handler: errorHandler } = require('../../middlewares/error');
const bodyParser = require('body-parser');
const Sport = require('../../models/sport.model.js');
const { Competitor } = require('../../models/competitor.model.js');
const moment = require('moment');


const sanitizeQueryParams = ({
  competition_id,
  sport_id,
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
    let query = SportEvent.findById(id).populate('competitors.competitor');
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
exports.get = (req, res) => res.json(req.locals.event.transform(req.locals ? req.locals.loggedUser : undefined));



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
    const { loggedUser } = req.locals || {};
    let filter= sanitizeQueryParams(req.query);
    const {_end = 10, _start = 0, _order = 1, _sort = "start_at" } = req.query;
    const { locals } = req;

    if (req.query.q || req.query.name) {
      filter['name'] = { "$regex": req.query.q || req.query.name, "$options": "i"};
    }
    if (req.query.id_like) {
      filter._id = { $in: decodeURIComponent(req.query.id_like).split('|')};
    }
    if (req.query.start_at) {
      const date = moment(req.query.start_at).startOf('day');

      filter.start_at = { "$gte": date, "$lte": moment(date).endOf('day')}
    }
    if (!req.query.include_past_events)  {
      // Di default il server restituisce eventi tra la data attuale e due settimane dopo
      // A meno ché non venga specificato, nella query "include_past_events"
      // In quel caso vengono ricercati utenti in tutti i tempiya tutti i luoghi e tutti i laghi
     filter.start_at = { "$gte": moment().startOf('day'),
        "$lte": moment().add(2, 'week').endOf('day')}
    }



    //Accetta il parametro Extend, per popolare i subdocument
    const populates = req.query.extend ? req.query.extend.split(',') : [];
    populates.push('competitors.competitor');
    populates.push('competition');
    populates.push('sport');


    const limit = parseInt(_end - _start);

    let events = await SportEvent.paginate(filter, {
      sort: {[_sort] : _order},
      offset: parseInt(_start),
      limit: limit,
      populate: populates || null
    });



    events.docs = events.docs.map(event => {

      return event.transform(loggedUser);
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


exports.fillAppealValue = async (req, res, next) => {
  try {
    const sportEvents = await SportEvent.aggregate([
      {
        $lookup: {
          from: 'competitions',
          localField: "competition",
          as: 'competition',
          foreignField: "_id"
        }
      },
      {$unwind: "$competition"},

      {
        $lookup: {
          from: 'sports',
          localField: 'sport',
          as: 'sport',
          foreignField: '_id'
        }
      },
      { $unwind: "$sport"}
    ]);
    await sportEvents.forEach(async sportEvent => {
      let appealValue = sportEvent.competition.appealValue + sportEvent.sport.appealValue;
      if (sportEvent.competitors.length > 0) {
        sportEvent.competitors.forEach(async comp => {
          const competitor = await Competitor.findById(comp.competitor);
          appealValue += competitor.appealValue;
        });
      } else {
        appealValue = appealValue * 3;
      }

      await SportEvent.updateOne({_id: sportEvent._id}, {$set: {appealValue: appealValue || 1}});
    });

    res.json({message: "done"});
    res.statusCode(200);
  } catch (e) {
    next(e);
  }
};