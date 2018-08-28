const httpStatus = require('http-status');
const { handler: errorHandler } = require('../middlewares/error');

const { Broadcast } = require('../models/broadcast.model');
const { Business } = require('../models/business.model');


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


exports.list = async (req, res, next) => {
  try {

    //TODO: Gestire geolocalizzazione
    let broadcasts;
    let query = req.query;
    const { latitude, longitude, radius } = query;

    if (req.locals && req.locals.event) {
      query['event_id'] = req.locals.event._id;

    }
    if (latitude && longitude && radius) {
      const business = await Business.findNear(latitude, longitude, radius, {});
      const ids = business.docs.map(bus => bus._id);
      broadcasts = await Broadcast.find({business: {$in: ids}});
    } else {
      let broadcasts = await Broadcast.find(req.query)
        .populate('business').populate('event');
    }



    res.json(broadcasts);

  } catch (error) {
    next(error);
  }
};



