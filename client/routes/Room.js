import React from 'react';
import PropTypes from 'prop-types';
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
import TilesStack from '../CarcassonComponents/TilesStack';

import { socket } from '../common/Socket';

const styles = theme => ({
  root: {
    margin: 20,
    padding: 5
    // backgroundColor: 'rgba(156, 185, 161, 0.9)'
  }
});

class Room extends React.Component {
  state = {
    msg: null
    // gameState: { tile: null, stage: null },
    // tilesMap: { tilesMap: null, timeStamp: null }
  };

  warningOnClose = () => {
    this.setState({ msg: null });
  };

  componentDidMount() {
    // console.log(`game_Room componentDidMount`);
    socket.emit(
      'game: get map',
      { roomId: this.props.match.params.id },
      answer => {
        if (this.checkSuccess(answer)) {
          // const { id, name, map, state, users } = answer.result;
          this.setState({
            roomId: answer.result.id,
            roomName: answer.result.name
            // tilesMap: map,
            // gameState: state,
            // players: users
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

  startClick = () => {
    socket.emit('game: start', { roomId: this.state.roomId }, answer => {
      if (this.checkSuccess(answer)) {
        // console.log(answer.result);
        // const { map, state } = answer.result;
        // this.setState({
        //   tilesMap: map,
        //   gameState: state
        // });
      }
    });
  };
  ////////////////////////// GET TILE
  getTileClick = () => {
    console.log('//////// GET TILE');
    socket.emit('game: get tile', { roomId: this.state.roomId }, answer => {
      if (this.checkSuccess(answer)) {
        this.props.updateRoom(answer.result);
        // tile = answer.result.state.tile;
        // this.setState({ gameState: answer.result.state });
      }
    });
  };
  ////////////////////////////////////// PUT TILE executed in EtherealTile
  putTileClick = (position, rotation) => {
    // const gameState = this.state;
    // this.setState({ gameState: { ...gameState, tile: null } });

    socket.emit(
      'game: put tile',
      { roomId: this.state.roomId, position, rotation },
      answer => {
        if (this.checkSuccess(answer)) {
          console.log('/// PUT TILE executed in EtherealTile answer');
          console.log(answer.result);
          this.props.updateRoom(answer.result);
          // const { state, map } = answer.result;
          // this.setState({
          //   tilesMap: map,
          //   gameState: state
          // });
        }
      }
    );
  };

  //////////////////
  handleBtn2Click = () => {
    console.log(this.state);
  };

  render() {
    console.log(`Room render`);
    let thisRoom,
      whosTurn,
      playersQueue,
      startBtnFlag,
      gameState,
      tilesStackBlinkFlag;
    const { roomId, roomName } = this.state;
    const { classes, user, room } = this.props;
    if (roomId && room && room.rooms) {
      thisRoom = room.rooms.find(room => room.id === roomId); //
      if (thisRoom) {
        const { game_state, users } = thisRoom;
        if (users) playersQueue = users.map(({ email }) => email).join('; ');
        gameState = game_state;

        if (gameState.turnOrder && users) {
          const { turnOrder, playerTurn } = gameState;
          // console.log(`gameState = ${JSON.stringify(gameState)}`);
          tilesStackBlinkFlag = !!(
            user.id === turnOrder[playerTurn] &&
            gameState.stage !== 'gotTile' &&
            gameState.tilesInStack
          );
          whosTurn = users.find(({ id }) => id === turnOrder[playerTurn]).email;
          playersQueue = turnOrder
            .map(
              (id, i) =>
                `${i + 1}) ${users.find(player => id === player.id).email}`
            )
            .join('; ');
        }
        startBtnFlag = gameState.name && gameState.name === 'created';
      }
    }
    // console.log(`user = ${JSON.stringify(user)}`);
    return (
      <Grid container direction="row">
        <Paper className={classes.root} elevation={1}>
          <Typography className={classes.title} variant="h6" noWrap>
            Room {roomName}
          </Typography>
          {whosTurn && (
            <Typography className={classes.title} variant="subtitle1" noWrap>
              Now turn of <b>{whosTurn}</b>
            </Typography>
          )}
          {playersQueue && (
            <Typography className={classes.title} variant="subtitle1" noWrap>
              Turn queue: {playersQueue}
            </Typography>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={this.handleBtnClick}
          >
            Hello socket
          </Button>

          {gameState && (
            <TilesStack
              gameState={gameState}
              onClick={this.getTileClick}
              blinkFlag={tilesStackBlinkFlag}
            />
          )}
          {startBtnFlag && <button onClick={this.startClick}>Start</button>}
          <button onClick={this.handleBtn2Click}>State</button>
        </Paper>

        <Paper className={classes.root} elevation={1}>
          {thisRoom && thisRoom.stamped_map && gameState && (
            <MapView
              tilesMap={thisRoom.stamped_map}
              gameState={gameState}
              onClick={this.putTileClick}
            />
          )}
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

Room.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Room);
