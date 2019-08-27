import * as actionTypes from './actionTypes';

const INIT_STATE = { login: null, redirectToReferrer: false };

export default function usersReducer(state = INIT_STATE, action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.INIT_ROOMS:
      return { ...state, rooms: [...payload] };

    // case actionTypes.USER_UPDATE:
    //   let users = state.users.map(user => {
    //     if (user.id === payload.id) {
    //       return payload;
    //     }
    //     return user;
    //   });
    //   return { ...state, users };

    // case actionTypes.USER_DEL:
    //   users = state.users.filter(user => user.id !== payload);
    //   return { ...state, users };

    default:
      return state;
  }
}
