import { combineReducers } from 'redux';

import room from './room/reducer';
// import search from './search/reducer';
import user from './user/reducer';

export default combineReducers({
  room,
  // search,
  user
});
