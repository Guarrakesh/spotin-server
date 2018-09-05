const httpStatus = require('http-status');
const { handler: errorHandler } = require('../middlewares/error');
const ApiError = require('../utils/APIError');
const { omit } = require('lodash');
const { Model } = require('mongoose');
const { Broadcast } = require('../models/broadcast.model');
const { Business } = require('../models/business.model');
const { SportEvent } = require('../models/sportevent.model');

const { BUSINESS, ADMIN } = require('../middlewares/auth');
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
      throw new ApiError({message: "You are not authorized to access this business", status: 401});
    } else {
      business = await Business.findById(req.body.business);
    }

    const spots = (await SportEvent.findById(req.body.event)).spots;

    if (!business.spots >= spots)
      throw new ApiError({message: "You don't have enough spot to buy this event", status: 400});
    await business.paySpots(spots);
    const savedBroadcast = broadcast.save();


    res.status = httpStatus.CREATED;
    res.json(savedBroadcast);
  } catch (error) {
    next(error);
  }

}
exports.list = async (req, res, next) => {
  try {

    //TODO: Gestire geolocalizzazione
    let broadcasts;

    const filterQuery = omit(req.query, ['latitude', 'longitude','radius', '_end', '_sort', '_order', '_start']);
    const {_end = 10, _start = 0, _order = 1, _sort = "_id" } = req.query;
    const { latitude, longitude, radius } = req.query;

    if (latitude && longitude && radius) {
      const business = await Business.findNear(latitude, longitude, radius, { _sort, _order });
      const ids = business.docs.map(bus => bus._id);
      broadcasts = await Broadcast.find({business: {$in: ids}, ...filterQuery}).lean().exec();
      broadcasts = broadcasts.map(broadcast => {

        const currentBusiness = business.docs.find(bus => bus._id.toString() === broadcast.business.toString());

        broadcast['business'] = currentBusiness;

        return broadcast;
      });
      broadcasts = broadcasts.sort((a,b) => a.business.dist.calculated > b.business.dist.calculated);
      res.json({
        docs: broadcasts,
        offset: req.query._start,

      })

    } else {


      let broadcasts = await Broadcast.paginate(filterQuery, {
        sort: {[_sort]: _order},
        offset: parseInt(_start),
        limit: parseInt(_end - _start),

      });
      res.json(broadcasts);


    }
  } catch (error) {
    next(error);
  }
};
