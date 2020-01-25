const httpStatus = require('http-status');
const { handler: errorHandler } = require('../../middlewares/error');

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
exports.get = async (req, res) => {
  const { business } = req.locals;
  Business.update({ _id: business._id }, { $inc: { views: 1}});
  res.json(business);
};


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
    if (req.query.q || req.query.name) {
      filterQuery['name'] = { "$regex": req.query.q || req.query.name, "$options": "i"};
      delete filterQuery.q;
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

const sanitizeFormData = formData => {
  ["offers", "business_hours"].forEach(field => {
    try {
      formData[field] = JSON.parse(formData[field]);
    } catch (e) {
    }
  });
  return formData;

};
exports.update = async (req, res, next) => {


  let body = omit(req.body, ['cover_versions', 'pictures', '_id', 'picture']);
  if (req.files) {
    // c'è un upload, per cui la richiesta è in multipart/form-data
    // per cui tutti i nested obejct, devo parsarli in JSON
    body = sanitizeFormData(body);
  }

  let updatedBusiness = Object.assign(req.locals.business, body);
  if (req.files) {
    if (req.files.picture && req.files.picture.length > 0) {
      await updatedBusiness.uploadCover(req.files.picture[0]);
    }
    if (req.files.pictures && req.files.pictures.length > 0) {

      await Promise.all(req.files.pictures.map(async (file) => {
        console.log(file);
        await updatedBusiness.uploadPicture(file);
      }));
    }
  }
  try {
    const savedBus = await updatedBusiness.save()
    res.json(savedBus);
  } catch (ex) {
    console.log(ex);
    next(ex);
  }


};


exports.create = async (req, res, next) => {
  try {

    let body = req.body;

    if (req.files) {
      // c'è un upload, per cui la richiesta è in multipart/form-data
      // per cui tutti i nested obejct, devo parsarli in JSON
      body = sanitizeFormData(body);
    }
    const business = new Business(body);
    const saved = await  business.save();

    if (req.files) {
      if (req.files.picture && req.files.picture.length > 0) {
        await saved.uploadCover(req.file);
      }
      if (req.files.pictures && req.files.pictures.length > 0) {

        await Promise.all(req.files.pictures.map(async (file) => {
          await updatedBusiness.uploadPicture(file);
        }));
      }
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
