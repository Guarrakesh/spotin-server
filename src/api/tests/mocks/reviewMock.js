const faker = require('faker');

module.exports = {

  rating: {
    av: faker.random.number({min: 1, max: 5}),
    food: faker.random.number({min: 1, max: 5}),
    price: faker.random.number({min: 1, max: 5}),
    people: faker.random.number({min: 1, max: 5}),
    sub: faker.random.number({min: 1, max: 5}),
  },
  comment: faker.lorem.sentence(),

};
