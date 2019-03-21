
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const sinon = require('sinon');
const { SportEvent } = require('../../models/sportevent.model');
const { BroadcastBundle } = require('../../models/broadcastbundle.model');
const { Business } = require('../../models/business.model');
const { factory } = require("../../factories/Factory");

const { googleMapsClient } = require('../../utils/google');

const moment = require('moment');


const expect = chai.expect;


let businessHours;
const sandbox = sinon.createSandbox();


let sportEvents, business;

describe('BroadcastBundle Model', () => {
  beforeEach(async () => {
    sandbox.stub(googleMapsClient, "geocode")
        .returns({ asPromise: () => new Promise(resolve => resolve({}) ) });
    sportEvents = await factory(SportEvent, undefined, 20).create();
    business = await factory(Business).create(1);

  });
  afterEach(async () => {
    sandbox.restore();
  });
  describe('distributeEvents', async () => {
    it("Should build the bundle", async () => {
      const bundle = await BroadcastBundle.buildBundle(business, sportEvents);

      expect(bundle).to.have.property('broadcasts');
      expect(bundle.broadcasts).to.be.an('array');
      expect(bundle.broadcasts).to.have.lengthOf(20);
      expect(bundle).to.be.an('object');

    });
    it("Should throw error if no events are provided", async () => {

      expect(BroadcastBundle.buildBundle(business, [])).to.eventually.be.rejectedWith('Non ci sono eventi da trasmettere.');

    });

  });



});
