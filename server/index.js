'use strict';

const log = require('./helpers/logger')(__filename);
const config = require('../config')();
const app = require('./app');
const dbConnection = require('./db');

app.listen(config.port, () => {
  log.info(`Server listening on port: ${config.port} in ${config.env} mode`);
});
