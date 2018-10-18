const httpStatus = require('http-status');
const { omit } = require('lodash');
const User = require('../../models/user.model.js');
const { handler: errorHandler } = require('../../middlewares/error');

const { Broadcast } = require('../../models/broadcast.model');
const { SportEvent } = require('../../models/sportevent.model');
const { Request, TYPE_BROADCAST_REQUEST } = require('../../models/request.model');

const mongoose = require('mongoose');


/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get user
 * @public
 */
exports.get = (req, res) => res.json(req.locals.user.transform());

/**
 * Get logged in user info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.user.transform());

/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(httpStatus.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing user
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const newUser = new User(req.body);
    const ommitRole = user.role !== 'admin' ? 'role' : '';
    const newUserObject = omit(newUser.toObject(), '_id', ommitRole);

    await user.update(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);

    res.json(savedUser.transform());
  } catch (error) {
    next(User.checkDuplicateEmail(error));
  }
};

/**
 * Update existing user
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
  const updatedUser = omit(req.body, ommitRole);
  const user = Object.assign(req.locals.user, updatedUser);

  user.save()
    .then(savedUser => res.json(savedUser.transform()))
    .catch(e => next(User.checkDuplicateEmail(e)));
};

/**
 * Get user list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const users = await User.list(req.query);
    const transformedUsers = users.docs.map(user => user.transform());
    users.docs = transformedUsers;
    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user
 * @public
 */
exports.remove = (req, res, next) => {
  const { user } = req.locals;

  user.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};

/* Reservations */
exports.listReservations = async (req, res, next) => {
  try {
    const { loggedUser } = req.locals;
    const { _end = 10, _start = 0, _order = 1, _sort = "_id", id_like } = req.query;
    let reservations = {docs: []};

    const broadcastsWithReservation = await Broadcast.find({_id: { $in: loggedUser.reservations }, 'reservations.user': loggedUser._id})
      .limit(parseInt(_end - _start))
      .skip(parseInt(_start))
      .lean();
    if (broadcastsWithReservation) {
      reservations.docs = broadcastsWithReservation.map (broadcast => {
        const reservationObj = broadcast.reservations.find(res => res.user.toString() === loggedUser._id.toString());
        return { ...reservationObj, broadcast: omit(broadcast, "reservations")}
      });
    }

    //TODO: Gestire il sort generico secondo il campo _sorrt
    reservations.docs = reservations.docs.sort((a, b) => _order * (new Date(a.created_at)) - (new Date(b.created_at)) );
    reservations.offset = _start;
    reservations.total = loggedUser.reservations.length || 0;
    //  const reservationDoc = broadcastWithReservation.reservations.find(el => el._id.toString() === userReservationIds[i].toString());

    res.json(reservations);

  } catch (error) {
    next(error);
  }
};

exports.reserveBroadcast = (req, res, next) => {

};

exports.removeReservation = (req, res, next) => {

};

/* Events */

exports.addFavoriteEvent = async (req, res, next) => {

  try {
    const { loggedUser } = req.locals;


    let event = await SportEvent.findById(req.body.event).populate('competitors.competitor').populate('competition');

    if (!event) {
      res.status(httpStatus.NOT_FOUND);
      res.end();
    }
    loggedUser.favorite_events.push( new mongoose.mongo.ObjectId(req.body.event));
    await loggedUser.save();


    event = event.transform(req);
    res.json(event);


  } catch (error) {
    next(error);
  }
};

exports.listFavoriteEvents =  async (req, res, next) => {
  try {
    const {loggedUser} = req.locals;

    const {_end = 10, _sort = "start_at", _start = 0, _order = -1} = req.query;
    if (loggedUser.favorite_events.length === 0)
      return res.json({docs: [], total: 0, offset: 0});

    const limit = parseInt(_end - _start);
    let events = await SportEvent.paginate(
      {_id: {$in: loggedUser.favorite_events}}, {
        sort: {[_sort]: _order},
        offset: parseInt(_start),
        limit: limit,
        populate: ['competition']
      });

    events.docs = events.docs.map(event => {
      return event.transform(req);
    });

    res.json(events);
  } catch (error) {
    next(error);
  }
};

exports.removeFavoriteEvent = async (req, res, next) => {

  const event = await SportEvent.findById(req.params.eventId);

  const { loggedUser } = req.locals;
  if (!event) {
    res.status(httpStatus.NOT_FOUND);
    res.end();
  }
  if (!!loggedUser.favorite_events.find(e => e.toString() === event._id.toString())) {
    loggedUser.favorite_events = loggedUser.favorite_events.filter(e => e.toString() !== event._id.toString());

    await loggedUser.save();
    res.status(httpStatus.OK);
    res.end();
  } else {
    res.status(httpStatus.BAD_REQUEST);
    res.end();
  }


};


exports.requestBroadcast = async (req, res, next) => {
  try {
    const event = await SportEvent.findById(req.body.event);

    const {loggedUser} = req.locals;
    if (!event) {
      res.status(httpStatus.NOT_FOUND);
      res.json({status: httpStatus.NOT_FOUND, message: "Questo evento non esiste."})
    }

    const request = new Request();
    request.requestType = TYPE_BROADCAST_REQUEST;
    const { userPosition: position } = req.body;
    const userPosition = {
      type: "Point",
      coordinates: [position.longitude,position.latitude]
    };

    request.broadcastRequest = {
      ...omit(req.body, 'userPosition'),
      user: loggedUser._id,
      userPosition
    };

    await request.save();

    res.status(httpStatus.NO_CONTENT);
    res.json();

  } catch (e) {
    next(e);
  }

};

exports.listBroadcastRequests = async (req, res, next) => {
  try {

    const { loggedUser } = req.locals;

    const requests = await Request.find({user: mongoose.Schema.ObjectId(loggedUser._id)}).exec();

    res.json(requests);

  } catch (e) {
    next(e);
  }
};
