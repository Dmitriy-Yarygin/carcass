import * as actionTypes from './actionTypes';
import { optionsToGetParams, fetchAndCatch } from '../../common/helpers';

export const login = user => ({
  type: actionTypes.LOGIN,
  payload: user
});

export const logout = () => ({
  type: actionTypes.LOGOUT
});

export const loadUsers = options => dispatch => {
  const params = optionsToGetParams(options);
  return fetchAndCatch(`/api/users${params}`).then(answer => {
    if (answer.success) {
      dispatch(usersInit(answer.result));
    } else {
      console.error(answer);
    }
    return answer.success;
  });
};

export const usersInit = usersArray => ({
  type: actionTypes.INIT_USERS,
  payload: usersArray
});

export const userUpdate = ({ id, ...editedUser }) => dispatch => {
  return fetchAndCatch(`/api/users/${id}`, {
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
  return fetchAndCatch(`/api/users/${id}`, { method: 'DELETE' }).then(
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

/*
loadUsers: options =>
    dispatch(usersActions.loadUsers(options)),

  userAdd: newUser =>
    dispatch(usersActions.userAdd(newUser)),

  userUpdate: newUser =>
    dispatch(usersActions.userUpdate(newUser)),

  userDelete: id => dispatch(usersActions.userDelete(id)),
*/
