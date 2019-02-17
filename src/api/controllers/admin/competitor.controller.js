const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omit } = require('lodash');
const { handler: errorHandler } = require('../../middlewares/error');
const bodyParser = require('body-parser');
const {Competitor} = require('../../models/competitor.model.js');
const { Sport } = require('../../models/sport.model.js');

exports.load = async (req, res, next, id) => {
  try {

    const competitor = await Competitor.findById(id);

    req.locals = { competitor };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

exports.get = (req, res) => res.json(req.locals.competitor.transform());


exports.list = async (req, res, next) => {
  try {

    const { _end = 25, _start = 0, _sort = "_id", _order = 1} = req.query;
    const filterQuery = omit(req.query, ['_end', '_order', '_sort', '_start', 'q', 'id_like']);
    if (req.query.q) {
      filterQuery['name'] = { "$regex": req.query.q, "$options": "i"};
    }
    if (req.query.id_like) {
        filterQuery['_id'] = { $in: decodeURIComponent(req.query.id_like).split('|')};

    }


    const competitors = await Competitor.paginate(filterQuery, {
      sort: { [_sort]: _order },
      offset: parseInt(_start),
      limit: parseInt(_end - _start)
    });

    competitors.docs = competitors.docs.map(c => c.transform());
    res.json(competitors);
  } catch (error) {
    next(error)
  }
};

exports.create = async (req, res, next) => {
  try {
    const competitor = new Competitor(req.body);

    const savedComp = await competitor.save();
    if (req.file && req.file.fieldname === "picture") {
      await savedComp.uploadPicture(req.file);
    }

    res.status(httpStatus.CREATED);
    res.json(savedComp.transform());

  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {

  const body = omit(req.body, ['picture', 'image_versions']);

  const updatedComp = Object.assign(req.locals.competitor, body);

  try {

    let savedComp = await updatedComp.save();
    if (req.file && req.file.fieldname == "picture") {
      await savedComp.uploadPicture(req.file);
    }
    res.json(savedComp.transform());
  } catch (error) {
    next(error);
  }


};

exports.remove = (req,res, next) => {
  const { competitor } = req.locals;

  competitor.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
}
