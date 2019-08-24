const User = require('../api/models/user.model');
const RefreshToken = require('../api/models/refreshToken.model');
const { generateTokenResponse } = require('../api/controllers/v1/auth.controller');
const { UserInputError } = require('apollo-server');

exports.authResolvers = {
  Mutation: {

  }
}