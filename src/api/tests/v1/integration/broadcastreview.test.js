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

    user = await factory(User, "user").create({ password: "123456"});
    user.password = "123456";
    userAccessToken = (await User.findAndGenerateToken(user, "mobileapp")).accessToken;

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


  describe('GET /v1/broadcastreviews', () => {
    it('should get 404 not found endpoint', async () => {
      return request(app)
          .get('/v1/broadcastreviews')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(httpStatus.NOT_FOUND)

    });
  });

  describe('POST /v1/broadcastreviews', () => {
    it('Should create a new review when user is the booker and return the whole reservation object', async () => {

      return request(app)
          .post('/v1/broadcastreviews')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            ...reviewMock,
            userId: user.id,
            reservationId: reservation.id,
          })
          .expect(httpStatus.CREATED)
          .then(res => {
            expect(res.body).to.be.an('object');
            expect(res.body.review.rating.av).to.be.a('number');
            expect(!!res.body.review.createdAt).to.be.true;
          });
    });
    it('Should return 401 Unauthorized when user cannot review the broadcast', async () => {

      // Elimino la prenotazione dal broadcast cosi da avere che
      // l'utente non abbia prenotato
      broadcast.reservations = [];
      await broadcast.save();
      return request(app)
          .post('/v1/broadcastreviews')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            ...reviewMock,
            userId: user.id,
            reservationId: reservation.id,
          })
          .expect(httpStatus.UNAUTHORIZED)
    });
    it('Should return Bad Request when some data is missing', async () => {

      return request(app)
          .post('/v1/broadcastreviews')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            comment: reviewMock.comment,
            userId: user.id,
            reservationId: reservation.id,
          })
          .expect(httpStatus.BAD_REQUEST)
    });
    it('Should give Bad Request if reservation does not exists', async () => {
      return request(app)
          .post('/v1/broadcastreviews')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            comment: reviewMock.comment,
            userId: user.id,
            reservationId: "someidthatdoesnotexist",
          })
          .expect(httpStatus.BAD_REQUEST)
    })
    it('Should give Bad Request if user has already reviewed this reservation', async () => {
      broadcast.reservations[0].review = {
        ...reviewMock,
        status: 1,
      };
      await broadcast.save();
      return request(app)
          .post('/v1/broadcastreviews')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            ...reviewMock,
            userId: user.id,
            reservationId: reservation.id,
          })
          .expect(httpStatus.UNAUTHORIZED)
    })


  });
});
