const account = require('./controllers/account');
const order = require('./controllers/order');
const customer = require('./controllers/customer');
const promise = require('./controllers/promise');

module.exports = function (app) {
  app.use('/api/account', account);
  app.use('/api/order', order);
  app.use('/api/customer', customer);
  app.use('/api/promise', promise);
};
