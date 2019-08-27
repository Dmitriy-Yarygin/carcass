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
        }
        return room;
      });
      return { ...state, rooms };

    case actionTypes.ROOM_DEL:
      rooms = state.rooms.filter(room => room.id !== payload);
      return { ...state, rooms };

    default:
      return state;
  }
}
