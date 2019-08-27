const log = require('../helpers/logger')(__filename);
const Router = require('koa-router');
const usersManager = require('../db/managers/users');

const router = new Router();

router.param('id', async (id, ctx, next) => {
  const isUserExist = await usersManager.isUserExist(ctx.params.id);
  ctx.assert(isUserExist, 400, `The user with id = ${id} not found.`);
  return next();
});

router.post('/', async (ctx, next) => {
  const record = ctx.request.body;
  ctx.assert(record.email, 400, 'You should enter email');
  ctx.assert(record.password, 400, 'You should enter password');
  const isEmailRegistered = await usersManager.isEmailRegistered(record.email);
  if (isEmailRegistered) {
    // ctx.throw(400, 'User with such email alredy exist');
    return (ctx.body = {
      success: false,
      error: { detail: `User with such email alredy exist` }
    });
  }
  ctx.body = await usersManager.registrate(record);
});

// routes below this block are only for logined users
router.use(async (ctx, next) => {
  ctx.assert(ctx.session.user, 401, 'User not found. Please login!');
  return next();
});

// routes below are only for logined users
router.get('/', async (ctx, next) => {
  ctx.body = await usersManager.read();
});

router.get('/:id(\\d+)', async (ctx, next) => {
  ctx.body = await usersManager.read(ctx.params.id);
});

router.put('/:id(\\d+)', async (ctx, next) => {
  ctx.body = await usersManager.update(ctx.params.id, ctx.request.body);
});

router.del('/:id(\\d+)', async (ctx, next) => {
  ctx.body = await usersManager.del(ctx.params.id);
});

module.exports = router;
