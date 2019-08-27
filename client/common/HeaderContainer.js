import { connect } from 'react-redux';
import Header from './Header';
import * as actions from '../ducks/user/actions';
// import * as softActions from '../ducks/soft/actions';

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  login: user => dispatch(actions.login(user)),
  logout: () => dispatch(actions.logout())

  // setSoftType: softType => dispatch(softActions.setSoftType(softType))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
