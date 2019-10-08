const { UserCouponService } = require('../../services/UserCouponService');
const httpStatus = require('http-status');
const ApiError = require('../../utils/APIError');


const userCouponService = new UserCouponService();
exports.useCoupon = async (req, res, next) => {
  try {
    const {loggedUser: user} = req.locals;
    const {code} = req.body;

    const result = await userCouponService.applyUserCouponCode(user.id, code);
    if (result) {
      res.status(httpStatus.OK);
      res.json(result);
    }
  } catch (error) {
    if (error.internalCode) {
      return next(new ApiError({ message: { code: error.internalCode, data: error.message }, status: httpStatus.BAD_REQUEST, isPublic: true  }));
    }
    next(error);
  }
};

