import { connect } from 'react-redux';
import Room from './Room';
import * as roomActions from '../ducks/room/actions';

const mapStateToProps = state => ({
  user: state.user,
  room: state.room
});

const mapDispatchToProps = dispatch => ({
  updateRoom: editedRoom => dispatch(roomActions.roomUpdate(editedRoom))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Room);
