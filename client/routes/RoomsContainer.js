import { connect } from 'react-redux';
import Rooms from './Rooms';
import * as roomsActions from '../ducks/room/actions';

const mapStateToProps = state => ({
  user: state.user,
  room: state.room
});

const mapDispatchToProps = dispatch => ({
  loadRooms: options => dispatch(roomsActions.loadRooms(options)),

  roomAdd: newRoom => dispatch(roomsActions.roomAdd(newRoom)),

  roomUpdate: newRoom => dispatch(roomsActions.roomUpdate(newRoom)),

  roomDelete: id => dispatch(roomsActions.roomDelete(id))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Rooms);
