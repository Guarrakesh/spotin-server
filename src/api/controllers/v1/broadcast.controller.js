const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { handler: errorHandler } = require('../../middlewares/error');
const ApiError = require('../../utils/APIError');
const { omit } = require('lodash');
const { Model } = require('mongoose');
const { Broadcast } = require('../../models/broadcast.model.js');
const { Business } = require('../../models/business.model.js');
const { SportEvent } = require('../../models/sportevent.model.js');
const moment = require('moment');

const { BUSINESS, ADMIN } = require('../../middlewares/auth');
exports.load = async(req, res, next, id) => {
  try {

    const { loggedUser } = req.locals;
    const broadcast = await Broadcast.get(id);

    broadcast['reserved'] = broadcast.reservations.find(r => loggedUser.reservations.includes(r._id.toString())) === undefined ? false : true;


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
      const userBusiness = userBusinesses.find(bus => bus._id.toString() == req.body.business.toString());
      business = await Business.findById(userBusiness._id);

      if (!business)
        throw new ApiError({message: "You are not authorized to access this business", status: 403});
    } else {
      business = await Business.findById(req.body.business);
    }

    const event = (await SportEvent.findById(req.body.event));

    
    const spots = event.spots;

    if (!business.spots >= spots)
      throw new ApiError({message: "You don't have enough spot to buy this event", status: 400});


    if (req.body.plus === true) {
      broadcast.newsfeed = 1;
    } else {
      broadcast.newsfeed = 0;
    }

    const savedBroadcast = await broadcast.save();

    await business.paySpots(Broadcast.calculateSpots(req.body.offer, event, req.body.plus));



    res.status(httpStatus.CREATED);
    res.json(savedBroadcast);
  } catch (error) {
    next(error);
  }

};

exports.list = async (req, res, next) => {
  try {

    const { loggedUser } = req.locals;
    //TODO: Gestire geolocalizzazione
  
    let broadcasts;
    let near = {};

    let filterQuery = omit(req.query, ['latitude', 'longitude', 'radius', '_end', '_sort', '_order', '_start']);
    const { _end = 10, _start = 0, _order = 1, _sort } = req.query;
    const { latitude, longitude, radius } = req.query;
    const now = moment().toDate();
    filterQuery = {
      ...filterQuery,
      end_at: { $gte: now },
      start_at: { $lte: now },
    };
    if (latitude && longitude && radius) {
      const business = await Business.findNear(latitude, longitude, radius, { _end: 150 });


      //Faccio paginazione sui broadcast e non sui locali 
    
      const ids = business.docs.map(bus => bus._id);
      const total = await Broadcast.count({ business: { $in: ids }, ...filterQuery });
      broadcasts = await Broadcast.find({ business: { $in: ids }, ...filterQuery })
        .skip(parseInt(_start, 10)).limit(parseInt(_end - _start, 10)).lean()
        .exec();
      broadcasts = broadcasts.map((broadcast) => {
        const newBroadcast = {};
        const currentBusiness = business.docs
          .find(bus => bus._id.toString() === broadcast.business.toString());
        newBroadcast.business = currentBusiness._id;
        Object.assign(near, { [broadcast._id]: currentBusiness.dist });
        newBroadcast.reserved = broadcast.reservations.find(r => loggedUser._id.toString() === r.user.toString()) !== undefined
        return broadcast;
      });

      broadcasts = broadcasts.sort((a,b) => _order === 1 ? near[a._id].calculated > near[b._id].calculated: near[a._id].calculated < near[b._id].calculated);


      res.json({
        docs: broadcasts,
        offset: _start,
        near,
        total,
      });

    } else {


      broadcasts = await Broadcast.paginate(filterQuery, {
        sort: { [_sort]: _order },
        offset: parseInt(_start, 10),
        limit: parseInt(_end - _start, 10),
        lean: true,
      });
      broadcasts.docs = broadcasts.docs.map((broadcast) => {
        return {
          ...broadcast,
          reserved: broadcast.reservations
            .find(r => r.user.toString() === loggedUser._id.toString()) !== undefined,
        };
      });
      console.log(broadcasts.docs);
      res.json(broadcasts);


    }
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
