const httpStatus = require('http-status');
const { omit } = require('lodash');
const { Setting } = require('../../models/setting.model');
const { handler: errorHandler } = require('../../middlewares/error');
const bodyParser = require('body-parser');


exports.load = async (req, res, next, id) => {
  try {
    const setting = await Setting.findById(id);
    req.locals = { setting };
    return next();

  } catch (error) {
    return errorHandler(error, req, res);
  }
};

exports.get = (req, res) => res.json(req.locals.setting);

exports.list = async (req, res, next) => {
  try {
    const filterQuery = omit(req.query, ['_end', '_order', '_sort', '_start']);
    const {
      _end = 10,
      _start = 0,
      _order = 1,
      _sort = 'key',
    } = req.query;

    if (req.query.id_like) {
      filterQuery._id = { $in: decodeURIComponent(req.query.id_like).split('|') };
      delete filterQuery['id_like'];
    }
    const limit = parseInt(_end - _start, 10);
    let settings = await Setting.paginate(filterQuery, {
      sort: { [_sort]: _order },
      offset: parseInt(_start, 10),
      limit,

    });

    res.json(settings);

  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const setting = new Setting(req.body);
    const savedSetting = await setting.save();
    res.status(httpStatus.CREATED);
    res.json(savedSetting);
  } catch (e) {
    next(e);
  }
};
exports.update = (req, res, next) => {
  const setting = Object.assign(req.locals.setting, req.body);
  setting.save()
      .then(saved => res.json(saved))
      .catch(e => next(e));
};


exports.remove = (req, res, next) => {
  const { setting } = req.locals;
  setting.remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch(e => next(e));
};