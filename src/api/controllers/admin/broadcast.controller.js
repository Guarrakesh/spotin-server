const httpStatus = require('http-status');
const { handler: errorHandler } = require('../../middlewares/error');
const ApiError = require('../../utils/APIError');
const { omit } = require('lodash');
const { Model } = require('mongoose');
const { Broadcast } = require('../../models/broadcast.model.js');
const { Business } = require('../../models/business.model.js');
const { SportEvent } = require('../../models/sportevent.model.js');

const { BUSINESS, ADMIN } = require('../../middlewares/auth');
exports.load = async(req, res, next, id) => {
  try {
    const broadcast = await Broadcast.get(id);

    req.locals = { broadcast };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }

};

exports.get = (req, res) => res.json(req.locals.broadcast);

exports.create = async (req, res, next) => {
  try {


    const broadcast = new Broadcast(req.body);
    const {loggedUser} = req.locals;
    // Prima di tutto controllo se l'utente è un admin o un business
    // Se è un admin, tutto ok
    // Se è un business, allora devo controllare ulteriormente che req.body.business coincida
    // o sia incluso nei locali posseduti dall'utente business
    // Questo per evitare che un'utente business, con la sua access token, possa creare dei broadcast appartenenti
    // ad altri locali

    let business = {};
    if (loggedUser.role === BUSINESS) {
      const userBusinesses = await loggedUser.businesses();
      const business = userBusinesses.find(bus => bus._id === req.body.business);

      if (!business);
        return next(new ApiError({message: "You are not authorized to access this business", status: 403}));
    } else {
      business = await Business.findById(req.body.business);
    }

    const event = (await SportEvent.findById(req.body.event));
    const spots = event.spots;

    if (req.body.plus === true) {
      broadcast.newsfeed = 1;
    } else {
      broadcast.newsfeed = 0;
    }


    if (business.spots < spots)
      return next(new ApiError({message: "Business does not have enough spot to buy this event", status: 400, isPublic: true}));
    await business.paySpots(Broadcast.calculateSpots(req.body.offer, event, req.body.plus));
    const savedBroadcast = await broadcast.save();


    res.status = httpStatus.CREATED;
    res.json(savedBroadcast);
  } catch (error) {
    next(error);
  }

};
exports.update = async (req, res, next) => {


  const updateBroadcast = Object.assign(req.locals.broadcast, req.body);



  updateBroadcast.save()
    .then(savedBus => res.json(savedBus))
    .catch(e => next(e));

}
exports.list = async (req, res, next) => {
  try {

    //TODO: Gestire geolocalizzazione
    let broadcasts, near = {};

    const filterQuery = omit(req.query, ['latitude', 'longitude','radius', '_end', '_sort', '_order', '_start']);
    const {_end = 10, _start = 0, _order = 1, _sort = "_id" } = req.query;
    const { latitude, longitude, radius } = req.query;

    broadcasts = await Broadcast.paginate(filterQuery, {
      sort: {[_sort]: _order},
      offset: parseInt(_start),
      limit: parseInt(_end - _start),

    });
    res.json(broadcasts);



  } catch (error) {
    next(error);
  }
};

exports.remove = (req, res, next) => {
  const { broadcast } = req.locals;

  broadcast.remove()
    .then(() => res.status(200).end())
    .catch(e => next(e));
};
