// const log = require('../../helpers/logger')(__filename);
const Users_rooms = require('../models/Users_rooms');

// function makeAnswerWithError(detail) {
//   log.warn(detail);
//   return { success: false, error: { detail } };
// }

const getUserRooms = async userId => {
  const rooms = await Users_rooms.query()
    .where('user_id', userId)
    .select('room_id');
  return rooms;
};

module.exports = { getUserRooms };
