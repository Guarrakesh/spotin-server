const User = require('../models/user.model');
const { CouponCode, ErrorCodes} = require('../models/couponcode.model');
const mongoose = require('mongoose');
const PubSub = require('pubsub-js');

const USER_COUPON_USED = 'USER_COUPON_USED';
class UserCouponService {

  /**
   *
   * @param userId
   * @param couponCode
   * @returns {Promise<CouponCode>}
   */
  static async applyUserCouponCode(userId, couponCode) {

   // this.mongoSession = await User.startSession();
   // this.mongoSession.startTransaction();
    try {
      const { opts } = this.mongoSession || {};
      const coupon = await CouponCode.apply(couponCode, userId);
      console.log(coupon);
      await User.findOneAndUpdate({ _id: userId }, {
        $inc: { spotCoins: coupon.value }
      }, opts);
      await PubSub.publish(USER_COUPON_USED, coupon);
      //await this.mongoSession.commitTransaction();
      return coupon;
    } catch (error) {
      //await this.mongoSession.abortTransaction();
      throw error;
    } finally {
      //await this.mongoSession.endSession();
    }

  }

  static async create(value, opts) {
    return await CouponCode.create({value, ...opts});
  }

}


exports.USER_COUPON_USED = USER_COUPON_USED;
exports.UserCouponService = UserCouponService;