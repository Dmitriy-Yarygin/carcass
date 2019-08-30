const log = require('../helpers/logger')(__filename);
const Router = require('koa-router');
const usersManager = require('../db/managers/users');

const router = new Router();

router.post('/login', async (ctx, next) => {
  // log.silly(ctx.session);
  const { email, password } = ctx.request.body;
  ctx.assert(email, 400, 'You should enter email');
  ctx.assert(password, 400, 'You should enter password');
  const result = await usersManager.login(ctx.request.body);
  ctx.assert(result.success, 401, result.msg);
  ctx.session.user = result.user;
  ctx.body = result;
});

router.post('/logout', async (ctx, next) => {
  ctx.session = null;
  ctx.body = { success: true, msg: 'User logout successfuly.' };
  log.verbose('User logout successfuly.');
});

module.exports = router;
