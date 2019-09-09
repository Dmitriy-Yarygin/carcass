import { connect } from 'react-redux';
import Room from './Room';
import * as roomsActions from '../ducks/room/actions';

const mapStateToProps = state => ({
  user: state.user,
  room: state.room
});

export default connect(mapStateToProps)(Room);
