const { UserCouponService } = require('../../services/userCouponService');
const httpStatus = require('http-status');

exports.get = async (req, res, next) => {
  try {
    const coupons = await UserCouponService.getAll();
  } catch (e) {
    next(e);
  }
};
exports.create = async (req, res, next) => {
  try {
    const { value } = req.body;

    const result = await UserCouponService.create(value, req.body);
    if (result) {
      res.status(httpStatus.OK);
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
};

