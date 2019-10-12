const { PrizeService } = require('../../services/PrizeService');
const httpStatus = require('http-status');
const { handler: errorHandler } = require('../../middlewares/error');
const APIError = require('../../utils/APIError');

const prizeService = new PrizeService();
exports.load = async(req, res, next, id) => {
  try {
    const prize = await prizeService.findOneById(id);
    if (!prize) {
      next(new APIError({ message: "Proze does not exists", status: httpStatus.NOT_FOUND } ));
    }
    req.locals = { prize };
    return next();
  } catch (error) {
    return errorHandler(error, req ,res);
  }
};

exports.get = async (req, res) => res.json(req.locals.prize);


exports.create = async (req, res, next) => {
  try {
    const { restaurantRelatedRules } = req.body;

    const result = await prizeService.create({
      ...req.body,
    // c'è bisogno del parse perché poiché c'è un upload il content type è multipart/form-data
      restaurantRelatedRules: restaurantRelatedRules ? JSON.parse(restaurantRelatedRules) : undefined,
    });
    if (req.file) {
      await prizeService.uploadImageToS3(result, req.file)
    }

    if (result) {
      res.status(httpStatus.OK);
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    res.json(await prizeService.findAndPaginate(req.filterParams, req.pagingParams));
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await prizeService.remove(req.locals.prize);
    res.status(200).end();
  } catch (e) {
    next(e);
  }
};
