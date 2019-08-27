import { connect } from 'react-redux';
import Login from './Login';
import * as actions from '../ducks/user/actions';
// import * as thingsActions from '../ducks/things/actions'

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  login: user => dispatch(actions.login(user))
  // thingsInit: () => dispatch( thingsActions.thingsInit(user) )
  // logout: (user) => dispatch( actions.logout(user) ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
