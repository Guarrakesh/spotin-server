const { SportEvent } = require('../models/sportevent.model');
const { Business } = require('../models/business.model');
const { Broadcast } = require('../models/broadcast.model');
const { factory } = require('./Factory');
const faker = require('faker');
faker.locale = "it";

async function load(Factory) {
  Factory.define(Broadcast, async () => {
    const business = await factory(Business).create();
    const event = await factory(SportEvent).create();


    return {
      business: business._id,
      event: event._id,
      newsfeed: 1,
      offer: {
        title: faker.lorem.sentence(4),
        type: faker.random.arrayElement([0,1]),
        value: faker.random.number({min: 5, max: 30}),
        description: faker.lorem.paragraph(2),
      }
    }
  })
}
module.exports = load;
