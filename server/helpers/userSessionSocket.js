const Cookie = require('cookie');
const log = require('./logger')(__filename);
const redisStore = require('../db/redis');

class UserSessionSocket {
  constructor() {
    if (!UserSessionSocket.instance) {
      this.userSocket = {};
      this.userSession = {};
    }
    return UserSessionSocket.instance;
  }

  getSid(cookie) {
    if (!cookie) return null;
    const cookiesObj = Cookie.parse(cookie);
    const { carcass_session } = cookiesObj;
    return carcass_session;
  }

  async setSid(userId, newSid) {
    const oldSid = this.userSession[userId];
    log.silly(`LOGIN old sid = ${oldSid}, new sid = ${newSid}`);
    if (oldSid && oldSid !== newSid) {
      await redisStore.destroy(oldSid);
    }
    this.userSession[userId] = newSid;
  }

  async delSid(userId) {
    const oldSid = this.userSession[userId];
    log.silly(`Logout sid = ${oldSid}`);
    if (oldSid) {
      delete this.userSession[userId];
      await redisStore.destroy(oldSid);
    }
  }
  getSocketId(userId) {
    return this.userSocket[userId];
  }
  //   setSocketId(userId, newSocketId, io) {
  //     const oldSocketId = this.userSocket[userId];
  //     if (oldSocketId && oldSocketId !== newSocketId) {
  //       const socketConnection = io.connections.get(oldSocketId);
  //       if (socketConnection) {
  //         socketConnection.disconnect(true);
  //       }
  //     }
  //     this.userSocket[userId] = newSocketId;
  //   }
  setSocketId(userId, newSocketId) {
    this.userSocket[userId] = newSocketId;
  }

  delSocketId(userId) {
    delete this.userSocket[userId];
  }
}

module.exports = new UserSessionSocket();
