const account = require('./controllers/account');

module.exports = function (app) {
  app.use('/api/account', account);
};
