const { UserCouponService } = require('../../services/UserCouponService');
const httpStatus = require('http-status');


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
    next(error);
  }
};

