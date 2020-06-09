// util.js
const approot = require('app-root-path');
const path = require('path');
const filename = path.basename(__filename);
const config = require(`${approot}/config/config`);
const configfile = require(`${approot}/config/config.json`);
const crypto = require('crypto');
const runmode = configfile.runmode;
const moment = require('moment');

/** [SET] response send ERROR */
module.exports.res_err = function (req, statusCode, err) {
  if (req === undefined);
  else {
    // control
  }
  return { status: statusCode, message: err.message, stack: err.stack };
};

/** [SET] param send ERROR */
module.exports.res_param_err = function (req, statusCode, err) {
  const messageObj = [];
  if (err === undefined);
  else {
    err.forEach((item) => {
      messageObj.push(item.msg);
    });
  }
  return { status: statusCode, message: messageObj };
};


/** [CHECK] Request Parameter Check */
module.exports.param_check = (req, res, fileName, param) => {
  this.reqParam(`[${req.paramStatus}]Info`, req, fileName);
  if (req.method === 'POST') req.query = req.body;
  console.log(req.body.mode);

  const errStatus = { status: false, errMsg: '' };
  param.forEach((item, idx) => {
    req.checkQuery(item, `${item} required`).notEmpty();
  });
  const err = req.validationErrors();
  if (err) {
    console.error(`validationErrors : ${err[0].msg}`, fileName);
    errStatus.status = true;
    errStatus.errMsg = this.res_param_err(req, 400, err);
    err.status = 400;
    return res.status(400).send(this.res_err(req, 400, err[0].msg));
  }
  return errStatus;
};

/** [SET] response send SUCCESS */
module.exports.res_ok = async function (rows) {

  console.trace(`[send body] ${JSON.stringify(rows)}`);
  // console.log(ret);
  return {status: 200, reason: 'OK', data: rows};
};


/** [LOG] Request Parameter */
module.exports.reqParam = async function (urlname, req, fileName) {
  console.debug('---------------------------------------', fileName);
  console.debug(`${urlname} / (method:${req.method})`, fileName);
  console.debug('---------------------------------------', fileName);
};

/** [LOG] Request checktime */
module.exports.request_info = (name, start) => new Promise((resolve, reject) => {
  // elapsed time
  const end = new Date();
  elapsed[name] = `${end - start} ms`;
  console.debug(`[Request] - ${name} [${elapsed[name]}]`);
  return resolve();
});

/** [SET] request Parameter 설정 router => view */
module.exports.setInitValue = (reqParam, session) => new Promise((resolve, reject) => {
  if (reqParam.domainId !== undefined && reqParam.domainId !== session.domainId) {
    if (session.authDomain !== '') {
      const authDomainList = session.authDomain.split(',');
      if (authDomainList.indexOf(reqParam.domainId) > -1 || session.authDomain === '_ALL_') session.domainId = reqParam.domainId;
    }
  }
  const siteContext = (configfile[runmode].SITE_CONTEXT !== '') ? configfile[runmode].SITE_CONTEXT + '/' : '';
  // User Info
  reqParam.userId = session.userId;
  reqParam.fullname = session.fullname;
  reqParam.encryptKey = session.encryptKey;
  reqParam.encryptIv = session.encryptIv;
  reqParam.isMaster = session.isMaster;
  reqParam.sessionKey = session.key;

  resolve();
}, err => this.sendResult(req, res, 'error', err));

/** [SET] 초기값 설정. */
module.exports.setDefaultValue = function (obj, reqParam, defValue) {
  if (reqParam[obj] === undefined) {
    reqParam[obj] = defValue;
  }
};

/** [GET] 암호화 키 발급. */
module.exports.getEncryptKey = (reqParam, session) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buf) => {
      if (err) reject();
      session.encryptKey = buf.toString('hex');
      reqParam.encryptKey = buf.toString('hex');

      crypto.randomBytes(16, (_err, _buf) => {
        if (_err) reject();
        // var ivstring = buf.toString('hex').slice(0, 16);
        session.encryptIv = _buf.toString('hex');
        reqParam.encryptIv = session.encryptIv;
        resolve();
      });
    });
  });
};

/** [GET] 현재 시간. */
module.exports.getDate = function () {
  const timeOffset = configfile.timezoneoffset_value;
  // const date = new Date(Date.now() - new Date().getTimezoneOffset() * timeOffset).toISOString();
  const date = moment().toISOString();
  return date;
};

/** [SEND] 결과 응답. */
module.exports.sendResult = async (req, res, status, err, fileName) => {
  res.set({ 'Content-Type': 'application/json; charset=utf-8' });

  // console.log('status:::::', status);
  if (status === 'success') {
    // console.log('req.query.body:::', this.res_ok(req, { data: req.query.body }));
    res.send(await this.res_ok(req, { data: req.query.body }));
    // res.send(await this.res_ok(req, req.query.body));
  } else {
    // res.send(this.res_err(req, 400, err[0].msg));
    err.message = `[${fileName}] ${err.message}`;
    res.send(await this.res_err(req, 400, err));
  }
};

module.exports.sendResultTp2 = async (req, res, status, err) => {
  res.set({ 'Content-Type': 'application/json; charset=utf-8' });
  if (status === 'success') {
    res.send(await this.res_ok(req, { data: req.query.body }));
  } else {
    res.send(await this.res_err(req, 400, err));
  }
};

module.exports.errorlog = (err, fileName) => {
  console.error(err, err.stack, fileName);
  // write error file
  // error level
};

module.exports.replaceAll = (str, searchStr, replaceStr) => {
  return str.split(searchStr).join(replaceStr);
};

/** SET error_message */
module.exports.setError = {
  setMessage: (payloadSet, errorMsg, fileName, err) => {
    let error;
    if (err === undefined) {
      error = new Error();
      error.status = 400;
      error.message = errorMsg;
      error.filename = fileName;
    } else {
      error = err;
    }
    payloadSet.response_type = 'error';
    const fillObj = {
      response_type: 'ERROR',
      speech: [{ text: errorMsg }],
      template_id: '',
      messages: []
    };
    payloadSet.output_format.data.result.fulfillment = fillObj;
    throw error;
  },
  chkError: (payloadSet, res) => {
    let retFlag = true;
    if (payloadSet.output_format.status.code !== 200) {
      common.res_send(res);
      retFlag = false;
    }
    return retFlag;
  }
};


module.exports.addComma = function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
