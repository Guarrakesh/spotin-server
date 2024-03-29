const User = require("../models/user.model");

const faker = require('faker');
faker.locale = "it";
function load(Factory, factory) {
  Factory.defineAs(User, "user", async => ({
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      username: faker.internet.userName(),
      role: "user",
      password: "134567"

      })
  );

  Factory.defineAs(User, "admin" , async () => ({
        email: faker.internet.email(),
        password: "123456",
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
        username: faker.internet.userName(),
        role: "admin",

      })
  );
}



module.exports = load;