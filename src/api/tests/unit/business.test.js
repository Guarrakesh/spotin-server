const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const sinon = require('sinon');
const {promisify} = require('util');
const { Business, imageSizes } = require('../../models/business.model');

const { factory } = require("../../factories/Factory");
const { s3WebsiteEndpoint } = require('../../../config/vars');
const amazon = require('../../utils/amazon');
const { googleMapsClient } = require('../../utils/google');
const faker = require('faker');
const sizeOf = require('image-size');

var fs = require('fs');
var path = require('path');

chai.use(chaiAsPromised);
const expect = chai.expect;


let business;
const sandbox = sinon.createSandbox();

describe("Business Model", () => {
  beforeEach(async () => {
    try {
      business = await factory(Business).make();
    } catch (e) {
      console.log(e);
    }
  });

  afterEach(() => {
    sandbox.restore();
    Business.deleteMany({});
  });
  describe("makeImageVersions()", () => {
    it("should return all versions of a URL and remove possible trailing/leading slashes ", () => {

      const basePath = s3WebsiteEndpoint + "/" + business.s3Path();
      const fileName = "test.jpg";
      const versions = Business.makeImageVersions("/" + basePath + "/", "/" + fileName);

      expect(versions).to.be.an('array');
      expect(versions).to.have.lengthOf(imageSizes.length);
      for (i in imageSizes) {
        expect(versions[i]).to.be.an('object');
        expect(versions[i]).to.have.property('width');
        expect(versions[i].width).to.be.equal(imageSizes[i].width);
        expect(versions[i].url).to.be.equal(
            `${basePath}/${imageSizes[i].width}x${imageSizes[i].height}/${fileName}`);
      }
    });

  });

  describe('uploadPicture()', () => {
      it ("Should push new picture to pictures field", async () => {
        sandbox.stub(amazon, 'uploadImage').callsFake(async () => {
          return new Promise((resolve) => resolve({ Location: "test_location" }));
        });
        sandbox.stub(googleMapsClient, "geocode")
            .returns({ asPromise: () => new Promise(resolve => resolve({}) ) });

        const readfile = promisify(fs.readFile);
        const file = await readfile(path.join(__dirname + "/../", 'files', '354.jpg'));
        await business.uploadPicture({ buffer: file });
        expect(sizeOf(file).width).to.be.equal(458);
        expect(business.pictures).to.be.an('array');
        expect(business.pictures).to.have.lengthOf(1);
        expect(business.pictures[0]).to.have.property("_id");

      });


  });

  describe('paySpots()', () => {
    it ("Should decrease spots", async () => {
      const _business = await factory(Business).create({spots: 500});

      await _business.paySpots(250);
      expect(_business.spots).to.be.equal(250);

    });
    it ("Should throw error if not enough spots", async () => {
      const _business = await factory(Business).create({spots: 500});

      expect(_business.paySpots(700)).to.eventually.be.rejectedWith("Not enough spots to pay 700 spots")
    });
  });



});
