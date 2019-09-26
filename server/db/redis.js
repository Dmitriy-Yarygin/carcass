const store = require('koa-redis');
const config = require('../../config')();

class redisStore {
  constructor() {
    if (!redisStore.instance) {
      redisStore.instance = store(config.redis || {});
    }
    return redisStore.instance;
  }
}

module.exports = new redisStore();
