const express = require('express');
const url = require('url');
const approot = require('app-root-path');
const favicon = require('serve-favicon');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const routes = require(`${approot}/routes/index`);
// const routes = require('next-routes')();
const server = require(`${approot}/routes/index.server.routes`);
/** set cors  */
const corsOptions = { origin: true, credentials: true };
const cors = require('cors')(corsOptions);
/** set session */
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const sessionIndex = require('../routes/session');
const sessionSecret = '_ibricks_';

/* Connect DB */
const sequelize = require(`${approot}/db/models`).sequelize;
sequelize.sync();

/** configfile */
const configfile = require(`${approot}/config/config.json`);
const config = require(`${approot}/config/config`);
const runmode = configfile.runmode;

const app = express();

// global.jobs = new Map();

/** set console log override */
require(`${approot}/middleware/logger`);

/** session config */
const sess = {
  resave: false,
  saveUninitialized: false,
  secret: sessionSecret,
  name: 'sessionId',
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: config.SESSION_EXPIRE * 24
  },
  store: new FileStore()
};

module.exports = function () {
  app.use(expressValidator());
  app.use(session(sess));
  app.use(cors);

  /** * static-public */
  app.use(express.static(approot + '/build'));

  /** * 로그 포맷 변경 */
  if (runmode === 'prod') {
    const timezoneoffsetValue = configfile.timezoneoffset_value;
    app.use(logger((tokens, req, res) => [
      `[${new Date(Date.now() - new Date().getTimezoneOffset() * timezoneoffsetValue).toISOString()}]`,
      tokens.method(req, res),
      tokens.status(req, res),
      tokens.url(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')));
  }

  app.use(bodyParser());
  app.use(bodyParser.raw({
    extended: true,
    parameterLimit: 100000,
    limit: 2048 * 2048 * 10
  }));
  app.use(bodyParser.urlencoded({
    extended: true,
    parameterLimit: 100000,
    limit: 2048 * 2048 * 10
  }));
  app.use(bodyParser.json({
    extended: true,
    parameterLimit: 100000,
    limit: 2048 * 2048 * 10
  }));

  /** * view engine setup */
  app.set('views', `${approot}/views`);
  app.set('view engine', 'ejs'); // jade, ejs
  // app.use(favicon(path.join(__dirname, '../public/images', 'favicon.ico')));
  app.use(cookieParser());

  /** set middleware */
  app.use('/', routes);

  app.get(['/:Left'], (req, res) => {
    res.sendFile(path.join(`${approot}/build/index.html`));
  });

  server(app);
  /**
   * error handler
   * catch 404 and forwarding to error handler */
  app.use('*', (req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
  });

  /**
   * production error handler
   * no stacktraces leaked to user */
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send(err);
  });
  return app;
};
