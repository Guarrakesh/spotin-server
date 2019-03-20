const faker = require('faker');
faker.locale = "it";
const { BroadcastReviewQuestion } = require('../models/review-question.model');


function load(Factory, factory) {
  Factory.define(BroadcastReviewQuestion, async => {

    const offeredAnswersLength = Math.round(faker.random.number({min: 2, max: 5}));
    let offeredAnswers = [];
    for (let i=0; i<offeredAnswersLength; i++) {
      offeredAnswers[i] = {
        text: faker.lorem.sentence(),
        value: faker.random.number({min: 1, max: 5})
      }
    }
    return {
      text: faker.lorem.sentence(),
      multiplier: faker.random.number({min: 1, max: 3}),
      order: faker.random.number({min: 1, max: 10}),
      value: faker.random.number({min:1, max: 5}),
      offeredAnswers,

    }

  });
}
module.exports = load;
