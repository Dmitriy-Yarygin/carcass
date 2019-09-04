const store = require('koa-redis');

class redisStore {
  constructor() {
    if (!redisStore.instance) {
      redisStore.instance = store();
    }
    return redisStore.instance;
  }
}

module.exports = new redisStore();
