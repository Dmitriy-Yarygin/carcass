import { connect } from 'react-redux';
import MiplePlaces from './MiplePlaces';
// import * as roomActions from '../ducks/room/actions';
import * as settingsActions from '../ducks/settings/actions';

const mapStateToProps = state => ({
  user: state.user,
  room: state.room,
  settings: state.settings
});

const mapDispatchToProps = dispatch => ({
  updateRoom: editedRoom => dispatch(roomActions.roomUpdate(editedRoom)),

  // resetSettings: () => dispatch(settingsActions.resetSettings()),
  settingsUpdate: payload => dispatch(settingsActions.settingsUpdate(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MiplePlaces);
