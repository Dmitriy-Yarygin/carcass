import * as actionTypes from './actionTypes';

export const loadRooms = roomsArray => ({
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
