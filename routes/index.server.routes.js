const account = require('./controllers/account');
const order = require('./controllers/order');

module.exports = function (app) {
  app.use('/api/account', account);
  app.use('/api/order', order);
};
