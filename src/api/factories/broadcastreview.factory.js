const { BroadcastReview } = require('../models/review.model');
const { BroadcastReviewQuestion } = require('../models/review-question.model');

const { Broadcast } = require('../models/broadcast.model');
const User = require("../models/user.model");

const { factory } = require('./Factory');
const faker = require('faker');

async function load(Factory) {
  Factory.define(BroadcastReview, async () => {
    const numOfQuestions = faker.random.number({min: 2, max: 5});
    const questions = await factory(BroadcastReviewQuestion, null, numOfQuestions).create();
    const broadcast = await factory(Broadcast).create();
    const user = await factory(User, 'user').create();
    const answers = questions.map(q => ({

          questionId: q._id,
          answerId: q.offeredAnswers[
              faker.random.number({min:0, max: q.offeredAnswers.length-1 })
              ],

        }),

    );
    return {
      userId: user._id,
      businessId: broadcast.business,
      broadcastId: broadcast._id,
      eventId: broadcast.event,
      answers,
      personalRating: faker.random.number({min: 1, max: 5}),
      personalNotes: faker.lorem.paragraph(),

    }
  })
}

module.exports = load;
