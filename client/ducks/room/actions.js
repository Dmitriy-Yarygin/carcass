import * as actionTypes from './actionTypes';
import { optionsToGetParams, fetchAndCatch } from '../../common/helpers';

export const loadRooms = roomsArray => dispatch => {
  console.log('33333333333333333');
  console.log(roomsArray);

  // if (roomsArray.length) {
  //   roomsArray.forEach((room, i) => {
  //     if (room.users.length) {
  //       roomsArray[i].users = room.users.map(user => user.email).join(', ');
  //     }
  //   });
  // }

  dispatch(roomsInit(roomsArray));
};

export const roomsInit = roomsArray => ({
  type: actionTypes.INIT_ROOMS,
  payload: roomsArray
});

export const roomCreate = newRoom => ({
  type: actionTypes.ROOM_CREATE,
  payload: newRoom
});

export const roomNewPLayer = player => ({
  type: actionTypes.ROOM_NEW_PLAYER,
  payload: player
});

export const roomUpdate = editedRoom => ({
  type: actionTypes.ROOM_UPDATE,
  payload: editedRoom
});

export const roomDel = id => ({
  type: actionTypes.ROOM_DEL,
  payload: id
});
