const mongoose = require('mongoose');
const { CouponCode } = require('../../models/couponcode.model');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const couponCodeLib = require('coupon-code');

var sinon = require('sinon');
chai.use(chaiAsPromised);
const expect = chai.expect;

const sandbox = sinon.createSandbox();

describe('CouponCode Model', () => {
  afterEach(async () => {
    sandbox.restore();
  });

  describe('CouponCode@generate', () => {
    it('Should generate new coupon code', async  () => {
      sandbox.stub(CouponCode, 'findOne').yields(null, { code: 'SSS'})
      sandbox.stub(CouponCode, 'count').returns(0);
      sandbox.stub(CouponCode, 'create').callsFake(a => a);
      const result = await CouponCode.generate({ value: 10 });
      expect(result).to.be.an('object');
      expect(result.code).to.be.a('string');
      expect(result.value).equal(10);
    });
    // it('Should not generate if value is undefined', async () => {
    //   expect(() => CouponCode.generate()).to.throw("Cannot create a Coupon Code without a value");
    // })
  });
  describe('CouponCode@apply', () => {
    it('Should give already used error when coupon code exists',async () => {
      sandbox.stub(CouponCode, 'findOne').callsFake(args => ({...args, used: true}));
      const code = couponCodeLib.generate({ parts: 1, partLen: 6});
      expect(CouponCode.apply(code)).to.eventually.be.rejectedWith("Coupon not found")
    });
    it('Should give invalid coupon',async () => {
      expect(CouponCode.apply("abc")).to.eventually.be.rejectedWith("Coupon not valid")
    });
    it('Should give coupon not found',async () => {
      sandbox.stub(CouponCode, 'findOne').callsFake(args => null);
      const code = couponCodeLib.generate({ parts: 1, partLen: 6});
      expect(CouponCode.apply(code)).to.eventually.be.rejectedWith("Coupon not found")
    });
    it('Should give coupon expired',async () => {
      const now = new Date();
      sandbox.stub(CouponCode, 'findOne').callsFake(args => ({
            ...args, expiresAt: now.setDate(now.getDate() - 5)
          })
      );
      const code = couponCodeLib.generate({ parts: 1, partLen: 6});
      expect(CouponCode.apply(code)).to.eventually.be.rejectedWith("Coupon has expired")
    })
  })

})