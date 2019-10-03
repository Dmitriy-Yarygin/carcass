const store = require('koa-redis');
const config = require('../../config')();

class redisStore {
  constructor() {
    if (!redisStore.instance) {
      // redisStore.instance = store(config.redis || {});
      console.log(config.redis);
      redisStore.instance = store();
    }
    return redisStore.instance;
  }
}

module.exports = new redisStore();
