const httpStatus = require('http-status');
const { handler: errorHandler } = require('../middlewares/error');

const { Broadcast } = require('../models/broadcast.model');
const { Business } = require('../models/business.model');
const { omit } = require('lodash');


exports.load = async(req, res, next, id) => {
  try {
    const business = await Business.findById(id);
    req.locals = { business };
    return next();
  } catch (error) {
    next(error);
  }

};

exports.get = (req, res) => res.json(req.locals.business);


exports.list = async (req, res, next) => {
  try {

    const filterQuery = omit(req.query, ['latitude', 'longitude','radius']);
    const {_end, _start, _order, _sort } = req.query;
    const { latitude, longitude, radius } = req.query;
/*
    let data;
    if (latitude && longitude && radius) {
      filterQuery['address.location'] = {
        $near: {
          $maxDistance: parseInt(radius),
          $geometry: {type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)]}
        }
      };
    }
    let data = await Business.paginate(filterQuery, {
      sort: _sort ? {[_sort]: _order ? _order.toLowerCase() : 1} : "",
      offset: (_start) ? parseInt(_start) : 0,
      limit: (_end && _start) ? parseInt(_end - _start) : 10,
      populate: ['business_id', 'event_id']

    });*/
    if (req.query.id_like) {
      filterQuery._id = { $in: decodeURIComponent(req.query.id_like).split('|')};
      delete filterQuery['id_like'];
    }
    if (latitude && longitude && radius) {
      data = await Business.findNear(latitude, longitude, radius, filterQuery);
    } else {
      const query = omit(filterQuery, ['_end','_sort','_order','_start']);

      data = await Business.paginate(query, {
        sort: _sort ? {[_sort]: _order ? _order.toLowerCase() : 1} : "",
        offset: (_start) ? parseInt(_start) : 0,
        limit: (_end && _start) ? parseInt(_end - _start) : 10,


      });
    }
    res.json(data);

  } catch (error) {
    next(error);
  }
};


exports.update = async (req, res, next) => {

    const updatedBusiness = Object.assign(req.locals.business, req.body);

    updatedBusiness.save()
      .then(savedBus => res.json(savedBus))
      .catch(e => next(e));

};

exports.create = async (req, res, next) => {
   try {
     const business = new Business(req.body);
     const saved = await  business.save();
     res.status(httpStatus.CREATED);
     res.json(saved);

   } catch (error) {
     next(error);
   }
}
