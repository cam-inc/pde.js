'use strict';
const { run } = require('./dev-server/server');

(() => {
  try {
    run();
  } catch (e) {
    throw e;
  }

  process.on('uncaughtException', (e) => {
    throw e;
  });
})();
