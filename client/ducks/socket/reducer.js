import * as actionTypes from './actionTypes';

const INIT_STATE = { connected: false };

export default function roomsReducer(state = INIT_STATE, action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.SET_FLAG:
      return { ...state, connected: payload };

    default:
      return state;
  }
}
