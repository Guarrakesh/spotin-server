const bcrypt = require('bcryptjs');
const User = require('../../../models/user.model');
const mongoose = require('mongoose');
exports.insertUser = async () => {
  const password = '123456';
  const passwordHashed = await bcrypt.hash(password, 1);
  let user = new User({
    _id: new mongoose.Types.ObjectId(),
    email: 'jonsnow@gmail.com',
    password: passwordHashed,
    name: 'Jon Snow',
    username: "__jonsnow"
  });
  await user.save();
  return user;
};
exports.insertAdmin = async () => {
  const password = '123456';
  const passwordHashed = await bcrypt.hash(password, 1);
  let adminUser =  new User({
    _id: new mongoose.Types.ObjectId(),
    email: 'branstark@gmail.com',
    password: passwordHashed,
    name: 'Bran Stark',
    role: 'admin',
    username: "branstark"
  });
  await adminUser.save();
  return adminUser;
};
