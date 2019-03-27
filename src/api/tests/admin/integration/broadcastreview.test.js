const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../../../index');

const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');

const reviewMock = require('../../mocks/reviewMock');
const { factory } = require('../../../factories/Factory');
const { googleMapsClient } = require('../../../utils/google');
const User = require("../../../models/user.model");
const { Broadcast } = require('../../../models/broadcast.model');
const { Reservation } = require('../../../models/reservation.model');
const expect = chai.expect;

const sandbox = sinon.createSandbox();

let user, userAccessToken, broadcast, reservation;

describe('BroadcastReview API', () => {
  beforeEach(async () => {
    sandbox.stub(googleMapsClient, "geocode")
        .returns({ asPromise: () => new Promise(resolve => resolve({}) ) });

    user = await factory(User, "admin").create({ password: "123456"});
    user.password = "123456";
    userAccessToken = (await User.findAndGenerateToken(user)).accessToken;

    broadcast = await factory(Broadcast).create();
    reservation = await factory(Reservation).create({
      user: user._id,
    });
    broadcast.reservations.push(reservation);
    await broadcast.save();

  });
  afterEach(async () => {

    sandbox.restore();
  });


  describe('GET /admin/broadcastreviews', () => {
    it('should get 404 not found endpoint', async () => {
      return request(app)
          .get(`/admin/reservations/${reservation.id}/reviews`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(httpStatus.NOT_FOUND)

    });
  });

  describe('PATCH /admin/reservations/:id/broadcastreviews', () => {
    it('Should confirm a pending review', async () => {
      await broadcast.review(user.id, reservation.id, reviewMock);
      const reviewId = broadcast.reservations.find(r => r.user === user._id).review._id;
      return request(app)
          .patch(`/admin/reservations/${reservation.id}/reviews/${reviewId}`)
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            status: 1
          })
          .expect(httpStatus.OK)
          .then(res => {
            expect(res.body.reservations[0].review.status).equal(1);
          });
    });

  });
});
