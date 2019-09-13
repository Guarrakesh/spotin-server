const UserTransaction = require('../api/services/userTransactions');

exports.init = function() {
  const userTransaction = new UserTransaction();
};