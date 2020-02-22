const httpStatus = require('http-status');
const { omit } = require('lodash');
const User = require('../../models/user.model.js');
const { handler: errorHandler } = require('../../middlewares/error');
const ApiError = require('../../utils/APIError')
const { Broadcast } = require('../../models/broadcast.model');
const { SportEvent } = require('../../models/sportevent.model');
const { Request, TYPE_BROADCAST_REQUEST } = require('../../models/request.model');
const amazon = require("../../utils/amazon");
const mongoose = require('mongoose');
const moment = require('moment');
const eventEmitter = require('../../emitters');
const { ReservationStatus } = require('../../models/reservation.model.new');

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
    return next(errorHandler(error, req, res));
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

    const container = req.app.get('container');
    const reservationService = container.get('reservationService');
    const broadcastService = container.get('broadcastService');

    let reservations = await reservationService.paginate({
      userId: loggedUser.id,
      status: ReservationStatus.CHECKED_IN,
    }, {
      sort: { field: _sort, _order },
      offset: parseInt(_start),
      limit: parseInt(_end - _start),
    });


    const broadcastIds = reservations.docs.map(checkIn => checkIn.broadcastId);
    const broadcasts = await broadcastService.find({ _id: { $in: broadcastIds }});
    reservations.docs = reservations.docs.map(checkIn => {
      return Object.assign({}, checkIn.toObject(), { broadcast: broadcasts.find(b => b._id.equals(checkIn.broadcastId)) });
    });
    //let reservations = {docs: []};
    res.json(reservations);

  } catch (error) {
    next(error);
  }
};
exports.getReservation = async (req, res, next) => {
  try {
    const { loggedUser } = req.locals;
    const reservationId = loggedUser.reservations.find(e => e == req.params.reservationId);
    if (!reservationId) {
      throw new ApiError({message: "Reservation not found.", status: 404});
    }
    const reservation = await Broadcast.findOne({'reservations._id': mongoose.Types.ObjectId(reservationId)}, {"reservations.$": 1});
    const response = omit(reservation, 'reservations');
    res.json(response);
  } catch (error) {
    next(error);
  }
};


exports.reserveBroadcast = async (req, res, next) => {
  try {

    const container = req.app.get('container');
    const reservationService = container.get('reservationService');

    const { loggedUser: user } = req.locals;
    const { broadcast: broadcastId, peopleNum, cheerFor } = req.body;

    const reservation = await reservationService.checkIn(user, broadcastId, { peopleNum, cheerFor });


    res.status = httpStatus.CREATED;
    res.json(reservation);

  } catch (e) {
    next(e);
  }
};

exports.removeReservation = async (req, res, next) => {
  try {
    const { loggedUser } = req.locals;

    const { reservationId } = req.params;
    const broadcast = await Broadcast.findOne({'reservations._id': mongoose.Types.ObjectId(reservationId)});


    if (!broadcast) {
      res.status(httpStatus.NOT_FOUND);
      res.end();
    }

    if (!!loggedUser.reservations.find(e => e.toString() === reservationId.toString())) {
      loggedUser.reservations = loggedUser.reservations.filter(e => e.toString() !== reservationId);

      broadcast.reservations = broadcast.reservations.filter(r => r.user.toString() !== loggedUser._id.toString());

      await broadcast.save();
      await loggedUser.save();
      res.status(httpStatus.OK);
      res.end();
    } else {
      res.status(httpStatus.BAD_REQUEST);
      res.end();
    }

  } catch (e) {
    next(e);
  }
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

    const updatedUser = await User.findOneAndUpdate({_id: loggedUser._id},
        { $addToSet: { favorite_events: new mongoose.mongo.ObjectId(req.body.event) } }, { new: true });

    event = event.transform(updatedUser);
    res.json(event);


  } catch (error) {
    next(error);
  }
};

exports.listFavoriteEvents = async (req, res, next) => {
  try {
    const { loggedUser } = req.locals;

    const {
      _end = 10,
      _sort = 'start_at',
      _start = 0,
      _order = -1,
    } = req.query;
    if (loggedUser.favorite_events.length === 0) {
      return res.json({ docs: [], total: 0, offset: 0 });
    }

    const limit = parseInt(_end - _start, 10);
    const events = await SportEvent.paginate(
        { _id: { $in: loggedUser.favorite_events }, start_at: { $gte: moment().toDate() } },
        {
          sort: { [_sort]: _order },
          offset: parseInt(_start, 10),
          limit,
          populate: ['competition'],
        });

    events.docs = events.docs.map(event => event.transform(loggedUser));

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
  await  User.update({ _id: loggedUser._id }, { $pull: { favorite_events: new mongoose.Types.ObjectId(event._id) } }) ;


  res.status(httpStatus.OK);
  res.end();
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

    request.broadcastRequest = {
      ...omit(req.body, 'userPosition'),
      user: loggedUser._id,
    };
    const { userPosition: position } = req.body;
    if (position) {
      request.broadcastRequest.userPosition = {
        type: "Point",
        coordinates: [position.longitude, position.latitude]
      };
    }
    await request.save();

    eventEmitter.emit('user-broadcast-request', user, event, request);

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


exports.registerFcmToken = async (req, res, next) => {
  try {
    const { loggedUser } = req.locals;
    const { token, deviceId } = req.body;
    await User.update({ _id: loggedUser._id, "fcmTokens.deviceId": deviceId },
        { $set: { "array.$": { deviceId, token } } });
    // Se l'update precedente non ha avuto effeto (cioè non esiste il deviceId),
    // Allora la seguente lo aggiungerà (altrimenti, la seguente non farà nulla)
    await User.update({ _id: loggedUser._id },
        { $addToSet: { fcmTokens: { deviceId, token } } });

    res.status(httpStatus.CREATED);
    res.json({_id: deviceId, deviceId, token });
  } catch (e) {
    next(e);
  }
};

exports.uploadPhoto = async (req, res, next) => {
  try {
    const { loggedUser } = req.locals;
    if (req.file && req.file.fieldname == "photo") {
      await loggedUser.uploadPhoto(req.file, req.body || {});
    }

    res.json(loggedUser.transform());
  } catch (e) {
    next(e);
  }
};

exports.getPictureUploadURL = async (req, res, next) => {
  try {
    const { loggedUser } = req.locals;
    const { meta } = req.body;
    const ext = mime.extension(meme.type);
    const Key = `images/users/${loggedUser.id}.${ext}`;
    const signedUrl = await amazon.getUploadSignedUrl(Key);
    res.json({URL: signedUrl, user: { id: loggedUser.id, picture: loggedUser.picture }})
  } catch (e) {
    next(e);
  }
};


exports.getVisitedBusinesses = async (req, res, next) => {
  const userService = req.app.get('container').get('userService');
  res.json(await userService.getVisitedBusinesses(req.locals.user, {
    type: 1,
    name: 1,
    address: 1,
    slug: 1,
  }));
};
