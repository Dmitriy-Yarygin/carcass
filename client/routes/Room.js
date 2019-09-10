import React from 'react';
// import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// import EditedField from '../common/EditedField';
// import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MySnackbar from '../common/MySnackbar';
import MapView from '../CarcassonComponents/MapView';
import Tile from '../CarcassonComponents/Tile';

import { socket } from '../common/Socket';

const styles = theme => ({
  root: {
    margin: 20,
    padding: 5
    // display: 'flex'
  }
});

class Room extends React.Component {
  state = {
    msg: null,
    tile: null,
    tilesMap: { tilesMap: null, timeStamp: null }
  };

  warningOnClose = () => {
    this.setState({ msg: null });
  };

  componentDidMount() {
    console.log(`game_Room componentDidMount`);
    socket.emit(
      'game: get map',
      { roomId: this.props.match.params.id },
      answer => {
        if (this.checkSuccess(answer)) {
          const { id, name, map, state, users } = answer.result;
          this.setState({
            id,
            name,
            tilesMap: map,
            gameState: state,
            players: users
          });
        }
      }
    );
  }

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

  handleTileClick = () => {
    if (this.state.tile) {
      return;
    }
    socket.emit('game: get tile', { roomId: this.state.id }, answer => {
      if (this.checkSuccess(answer)) {
        this.setState({ tile: answer.result });
      }
    });
  };
  handleBtn1Click = () => {
    // START
    socket.emit('game: start', { roomId: this.state.id }, answer => {
      if (this.checkSuccess(answer)) {
        console.log(answer.result);

        const { map, state } = answer.result;
        this.setState({
          tilesMap: map,
          gameState: state
        });
      }
    });
  };
  handleBtn2Click = () => {
    console.log(this.state);
  };

  render() {
    const { classes, user, room } = this.props;
    // console.log(this.props);
    // console.log(this.state);
    const { name, gameState, tilesMap, tile } = this.state;
    const startBtnFlag = gameState && gameState.name === 'created';
    //   room.rooms &&
    //   room.rooms[id] &&
    //   room.rooms[id].owner &&
    //   room.rooms[id].owner === user.id;
    const newTileBtnFlag = gameState && gameState.name === 'started';
    //   gameState && gameState.playerTurn && gameState.playerTurn === user.id;
    // console.log(room.rooms[id].owner, user.id, startBtnFlag);
    return (
      <Grid container direction="row">
        <Paper className={classes.root} elevation={1}>
          <Typography className={classes.title} variant="h6" noWrap>
            Room {name}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleBtnClick}
          >
            Hello socket
          </Button>

          {newTileBtnFlag && (
            <Tile tile={tile} onClick={this.handleTileClick} />
          )}
          {startBtnFlag && (
            <button onClick={this.handleBtn1Click}>Start</button>
          )}
          <button onClick={this.handleBtn2Click}>State</button>
          {/* {jumbledTiles.map(({ name }, i) => ( <p key={i}>{name}</p> ))} */}
        </Paper>

        <Paper className={classes.root} elevation={1}>
          {/* JSON.stringify(this.state.tilesMap) */}
          {tilesMap && <MapView tilesMap={tilesMap} newTile={tile} />}
        </Paper>

        <MySnackbar
          message={this.state.msg}
          onClose={this.warningOnClose}
          variant={this.state.msgVariant}
        />
      </Grid>
    );
  }
}

// Room.propTypes = {
//   classes: PropTypes.func.isRequired
// };

export default withStyles(styles)(Room);
