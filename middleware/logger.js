const clc = require('cli-color');
const approot = require('app-root-path');
/** configfile */
const config = require(`${approot}/config/config.json`);
const runmode = config.runmode;

// 콘솔에 날짜/시간 남기기
const level = config[runmode].DEBUG_LEVEL;
const levelPriorities = {
  trace: 5,
  debug: 4,
  info: 3,
  warn: 2,
  error: 1,
  fatal: 0
};

function checkLevel(lvl) {
  lvl = lvl.replace(/^\s+|\s+$/gm, '');
  // lvl = $.Trim(lvl);
  lvl = lvl.toLowerCase();
  let levelint = -1;
  if (lvl === 'trace') {
    levelint = Number(levelPriorities.trace);
  } else if (lvl === 'debug') {
    levelint = Number(levelPriorities.debug);
  } else if (lvl === 'info') {
    levelint = Number(levelPriorities.info);
  } else if (lvl === 'warn') {
    levelint = Number(levelPriorities.warn);
  } else if (lvl === 'error') {
    levelint = Number(levelPriorities.error);
  } else if (lvl === 'fatal') {
    levelint = Number(levelPriorities.fatal);
  }
  return levelint;
}

const getDate = () => {
  const timezoneoffsetValue = config.timezoneoffset_value;
  return (new Date(Date.now() - new Date().getTimezoneOffset() * timezoneoffsetValue).toISOString()).replace(/Z/gm, '+09:00');
};

console.trace = function (msg, filename) {
  if (typeof (filename) !== 'undefined') {
    filename = `[${filename}] `;
  } else {
    filename = '';
  }
  if (checkLevel(level) >= Number(levelPriorities.trace)) console.log(`[${getDate()}] [TRACE] ${filename}${msg}`);
};
console.debug = function (msg, filename) {
  if (typeof (filename) !== 'undefined') {
    filename = `[${filename}] `;
  } else {
    filename = '';
  }
  if (checkLevel(level) >= Number(levelPriorities.debug)) console.log(`[${getDate()}] [DEBUG] ${filename}${msg}`);
};
console.info = function (msg, filename) {
  if (typeof (filename) !== 'undefined') {
    filename = `[${filename}] `;
  } else {
    filename = '';
  }
  if (checkLevel(level) >= Number(levelPriorities.info)) console.log(`[${getDate()}] [INFO ] ${filename}${msg}`);
};
console.warn = function (msg, filename) {
  if (typeof (filename) !== 'undefined') {
    filename = `[${filename}] `;
  } else {
    filename = '';
  }
  const warn = clc.yellow('WARN ');
  // if(checkLevel(level) >= Number(levelPriorities.warn))
  console.log(`[${getDate()}] [${warn}] ${filename}${msg}`);
};
console.error = function (msg, filename) {
  if (typeof (filename) !== 'undefined') {
    filename = `[${filename}] `;
  } else {
    filename = '';
  }
  const error = clc.red('ERROR');
  console.log(`[${getDate()}] [${error}] ${filename}${msg}`);
};
console.fatal = function (msg, filename) {
  if (typeof (filename) !== 'undefined') {
    filename = `[${filename}] `;
  } else {
    filename = '';
  }
  const fatal = clc.red('FATAL');
  console.log(`[${getDate()}] [${fatal}] ${filename}${msg}`);
  process.exit(1);
};
console.check = function (msg, filename) {
  if (typeof (filename) !== 'undefined') {
    filename = `[${filename}] `;
  } else {
    filename = '';
  }
  const check = clc.green('CHECK');
  console.log(' ');
  console.log(`[${getDate()}] [${check}] ${filename}${msg}`);
  console.log(' ');
};
