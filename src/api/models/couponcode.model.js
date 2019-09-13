const mongoose = require('mongoose');
const couponCodeLib = require('coupon-code');
const mongoosePaginate = require('mongoose-paginate');
const ExtendableError = require('../utils/ExtendableError');

const errorCodes = {
  COUPON_NOT_VALID: 11,
  COUPON_ALREADY_USED: 12,
  COUPON_NOT_FOUND: 13,
  COUPON_EXPIRED: 14,
};
const couponErrorMessageMap = {
  [errorCodes.COUPON_EXPIRED]: "Coupon has expired",
  [errorCodes.COUPON_ALREADY_USED]: "Coupon has already been used",
  [errorCodes.COUPON_NOT_FOUND]: "Coupon not found",
  [errorCodes.COUPON_NOT_VALID]: "Coupon not valid"
};

class CouponError extends ExtendableError {
  constructor(type) {
    super({
      message: couponErrorMessageMap[type],
      isPublic: true,
      internalCode: type,
    });
  }
};

const couponCodeLibOpts = {
  parts: 1,
  partLen: 6
};
const couponCodeSchema = new mongoose.Schema({
  code: {
    required: true,
    type: String,
    unique: true,
  },
  used: Boolean,
  usedBy: {
    ref: 'User',
    type: mongoose.Schema.ObjectId,
  },
  usedAt: Date,
  value: Number,
  type: String,
  expiresAt: Date,
}, { timestamps: true });


couponCodeSchema.statics.generate = async function(options = {}) {
  if (!options.value) {
    throw new Error("Cannot create a Coupon Code without a value")
  }
  let isUnique = true;
  let code;
  do {
    code = couponCodeLib.generate(couponCodeLibOpts);
    isUnique = await this.checkUniqueness(code);
  } while (!isUnique);

  return await this.create({
    code,
    ...options,
  });
};

couponCodeSchema.statics.checkUniqueness = async function(code) {
  const count = await this.count({ code });
  return count === 0;
};

couponCodeSchema.statics.apply = async function(code, userId) {
  if (!couponCodeLib.validate(code, couponCodeLibOpts)) {
    throw new CouponError(errorCodes.COUPON_NOT_VALID);
  }
  const coupon = await this.findOne({ code });
  if (!coupon) {
    throw new CouponError(errorCodes.COUPON_NOT_FOUND);
  } else if (coupon.used) {
    throw new CouponError(errorCodes.COUPON_ALREADY_USED);
  } else if (coupon.expiresAt && coupon.expiresAt < Date.now()) {
    throw new CouponError(errorCodes.COUPON_EXPIRED);
  }
  coupon.used = true;
  coupon.usedBy = userId;
  coupon.usedAt = Date.now();
  return await coupon.save();

};

exports.couponCodeLibOpts = couponCodeLibOpts;
exports.couponCodeSchema = couponCodeSchema;
exports.CouponCode = mongoose.model('CouponCode', couponCodeSchema, 'couponcodes');
exports.ErrorCodes = errorCodes;