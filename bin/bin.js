/** bin.js */
const approot = require('app-root-path');
const config = require(`${approot}/config/config`);
const express = require(approot + '/config/express-config');
const app = express();

app.set('port', process.env.PORT || config.APP_HOST.PORT);

const server = app.listen(app.get('port'), () => {
  console.info(`Express server listening on port ${server.address().port}`);
});
