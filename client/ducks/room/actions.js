import * as actionTypes from './actionTypes';
import { optionsToGetParams, fetchAndCatch } from '../../common/helpers';

export const loadRooms = options => dispatch => {
  const params = optionsToGetParams(options);
  return fetchAndCatch(`/api/rooms${params}`).then(answer => {
    if (answer.success) {
      dispatch(roomsInit(answer.result));
    }
    return answer;
  });
};

export const roomsInit = roomsArray => ({
  type: actionTypes.INIT_ROOMS,
  payload: roomsArray
});

// ROOM_CREATE
export const roomAdd = newRoom => dispatch => {
  return fetchAndCatch(`/api/rooms/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newRoom)
  }).then(answer => {
    if (answer.success) {
      dispatch(roomCreate(answer.result));
    }
    return answer;
  });
};

export const roomCreate = newRoom => ({
  type: actionTypes.ROOM_CREATE,
  payload: newRoom
});

export const roomUpdate = ({ id, ...editedRoom }) => dispatch => {
  return fetchAndCatch(`/api/rooms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editedRoom)
  }).then(answer => {
    if (answer.success) {
      dispatch(roomUpdate2(answer.result));
    }
    return answer;
  });
};

export const roomUpdate2 = editedRoom => ({
  type: actionTypes.ROOM_UPDATE,
  payload: editedRoom
});

export const roomDelete = id => dispatch => {
  return fetchAndCatch(`/api/rooms/${id}`, { method: 'DELETE' }).then(
    answer => {
      if (answer.success) {
        dispatch(roomDelete2(id));
      }
      return answer;
    }
  );
};

export const roomDelete2 = id => ({
  type: actionTypes.ROOM_DEL,
  payload: id
});
