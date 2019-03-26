const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../../../index');

const chai = require('chai');
const sinon = require('sinon');
const { BroadcastReview } = require('../../../models/review.model');
const { factory } = require('../../../factories/Factory');
const { googleMapsClient } = require('../../../utils/google');
const User = require("../../../models/user.model");

const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

const sandbox = sinon.createSandbox();

let user, userAccessToken;

describe('BroadcastReview API', () => {
  beforeEach(async () => {
    await BroadcastReview.deleteMany();
    sandbox.stub(googleMapsClient, "geocode")
        .returns({ asPromise: () => new Promise(resolve => resolve({}) ) });

    user = await factory(User, "user").create({ password: "123456"});
    user.password = "123456";
    userAccessToken = (await User.findAndGenerateToken(user, "mobileapp")).accessToken;

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
    it('Should create a new review', async () => {
      // TODO Divertiti
        expect(true).equal(true);
    });

  })
});
