const config = require('../../config')();
const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, colorize, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

module.exports = function makeLogger(scriptPath) {
  const loggingTransports = [];
  if (config.logs) {
    if (config.logs.consoleLogsLevel) {
      loggingTransports.push(
        new transports.Console({ level: config.logs.consoleLogsLevel })
      );
    }
    if (config.logs.path) {
      if (config.logs.errorsLogFileName) {
        loggingTransports.push(
          new transports.File({
            filename: path.join(
              config.logs.path,
              config.logs.errorsLogFileName
            ),
            level: config.logs.errorsLogFileLevel || 'error'
          })
        );
      }
      if (config.logs.commonLogFileName) {
        loggingTransports.push(
          new transports.File({
            filename: path.join(
              config.logs.path,
              config.logs.commonLogFileName
            ),
            level: config.logs.commonLogFileLevel || 'info'
          })
        );
      }
    }
  }

  return createLogger({
    format: combine(
      label({ label: path.relative(__dirname, scriptPath) }),
      colorize({ all: true }),
      timestamp(),
      format.splat(),
      myFormat
    ),
    transports: loggingTransports
  });
};
