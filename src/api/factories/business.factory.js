
const { Business } = require('../models/business.model');
const faker = require('faker');
faker.locale = "it";

function load(Factory, factory) {
  Factory.define(Business, async => ({
        name: faker.company.companyName(),
        address: {
          street: faker.address.streetName(),
          number: faker.random.number(),
          zip: faker.address.zipCode(),
          city: faker.address.city(),
          province: faker.address.countryCode(),
          country: faker.address.state(),
          location: {
            type: "Point",
            coordinates: [faker.address.longitude(), faker.address.latitude()]
          }
        },
        type: faker.random.arrayElement(['Pub', 'Pizzeria', 'Ristorante', 'Trattoria', 'Bar', 'Centro scommesse']),
        phone: faker.phone.phoneNumber(),
        wifi: faker.random.boolean(),
        seats: faker.random.number({min: 10, max: 250}),
        forFamilies: faker.random.boolean(),
        target: faker.random.words(),
        tvs: faker.random.number({min: 1, max: 30}),
        providers: [faker.random.arrayElement(["Sky", "DAZN", "Digitale Terrestre"]), faker.random.arrayElement(["Sky", "DAZN", "Digitale Terrestre"])],
        // businessHours:
        vat: faker.random.number({min: 100000, max: 199999}),
        tradeName: faker.company.bs(),
        spots: faker.random.number({min: 0, max: 10000}),
        cover_versions: [{width: 350, height: 350, url: faker.image.imageUrl(350, 350)}],
        

        // user: (faker) => {
        //   factory(User).create()._id,
        // }
      }),


  );
}
module.exports = load;