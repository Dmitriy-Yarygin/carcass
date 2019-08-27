import { connect } from 'react-redux';
import Admins from './Admins';
import * as usersActions from '../ducks/user/actions';
import * as roomsActions from '../ducks/room/actions';

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  loadRooms: options => dispatch(roomsActions.loadRooms(options))

  // // userAdd: newUser => dispatch(usersActions.userAdd(newUser)),

  // userUpdate: newUser => dispatch(usersActions.userUpdate(newUser)),

  // userDelete: id => dispatch(usersActions.userDelete(id))
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Admins);
