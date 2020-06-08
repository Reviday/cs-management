const express = require('express');
const router = express.Router();
const approot = require('app-root-path');
const util = require(`${approot}/util/util`);
const config = require(`${approot}/config/config`);
const configfile = require(`${approot}/config/config.json`);


// app.get('/dashboard', (req, res) => {
//   console.log(3555);
//   console.log('=====>', `${approot}/build/index.html`);
//   res.sendFile(path.join(`${approot}/build/index.html`));
// });

// app.get('dashboard', (req, res) => {
//   console.log(3555);
//   res.sendFile(path.join(`${approot}/build/index.html`));
// });

const sessionCheck = (req, res, url, isFirst) => {
  if (req.method === 'POST') req.query = req.body;
  const reqParam = req.query;
  const session = req.session;
  const isFirstAccess = isFirst || false;
  util.setInitValue(reqParam, session);
  return res.render(url, reqParam);
};


module.exports = router;
