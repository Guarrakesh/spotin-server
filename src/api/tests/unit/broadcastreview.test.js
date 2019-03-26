const chai = require('chai');
const sinon = require('sinon');
const { BroadcastReview } = require('../../models/review.model');
const { factory } = require('../../factories/Factory');
const { googleMapsClient } = require('../../utils/google');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;

const sandbox = sinon.createSandbox();
describe.skip('BroadcastReview Model', () => {
  beforeEach(async () => {
    await BroadcastReview.deleteMany();
    sandbox.stub(googleMapsClient, "geocode")
        .returns({ asPromise: () => new Promise(resolve => resolve({}) ) });

  });
  afterEach(async () => {

    sandbox.restore();
  });


  describe('denormalize', () => {
    it('should add denormalized fields to the answers', async () => {
      const broadcastReview = await factory(BroadcastReview).make();
      broadcastReview.denormalize();
      expect(broadcastReview.answers).to.be.an('array');

      for (const answer of broadcastReview.answers) {
        expect(answer).to.have.property('answerText');
        expect(answer).to.have.property('answerValue');
        expect(answer).to.have.property('questionText');
        expect(answer).to.have.property('questionMultiplier');
      }

    });
  })

  describe('calculateRating', () => {
    it('Should return a number', async () => {
      const broadcastReview = await factory(BroadcastReview).make();
      const rating = await broadcastReview.calculateRating();
      expect(rating).to.be.a('number');
    });

    it('Should return number between 1 and 5', async () => {
      const broadcastReview = await factory(BroadcastReview).create();

      const rating = await broadcastReview.calculateRating();
      expect(rating < 5).to.be.true;
      expect(rating > 1).to.be.true;

    })
  })
});
