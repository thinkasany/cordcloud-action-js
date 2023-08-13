const core = require('@actions/core');
const dayjs = require('dayjs')

function now() {
  const tz = new Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date().toLocaleString('en-US', { timeZone: tz });
  return dayjs(now).add(8, 'hour').format('YYYY-MM-DD HH:mm:ss');
}

function info(s = '') {
  core.info(`[${now()}] ${s}`);
}

function warning(s = '') {
  core.warning(`[${now()}] ${s}`);
}

function error(s = '') {
  core.error(`[${now()}] ${s}`);
}

function setFailed(s = '') {
  core.setFailed(`[${now()}] ${s}`);
}

module.exports = {
  info,
  warning,
  error,
  setFailed
}

// // 使用示例
// info('This is an info message.');
// warning('This is a warning message.');
// error('This is an error message.');
// setFailed('This is a failed message.');
