const User = require('../models/user.model');
const { CouponCode, ErrorCodes} = require('../models/couponcode.model');
const mongoose = require('mongoose');
const PubSub = require('pubsub-js');
const BaseMongoService = require('./BaseMongoService');

const USER_COUPON_USED = 'USER_COUPON_USED';
class UserCouponService extends BaseMongoService {

  constructor() {
    super(CouponCode);
  }
  /**
   *
   * @param userId
   * @param couponCode
   * @returns {Promise<CouponCode>}
   */
  async applyUserCouponCode(userId, couponCode) {

   // this.mongoSession = await User.startSession();
   // this.mongoSession.startTransaction();
    try {
   //    const { opts } = this.mongoSession || {};
      const coupon = await CouponCode.apply(couponCode, userId);
      await User.findOneAndUpdate({ _id: userId }, {
        $inc: { spotCoins: coupon.value }
      }, opts);

      PubSub.publishSync(USER_COUPON_USED, coupon);
      //await this.mongoSession.commitTransaction();
      return coupon;
    } catch (error) {
      //await this.mongoSession.abortTransaction();
      throw error;
    } finally {
      //await this.mongoSession.endSession();
    }

  }

  async create(value, opts) {
    return await CouponCode.generate({value, ...opts});
  }
  async findAndPaginate(filter, paginateParams) {

    const results = await CouponCode.paginate(
        UserCouponService.convertRestFilterParams(filter),
        UserCouponService.convertRestPagingParams(paginateParams)
    );

    return results;
  }

}


exports.USER_COUPON_USED = USER_COUPON_USED;
exports.UserCouponService = UserCouponService;