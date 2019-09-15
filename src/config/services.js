const UserTransaction = require('../api/services/UserTransactionService');

exports.init = function() {
  const userTransaction = new UserTransaction();
};