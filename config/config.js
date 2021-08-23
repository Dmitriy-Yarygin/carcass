const path = require('path');
const projectDirectory = path.join(
  __dirname
    .split(path.sep)
    .slice(0, -1)
    .join(path.sep)
);

const { 
  SESSION_KEY, HOST, PORT, REDIS_URL, DATABASE_URL,
} = process.env;

const getRedisConfig = () => {
  if (REDIS_URL) {
    const [ , , passwordAndHost, port] = REDIS_URL.split(':');
    const [password, host] = passwordAndHost.split('@');
    return { host, port, password };
  }
  return {};
}

const development = {
  host: HOST,
  port: PORT,
  database: DATABASE_URL,
  redis: getRedisConfig(),
  session: {
    key: SESSION_KEY, // || throw new Error('Please define SESSION_KEY env variable'),
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

module.exports = { production, development };
