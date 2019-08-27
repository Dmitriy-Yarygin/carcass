import { connect } from 'react-redux';
import Routes from './Router';
import * as actions from '../ducks/user/actions';

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  login: user => dispatch(actions.login(user)),
  logout: user => dispatch(actions.logout(user)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Routes);
