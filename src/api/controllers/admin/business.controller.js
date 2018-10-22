const httpStatus = require('http-status');
const { handler: errorHandler } = require('../../middlewares/error');

const { Broadcast } = require('../../models/broadcast.model.js');
const { Business } = require('../../models/business.model.js');
const { omit } = require('lodash');


const { s3WebsiteEndpoint } = require('../../../config/vars');
const { uploadImage } = require('../../utils/amazon.js');
const imageSizes = [
  {width: 640, height: 350},
  {width: 768, height: 432},
  {width: 320, height: 180},
];

exports.load = async(req, res, next, id) => {
  try {
    const business = await Business.findById(id);
    req.locals = { business };
    return next();
  } catch (error) {
    next(error);
  }
};

/* exports.resetImages = async (req, res, next) => {
 const businesses = await Business.find({});
 for(var i=0; i<businesses.length; i++) {

  const bus = businesses[i];
  console.log(bus.cover_versions);
  if (bus.cover_versions.length === 0) continue;

  let ext = bus.cover_versions[0].url.split('.').pop();
  bus.cover_versions = bus.cover_versions.slice(0,1);
 
  const basePath = s3WebsiteEndpoint + "/images/businesses";

  imageSizes.forEach(({width, height}) => {

    bus.cover_versions.push({
      url: `${basePath}/${bus._id.toString()}/${width}x${height}/cover.${ext}`,
      width: width,
      height: height
    });
  });
 
  await bus.save();
 
  
 }
  


}; */
exports.get = (req, res) => res.json(req.locals.business);


exports.list = async (req, res, next) => {
  try {

    const filterQuery = omit(req.query, ['latitude', 'longitude','radius']);
    const {_end, _start, _order, _sort } = req.query;
    const { latitude, longitude, radius } = req.query;
    let data, near = {};
    if (req.query.id_like) {
      filterQuery._id = { $in: decodeURIComponent(req.query.id_like).split('|')};
      delete filterQuery['id_like'];
    }
    if (latitude && longitude && radius) {
      data = await Business.findNear(latitude, longitude, radius, filterQuery);
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

     if (req.file && req.file.fieldname === "picture") {
       await saved.uploadCover(req.file);
     }
     res.status(httpStatus.CREATED);
     res.json(saved);

   } catch (error) {
     next(error);
   }
};

exports.remove = (req, res, next) => {
  const { business } = req.locals;

  business.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
