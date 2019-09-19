import * as actionTypes from './actionTypes';

export const resetSettings = () => ({
  type: actionTypes.INIT_SETTINGS
});

export const settingsUpdate = payload => ({
  type: actionTypes.SETTINGS_UPDATE,
  payload
});

/*

export const INIT_SETTINGS = 'INIT_SETTINGS';
export const SETTINGS_UPDATE = 'SETTINGS_UPDATE';

*/
