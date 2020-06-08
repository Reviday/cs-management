const express = require('express');
const router = express.Router();
const path = require('path');
const filename = path.basename(__filename);
const approot = require('app-root-path');
const Util = require(`${approot}/util/util`);
const moment = require('moment');
const config = require(`${approot}/config/config`);
const request = require('request');
// const User = require(`${approot}/routes/models/user.model`);
// const Domain = require(`${approot}/routes/models/domain.model`);

// elapsed time
let elapsed = {};
let start;
let end;

const result_body = {};

/** [COMMON]--S */
/** [CHECK] Request parameter 체크 */
const paramCheck = (req, res) => new Promise((resolve, reject) => {
  Util.req_param('[Session] set Session', req, filename);
  elapsed = {};
  start = new Date();
  if (req.method === 'POST') req.query = req.body;
  const err = req.validationErrors();
  if (err) {
    err.status = 400;
    return res.status(400).send(Util.res_err(req, 400, err[0].msg));
  }
  req.query.sessionKey = req.query.sessionKey || '';
  req.query.userId = req.query.userId || '';
  req.query.domainId = req.query.domainId || '';
  req.query.userInfo = req.query.userInfo || {};

  // req.checkQuery('userId', 'userId required').notEmpty(); // user id
  return resolve;
});
/** [COMMON]--E */


/** [GET] 사용자 정보 조회 */
const getUserInfo = (req, res) => new Promise((resolve, reject) => {
  // User.findUser(req.query.userId, []).then((result) => {
  //   resolve(result.hits.hits[0]._source);
  // }, err => Util.sendResult(req, res, 'error', err));
});


/** [SET] Session 값 설정. */
const setSession = (req, res, userInfo, domainList) => new Promise((resolve, reject) => {
  // const session = req.session;
  // const lastWorkDomain = userInfo.last_work_domain;
  // let isExistDomain = false;
  //
  // if (domainList.length > 0) {
  //   domainList.map((x) => {
  //     if (lastWorkDomain === x._id) {
  //       isExistDomain = true;
  //     }
  //   });
  // }
  //
  // // [SET] domainId = 접속 도메인 Id.
  // if (isExistDomain) {
  //   session.domainId = userInfo.last_work_domain;
  // } else if (domainList.length > 0) {
  //   session.domainId = domainList[0]._id;
  // } else {
  //   session.domainId = '';
  // }
  //
  // session.key = req.query.sessionKey;
  // session.userId = userInfo.user_id;
  // session.fullname = userInfo.fullname;
  // session.isMaster = userInfo.is_master;
  // session.authDomain = userInfo.auth_domain || '';
  // session.authMenu = userInfo.auth_menu;
  // session.lastWorkDomain = userInfo.last_work_domain;
  //
  // res.cookie('authDomain', userInfo.auth_domain);
  // res.cookie('authMenu', userInfo.auth_menu);
  // return resolve();
});

/** [ROUTER GET LISTEN] */
router.get('/', async (req, res) => {
  paramCheck(req, res);
  const userInfo = await getUserInfo(req, res);
});

/** [ROUTER POST LISTEN] */
router.post('/', async (req, res) => {
  Util.req_param('[Session] Set Session', req, filename);
  Util.param_check(req, res, filename, []);
  const req_param = req.query;
  const session = req.session;

  // if (req.session.key) {
  //   console.debug(`ok session valid:${req.session.key}`);
  //
  //   util.setInitValue(req_param, session);
  //   res.render('index', req_param);
  //   return resolve();
  // }
  //

  try {
    if (session.key) {
      await Util.setInitValue(req_param, session);
      return res.render('index', req_param);
    }
    // const userInfo = await getUserInfo(req, res);
    await setSession(req, res, userInfo, domainList);
    await Util.setInitValue(req_param, session);
    // if (session.authDomain == '' || session.domainId == '') {
    //   return res.redirect('/domainList');
    // } else {
    //   return res.redirect('/');
    // }
    return res.redirect('/');
  } catch (err) {
    return Util.sendResult(req, res, 'error', err);
  }
});

/** [DESTROY] session */
const destroySession = (req, res) => new Promise((resolve, reject) => {
  req.session.destroy((err) => {
    if (err) {
      return reject(err);
    }
    return resolve();
  });
  return resolve();
});

/** [ROUTER GET LISTEN] */
router.get('/destroy', async (req, res) => {
  return Util.sendResult(req, res, 'error', err, err.filename);
});

/** [ROUTER POST LISTEN] */
router.post('/destroy', async (req, res) => {
  return Util.sendResult(req, res, 'error', err, err.filename);
});

module.exports = router;
