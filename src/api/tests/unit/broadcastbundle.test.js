
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


describe('BroadcastBundle Model', () => {
  describe('distributeEvents', () => {

  })
});