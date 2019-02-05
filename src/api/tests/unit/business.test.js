
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const sinon = require('sinon');
const {promisify} = require('util');
const { Business, imageSizes } = require('../../models/business.model');
const { SportEvent } = require('../../models/sportevent.model');

const { factory } = require("../../factories/Factory");
const { s3WebsiteEndpoint } = require('../../../config/vars');
const amazon = require('../../utils/amazon');
const { googleMapsClient } = require('../../utils/google');
const faker = require('faker');
const sizeOf = require('image-size');

const moment = require('moment');

var fs = require('fs');
var path = require('path');

chai.use(chaiAsPromised);
const expect = chai.expect;


let business, businessHours;
const sandbox = sinon.createSandbox();

describe("Business Model", () => {
  beforeEach(async () => {

    try {
      sandbox.stub(googleMapsClient, "geocode")
          .returns({ asPromise: () => new Promise(resolve => resolve({}) ) });

      businessHours = {
        0: {openings: [{open: 600, close: 1440}]},
        1: {openings: []},
        2: {openings: [{open: 600, close: 930}, {open: 1020, close: 120}], crossing_day_close: 120},
        3: {openings: [{open: 600, close: 930}, {open: 1020, close: 120}], crossing_day_close: 120},
        4: {openings: [{open: 600, close: 930}, {open: 1020, close: 0}], crossing_day_close: 0},
        5: {openings: [{open: 600, close: 930}, {open: 1020, close: 0}], crossing_day_close: 0},
        6: {openings: [{open: 600, close: 930}, {open: 1020, close: 0}], crossing_day_close: 0},


      }
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
      for (let i in imageSizes) {
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

      const _business = await factory(Business).make({spots: 500});

      await _business.paySpots(250);
      expect(_business.spots).to.be.equal(250);

    });
    it ("Should throw error if not enough spots", async () => {
      const _business = await factory(Business).create({spots: 500});

      expect(_business.paySpots(700)).to.eventually.be.rejectedWith("Not enough spots to pay 700 spots")
    });
  });


  describe('checkSupportProviders()', () => {
    it ("Should return false when no providers match", async () => {
      const b = await factory(Business).create({ providers: ["DAZN", "Digitale Terrestre"]});
      expect(b.checkSupportsProviders(['Sky'])).to.be.false;
    });
    it ("Should return true when at least a provider matches", async () => {
      const b = await factory(Business).create({ providers: ["DAZN", "Digitale Terrestre"]});
      expect(b.checkSupportsProviders(['DAZN', 'Sky'])).to.be.true;
    });
  });
  describe( 'isEventBroadcastable()', async() => {

    it ("Should return false when event is out of business hours", async () => {
      const _business = await factory(Business).create({
        business_hours: businessHours,
        providers: ["Sky"]
      });
      const event = { start_at: moment('2019-01-07 06:30', 'YYYY-MM-DD HH:mm').toDate(), sport: { duration: 120 }, providers:["Sky"] }; //Lunedì alle 16:30


      expect(_business.isEventBroadcastable(event)).to.be.false;
    });

    it ("Should return false when event is in time but sport time goes out of time", async () => {
      const _business = await factory(Business).create({
        business_hours: businessHours,
        providers: ["Sky"]
      });
      const event = { start_at: moment('2019-01-07 22:30', 'YYYY-MM-DD HH:mm').toDate(), sport: { duration: 120 }, providers:["Sky"] }; //Lunedì alle 16:30


      expect(_business.isEventBroadcastable(event)).to.be.false;
    });

    it ("Should return false when event is in time but there are no providers supported", async () => {
      const _business = await factory(Business).create({
        business_hours: businessHours,
        providers: ["Digitale Terrestre"]
      });
      const event = { start_at: moment('2019-01-07 18:30', 'YYYY-MM-DD HH:mm').toDate(), sport: { duration: 120 }, providers:["Sky"] }; //Lunedì alle 16:30


      expect(_business.isEventBroadcastable(event)).to.be.false;
    });
    it ("Should return true when everyhing is ok", async () => {
      const _business = await factory(Business).create({
        business_hours: businessHours,
        providers: ["Digitale Terrestre", "Sky"]
      });
      const event = { start_at: moment('2019-01-07 18:30', 'YYYY-MM-DD HH:mm').toDate(), sport: { duration: 120 }, providers:["Sky"] }; //Lunedì alle 16:30


      expect(_business.isEventBroadcastable(event)).to.be.true;
    });

    it ("Should return true when business closes after midnight and event starts before", async () => {
      const _business = await factory(Business).create({
        business_hours: businessHours,
        providers: ["Digitale Terrestre", "Sky"]
      });
      const event = { start_at: moment('2019-01-10 22:30', 'YYYY-MM-DD HH:mm').toDate(), sport: { duration: 120  }, providers:["Sky"] }; //Lunedì alle 16:30

      expect(_business.isEventBroadcastable(event)).to.be.true;
    });
    it ("Should return true when business closes after midnight and event stars after midnight", async () => {
      const _business = await factory(Business).create({
        business_hours: businessHours,
        providers: ["Digitale Terrestre", "Sky"]
      });
      const event = { start_at: moment('2019-01-11 00:00', 'YYYY-MM-DD HH:mm').toDate(), sport: { duration: 120  }, providers:["Sky"] }; //Lunedì alle 16:30

      expect(_business.isEventBroadcastable(event)).to.be.true;
    });
    it ("Should return false when as above but event ends after closing time", async () => {
      const _business = await factory(Business).create({
        business_hours: businessHours,
        providers: ["Digitale Terrestre", "Sky"]
      });
      const event = { start_at: moment('2019-01-11 00:00', 'YYYY-MM-DD HH:mm').toDate(), sport: { duration: 350  }, providers:["Sky"] }; //Lunedì alle 16:30

      expect(_business.isEventBroadcastable(event)).to.be.false;
    });
    it ("Should return false when event is in a closing day", async () => {
      const _business = await factory(Business).create({
        business_hours: businessHours,
        providers: ["Digitale Terrestre", "Sky"]
      });
      const event = { start_at: moment('2019-01-08 00:00', 'YYYY-MM-DD HH:mm').toDate(), sport: { duration: 350  }, providers:["Sky"] }; //Lunedì alle 16:30

      expect(_business.isEventBroadcastable(event)).to.be.false;
    });


  })


  describe('getBroadcastableEvents()', async() => {
   // awair factory(SportEvent).create();
  } )
});
