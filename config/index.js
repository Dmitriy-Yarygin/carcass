require('dotenv').config()

const config = require('./config');

module.exports = function () {
  const env = process.env.NODE_ENV || 'development';
  return { env: env, ...config[env]};
};
