const UserTransaction = require('../../services/UserTransactionService');
const { USER_COUPON_USED } = require('../../services/UserCouponService');

const { expect } = require('chai');
const { PubSub } = require('pubsub-js');
var sinon = require('sinon');

describe('User Transaction', () => {
  let spy, userTransaction;

  beforeEach(() => {
    spy = sinon.spy();
    class UserTransactionTest extends UserTransaction {
      handleCouponUsed(msg, data) {
        spy(msg, data)
      }
    }
    userTransaction = new UserTransactionTest();
  });

  it('Should invoke the callback on USER_COUPON_USED event', () => {

    PubSub.publishSync(USER_COUPON_USED);
    expect(spy.called).equal(true);
  });
  it('Should invoke the callback on USER_COUPON_USED event with args', () => {
    let data = { foo: "bar" };
    PubSub.publishSync(USER_COUPON_USED, data);

    expect(spy.calledWith(USER_COUPON_USED, data)).equal(true)
  })
});