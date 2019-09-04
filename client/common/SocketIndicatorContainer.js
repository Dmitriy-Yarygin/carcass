import { connect } from 'react-redux';
import Socket from './SocketIndicator';
import * as socketActions from '../ducks/socket/actions';
import * as roomActions from '../ducks/room/actions';
import * as userActions from '../ducks/user/actions';

const mapStateToProps = state => ({
  socket: state.socket
});

const mapDispatchToProps = dispatch => ({
  setFlag: flag => dispatch(socketActions.setFlag(flag)),

  logout: () => dispatch(userActions.logout()),

  addRoom: newRoom => dispatch(roomActions.roomCreate(newRoom)),
  loadRooms: roomsArray => dispatch(roomActions.loadRooms(roomsArray)),
  updateRoom: editedRoom => dispatch(roomActions.roomUpdate(editedRoom)),
  delRoom: id => dispatch(roomActions.roomDel(id)),
  addPlayer: player => dispatch(roomActions.roomNewPLayer(player))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Socket);
