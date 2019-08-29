import { connect } from 'react-redux';
import { Socket } from './Socket';
import * as actions from '../ducks/socket/actions';

const mapStateToProps = state => ({
  socket: state.socket
});

const mapDispatchToProps = dispatch => ({
  setFlag: flag => dispatch(actions.setFlag(flag))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Socket);
