import { combineReducers } from 'redux';

import room from './room/reducer';
import socket from './socket/reducer';
import user from './user/reducer';

export default combineReducers({
  room,
  socket,
  user
});
