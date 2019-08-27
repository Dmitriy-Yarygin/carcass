import * as actionTypes from './actionTypes';
import { optionsToGetParams, fetchAndCatch } from '../../common/helpers';

export const loadRooms = options => dispatch => {
  const params = optionsToGetParams(options);
  return fetchAndCatch(`/api/rooms${params}`).then(answer => {
    if (answer.success) {
      dispatch(roomsInit(answer.result));
    } else {
      console.error(answer);
    }
    return answer.success;
  });
};

export const roomsInit = roomsArray => ({
  type: actionTypes.INIT_ROOMS,
  payload: roomsArray
});
/*
export const userUpdate = ({ id, ...editedUser }) => dispatch => {
  return fetchAndCatch(`/api/rooms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(editedUser)
  }).then(answer => {
    if (answer.success) {
      dispatch(userUpdate2(answer.result));
    } else {
      console.error(answer);
    }
    return answer.success;
  });
};

export const userUpdate2 = editedUser => ({
  type: actionTypes.USER_UPDATE,
  payload: editedUser
});

export const userDelete = id => dispatch => {
  return fetchAndCatch(`/api/rooms/${id}`, { method: 'DELETE' }).then(
    answer => {
      if (answer.success) {
        dispatch(userDelete2(id));
      } else {
        console.error(answer);
      }
      return answer.success;
    }
  );
};

export const userDelete2 = id => ({
  type: actionTypes.USER_DEL,
  payload: id
});
*/
