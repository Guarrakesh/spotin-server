  const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const path = require('path');
const sinon = require('sinon');

const app = require('../../../../index');

const { Business } = require("../../../models/business.model");
const User = require("../../../models/user.model");
const { factory } = require('../../../factories/Factory');
const { password } = require('../../../factories/user.factory');

const amazon = require('../../../utils/amazon');
const { googleMapsClient } = require('../../../utils/google');

let business, businesses, user, userAccessToken;

const sandbox = sinon.createSandbox();

describe("Business API", () => {
  beforeEach(async () => {
    sandbox.stub(googleMapsClient, "geocode")
        .returns({asPromise: () => new Promise(resolve => resolve({json: undefined}))});
    try {
      businesses = await factory(Business, null, 3).create();
      user = await factory(User, "user").create({ password: "123456"});
      user.password = "123456";
      userAccessToken = (await User.findAndGenerateToken(user, "mobileapp")).accessToken;

    } catch (e) {
      console.log(e);
    }

  });

  afterEach(async () => {
    await User.deleteMany({});
    await Business.deleteMany({});
    sandbox.restore();
  });

  describe("GET /v1/businesses",  () => {

    it("should get the businesses", () => {
      return request(app)
          .get('/v1/businesses')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(httpStatus.OK)
          .then(res => {
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property("docs");
            expect(res.body.docs).to.be.an('array');
          })
    });
    it("should return paginated businesses", async () => {
     await factory(Business, null, 5).create();
      return request(app)
          .get('/v1/businesses?_end=3&_start=0')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(httpStatus.OK)
          .then(res => {
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('total');
            //expect(res.body.total).to.be.equal(8);
            expect(res.body).to.have.property('docs');
            expect(res.body.docs).to.have.lengthOf(3);

          })
    });
    it("should return paginated businesses", async () => {
      await factory(Business, null, 5).create();
      return request(app)
          .get('/v1/businesses?_end=3&_start=0')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .expect(httpStatus.OK)
          .then(res => {
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('total');
            //expect(res.body.total).to.be.equal(8);
            expect(res.body).to.have.property('docs');
            expect(res.body.docs).to.have.lengthOf(3);

          })
    });

  });


});
