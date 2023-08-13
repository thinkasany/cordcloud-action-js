const { core } = require('@actions/core');

function now() {
  const tz = new Intl.DateTimeFormat().resolvedOptions().timeZone;
  const now = new Date().toLocaleString('en-US', { timeZone: tz });
  return now;
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

// // 使用示例
// info('This is an info message.');
// warning('This is a warning message.');
// error('This is an error message.');
// setFailed('This is a failed message.');
