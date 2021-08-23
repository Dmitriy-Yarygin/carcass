const path = require('path');
const projectDirectory = path.join(
  __dirname
    .split(path.sep)
    .slice(0, -1)
    .join(path.sep)
);

const development = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
  },
  session: {
    key: process.env.SESSION_KEY, // || throw new Error('Please define SESSION_KEY env variable'),
    maxAge: 1000 * 60 * 60 * 8
  },
  path: {
    build: path.join(projectDirectory, 'build'),
    static: path.join(projectDirectory, 'static')
  },
  logs: {
    consoleLogsLevel: 'silly',
    path: path.join(projectDirectory, 'logs'),
    errorsLogFileLevel: 'error',
    commonLogFileLevel: 'info',
    errorsLogFileName: 'error.log',
    commonLogFileName: 'combined.log'
  }
};

const production = { ...development };
// for heroku
const { REDIS_URL, DATABASE_URL } = process.env;
if (REDIS_URL) {
  const [ , , passwordAndHost, port] = REDIS_URL.split(':');
  const [password, host] = passwordAndHost.split('@');
  production.redis = { host, port, password };
}
if (DATABASE_URL) {
  const [user, passwordHost, portDatabase ] = DATABASE_URL.split('://')[1].split(':');
  const [password, host] = passwordHost.split('@');
  const [port, database] = portDatabase.split('/');
  production.database = { host, port, database, user, password };
}

module.exports = { production, development };
