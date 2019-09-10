const log = require('../helpers/logger')(__filename);
const Router = require('koa-router');
const roomsManager = require('../db/managers/rooms');

const router = new Router();

router.param('id', async (id, ctx, next) => {
  const isRoomExist = await roomsManager.isRoomExist(ctx.params.id);
  ctx.assert(isRoomExist, 400, `The room with id = ${id} not found.`);
  return next();
});

router.post('/', async (ctx, next) => {
  const { user } = ctx.session;
  ctx.assert(user && user.id, 401, 'User not found. Please login!');
  const record = ctx.request.body;
  ctx.assert(record.name, 400, 'You should enter name for a room');
  ctx.body = await roomsManager.create(record, user.id);
});

// routes below this block are only for logined users
// router.use(async (ctx, next) => {
//   ctx.assert(ctx.session.user, 401, 'User not found. Please login!');
//   return next();
// });

// routes below are only for logined users
router.get('/', async (ctx, next) => {
  ctx.body = await roomsManager.read();
});

router.get('/:id(\\d+)', async (ctx, next) => {
  ctx.body = await roomsManager.read(ctx.params.id);
});

router.put('/:id(\\d+)', async (ctx, next) => {
  const { user } = ctx.session;
  ctx.assert(user, 401, 'User not found. Please login!');
  const { name } = ctx.request.body;
  ctx.body = await roomsManager.update(ctx.params.id, { name }, user.id);
});

router.del('/:id(\\d+)', async (ctx, next) => {
  ctx.body = await roomsManager.del(ctx.params.id);
});

module.exports = router;
