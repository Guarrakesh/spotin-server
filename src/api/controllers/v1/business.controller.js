const httpStatus = require('http-status');
const { handler: errorHandler } = require('../../middlewares/error');
const ApiError = require('../../utils/APIError');
const { BUSINESS } = require("../../middlewares/auth");
const { Broadcast } = require('../../models/broadcast.model.js');
const { Business } = require('../../models/business.model.js');
const { omit, get } = require('lodash');


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
    const {_end, _start = 0, _order, _sort } = req.query;
    const { latitude, longitude, radius } = req.query;
    let data, near = {};

    let fieldsToOmit = [];
    if (!req.locals || !req.locals.loggedUser || req.locals.loggedUser !== BUSINESS) {
      fieldsToOmit = ["spots","vat","user"];
    }
    if (req.query.q || req.query.name) {
      filterQuery['name'] = { "$regex": req.query.q || req.query.name, "$options": "i"};
    }
    if (req.query.id_like) {
      filterQuery._id = { $in: decodeURIComponent(req.query.id_like).split('|')};
      delete filterQuery['id_like'];
    }
    if (latitude && longitude && radius) {
      data = await Business.findNear(latitude, longitude, radius, filterQuery, [
        { $project: { ...fieldsToOmit.reduce((acc,i) => ({ ...acc, [i]: 0 }), {}) } }
      ]);
      data.docs = data.docs.map(business => {
        Object.assign(near, { [business._id]: business.dist });

        return omit(business, "dist");
      });
    } else {
      const query = omit(filterQuery, ['_end','_sort','_order','_start']);

      data = await Business.paginate(query, {
        sort: _sort ? {[_sort]: _order ? _order.toLowerCase() : 1} : "",
        offset: (_start) ? parseInt(_start) : 0,
        limit: (_end && _start) ? parseInt(_end - _start) : 10,
      });
    }
    res.json({...data, near});

  } catch (error) {
    next(error);
  }
};


exports.update = async (req, res, next) => {

    const updatedBusiness = Object.assign(req.locals.business, req.body);

    if (req.file && req.file.fieldname === "picture") {
      await updatedBusiness.uploadCover(req.file);
    }

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
};


exports.pastOffers = async (req, res, next) => {
  try {
    const business = get(req,'locals.business',null);
    const loggedUser = get(req,'locals.loggedUser', {});

    //  res.json({docs: []});
    if (!business || business.user.toString() !== loggedUser._id.toString()) {
      throw new ApiError({message: "You are not authorized to access this business", status: 403});
    }

    const offers = await Broadcast.find({business: business._id,'newsfeed': {$gt: 0}}).select("offer");

    res.json({docs: offers.map(record => record.offer)});
  } catch (error) {
    next(error);
  }
};

