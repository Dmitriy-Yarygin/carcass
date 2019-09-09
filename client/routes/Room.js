import React from 'react';
// import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// import EditedField from '../common/EditedField';
// import TextField from '@material-ui/core/TextField';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import MySnackbar from '../common/MySnackbar';

import { socket } from '../common/Socket';

const styles = theme => ({
  root: {
    margin: 20,
    padding: 5
  }
});

class Room extends React.Component {
  state = {
    msg: null
  };

  warningOnClose = () => {
    this.setState({ msg: null });
  };

  componentDidMount() {
    console.log(`game_Room componentDidMount`);
    socket.emit(
      'game:join',
      { roomId: this.props.match.params.id },
      console.log
      // this.checkSuccess
    );
  }
  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////

  checkSuccess = answer => {
    if (!answer.success) {
      console.error(answer);
      this.setState({
        msg: answer.error.detail,
        msgVariant: 'error'
      });
    }
    return answer.success;
  };

  handleBtnClick = () => {
    socket.emit('show me rooms', {}, console.log);
  };

  render() {
    const { classes } = this.props;
    const id = Number(this.props.match.params.id);

    return (
      <>
        <Paper className={classes.root} elevation={1}>
          <Typography className={classes.title} variant="h6" noWrap>
            Entrance room id={id}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleBtnClick}
          >
            Hello socket
          </Button>
        </Paper>

        <MySnackbar
          message={this.state.msg}
          onClose={this.warningOnClose}
          variant={this.state.msgVariant}
        />
      </>
    );
  }
}

// Room.propTypes = {
//   classes: PropTypes.func.isRequired
// };

export default withStyles(styles)(Room);
