import * as actionTypes from './actionTypes';

const INIT_STATE = {
  isTileSpotsVisible: false,
  isSpotsKeysVisible: false
};

export default function roomsReducer(state = INIT_STATE, action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.INIT_SETTINGS:
      return { ...INIT_STATE };

    case actionTypes.SETTINGS_UPDATE:
      return { ...state, ...payload };

    default:
      return state;
  }
}

/*

export const INIT_SETTINGS = 'INIT_SETTINGS';
export const SETTINGS_UPDATE = 'SETTINGS_UPDATE';

*/
