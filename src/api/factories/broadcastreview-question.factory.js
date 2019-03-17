const faker = require('faker');
faker.locale = "it";
const { BroadcastReviewQuestion } = require('../models/review-question.model');


function load(Factory, factory) {


  Factory.define(BroadcastReviewQuestion, async => {


    return {
      text: faker.lorem.sentence(),
      value: faker.random.number({min:1, max: 5}),

    }

  });
}
module.exports = load;
