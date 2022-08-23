const clc = require('cli-color');

const info = (msg) => {
  console.info(clc.greenBright(`[INFO] ${msg}`));
};

const error = (msg) => {
  console.error(clc.redBright(`[ERROR] ${msg}`));
};

module.exports = {
  info,
  error,
};
