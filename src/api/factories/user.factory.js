const User = require("../models/user.model");


function load(Factory, factory) {
  Factory.defineAs(User, "user", faker => ({
      email: faker.internet.email(),
      name: faker.name.firstName(),
      lastname: faker.name.lastName(),
      username: faker.internet.userName(),
      role: "user",
      password: "134567"

      })
  );

  Factory.defineAs(User, "admin" ,faker => ({
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