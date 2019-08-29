'use strict';

const session = require('koa-session');
const redisStore = require('koa-redis');
const Koa = require('koa');
const Webpack = require('webpack');
const koaWebpack = require('koa-webpack');
const koaBody = require('koa-body');
const serve = require('koa-static');
const router = require('./routes');
const config = require('../config')();
const log = require('./helpers/logger')(__filename);
const path = require('path');
const carcaSockets = require('./sockets');

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

app.use(koaBody({ multipart: true }));

app.keys = [config.session.key];
app.use(session({ ...config.session, store: redisStore() }, app));
// app.use(session(config.session, app));

app.use(serve(config.path.static));

app.use(router.routes());

carcaSockets(app);

if (config.env === 'development') {
  const webpackConfig = require('../webpack/webpack.config.dev');
  const compiler = Webpack(webpackConfig);
  koaWebpack({ compiler, hotClient: false }).then(middleware => {
    app.use(middleware).use(async ctx => {
      const filename = path.resolve(webpackConfig.output.path, 'index.html');
      ctx.response.type = 'html';
      ctx.response.body = middleware.devMiddleware.fileSystem.createReadStream(
        filename
      );
    });
  });
}
////////////////////////////////////////////////////////////
app.on('error', (err, ctx) => {
  log.error(err);
});

module.exports = app;
