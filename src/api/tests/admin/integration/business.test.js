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

let business, businesses, user, adminAccessToken;

const sandbox = sinon.createSandbox();

describe("Business API", () => {
  beforeEach(async () => {
    try {
      businesses = await factory(Business, null, 3).create();

      user = await factory(User, "admin").create({ password: "123456"});
      user.password = "123456";
      adminAccessToken = (await User.findAndGenerateToken(user)).accessToken;

    } catch (e) {
      console.log(e);
    }
    sandbox.stub(googleMapsClient, "geocode")
        .returns({asPromise: () => new Promise(resolve => resolve({json: undefined}))});
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Business.deleteMany({});
    sandbox.restore();
  });

  describe("GET /admin/businesses",  () => {

    it("should get the businesses", () => {
      return request(app)
          .get('/admin/businesses')
          .set('Authorization', `Bearer ${adminAccessToken}`)
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
          .get('/admin/businesses?_end=3&_start=0')
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .expect(httpStatus.OK)
          .then(res => {
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('total');
            expect(res.body.total).to.be.equal(8);
            expect(res.body).to.have.property('docs');
            expect(res.body.docs).to.have.lengthOf(3);
          })
    });
  });
  describe("POST /admin/businesses/:id", () => {
    it("should upload pictures", async () => {
      sandbox.stub(amazon, 'uploadImage').callsFake(async () => {
        return new Promise((resolve) => resolve({ Location: "test_location" }));
      });
      const _business = await factory(Business).create();
      return request(app)
          .patch('/admin/businesses/'+_business.id)

          .attach('picture',path.resolve(__dirname + '../../../files/354.jpg'))
          .attach('pictures', path.resolve(__dirname + '../../../files/354.jpeg'))
          .set('Authorization', `Bearer ${adminAccessToken}`)

          .then((res) => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('pictures');
            expect(res.body.pictures).to.be.an('array');
            expect(res.body.pictures).to.have.lengthOf(1);
            expect(res.body.pictures[0].versions).to.have.lengthOf(4);
            expect(res.body.pictures[0].versions[0].url).to.be.equal('test_location');
          });

    });
  });



});
