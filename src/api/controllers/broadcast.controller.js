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


    if (latitude && longitude && radius) {
      const business = await Business.findNear(latitude, longitude, radius);
      const ids = business.docs.map(bus => bus._id);
      broadcasts = await Broadcast.find({business: {$in: ids}}).populate('event').lean().exec();
      broadcasts = broadcasts.map(broadcast => {

        const currentBusiness = business.docs.find(bus => bus._id.toString() === broadcast.business.toString());

        broadcast['business'] = currentBusiness;
        return broadcast;
      });
      res.json({
        docs: broadcasts,
        offset: req.query._start,

      })

    } else {
      let broadcasts = await Broadcast.find(req.query)
        .populate('business').populate('event')
    }
  } catch (error) {
    next(error);
  }
};
