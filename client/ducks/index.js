import { combineReducers } from 'redux';

import room from './room/reducer';
import socket from './socket/reducer';
import user from './user/reducer';
import settings from './settings/reducer';

export default combineReducers({
  room,
  socket,
  user,
  settings
});
