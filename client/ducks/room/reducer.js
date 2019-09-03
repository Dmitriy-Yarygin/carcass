import * as actionTypes from './actionTypes';

const INIT_STATE = {};

export default function roomsReducer(state = INIT_STATE, action) {
  const { type, payload } = action;

  switch (type) {
    case actionTypes.INIT_ROOMS:
      return { ...state, rooms: [...payload] };

    case actionTypes.ROOM_CREATE:
      return { ...state, rooms: [...state.rooms, payload] };

    case actionTypes.ROOM_UPDATE:
      let rooms = state.rooms.map(room => {
        if (room.id === payload.id) {
          return payload;
          // if (!payload.users || !Array.isArray(payload.users)) return payload;
          // usersString = payload.users.map(user => user.email).join(', ');
          // return {...payload, users: usersString};
        }
        return room;
      });
      return { ...state, rooms };

    case actionTypes.ROOM_DEL:
      rooms = state.rooms.filter(room => room.id !== payload);
      return { ...state, rooms };

    case actionTypes.ROOM_NEW_PLAYER:
      console.log('You should rewrite ROOM_NEW_PLAYER reducer');
      return state;

    default:
      return state;
  }
}
