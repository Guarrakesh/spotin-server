const { UserCouponService } = require('../../services/userCouponService');
const httpStatus = require('http-status');


exports.useCoupon = async (req, res, next) => {
  try {
    const {loggedUser: user} = req.locals;
    const {code} = req.body;

    const result = await UserCouponService.applyUserCouponCode(user.id, code);
    if (result) {
      res.status(httpStatus.OK);
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
};

