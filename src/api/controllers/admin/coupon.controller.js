const { UserCouponService } = require('../../services/UserCouponService');
const httpStatus = require('http-status');
const { handler: errorHandler } = require('../../middlewares/error');
const APIError = require('../../utils/APIError');

const couponService = new UserCouponService();
exports.load = async(req, res, next, id) => {
  try {
    const coupon = await couponService.findOneById(id);
    if (!coupon) {
      next(new APIError({ message: "Coupon does not exists", status: httpStatus.NOT_FOUND } ));
    }
    req.locals = { coupon };
    return next();
  } catch (error) {
    return errorHandler(error, req ,res);
  }
};

exports.get = async (req, res) => res.json(req.locals.coupon);


exports.create = async (req, res, next) => {
  try {
    const { value } = req.body;

    const result = await couponService.create(value, req.body);
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
    res.json(await couponService.findAndPaginate(req.filterParams, req.pagingParams));
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await couponService.remove(req.locals.coupon.id);
    res.status(200).end();
  } catch (e) {
    next(e);
  }
}