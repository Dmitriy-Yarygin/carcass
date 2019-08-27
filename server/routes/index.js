const Router = require('koa-router');
const log = require('../helpers/logger')(__filename);

const authRouter = require('./auth');
const usersRouter = require('./users');
const roomsRouter = require('./rooms');

const router = new Router();

router
  .all('*', (ctx, next) => {
    log.silly(`${ctx.request.method}  ${ctx.request.url}`);
    return next();
  })
  .use('/api/auth', authRouter.routes())
  .use('/api/users', usersRouter.routes())
  .use('/api/rooms', roomsRouter.routes());

module.exports = router;
