const { BroadcastReview } = require('../models/review.model');

const { Broadcast } = require('../models/broadcast.model');
const User = require("../models/user.model");

const { factory } = require('./Factory');
const faker = require('faker');

async function load(Factory) {
  Factory.define(BroadcastReview, async () => {

    const broadcast = await factory(Broadcast).create();
    const user = await factory(User, 'user').create();

    return {
      userId: user._id,
      businessId: broadcast.business,
      broadcastId: broadcast._id,
      eventId: broadcast.event,
      rating: {
        av: faker.random.number({min: 1, max: 5}),
        food: faker.random.number({min: 1, max: 5}),
        price: faker.random.number({min: 1, max: 5}),
        people: faker.random.number({min: 1, max: 5}),
        sub: faker.random.number({min: 1, max: 5}),
      },
      comment: faker.lorem.paragraph(),

    }
  })
}

module.exports = load;
