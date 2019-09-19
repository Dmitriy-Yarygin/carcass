import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MySnackbar from '../common/MySnackbar';
import MapView from '../CarcassonComponents/MapView';
import TilesStack from '../CarcassonComponents/TilesStack';
import GameMap from '../../server/game/gameMap';

import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';

import { socket } from '../common/Socket';

const styles = theme => ({
  root: {
    margin: 20,
    padding: 5,
    backgroundColor: 'rgba(128, 134, 129, 0.9)'
  }
});

class Room extends React.Component {
  state = {
    msg: null,
    isTileSpotsVisible: false
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
          this.setState({
            roomId: answer.result.id,
            roomName: answer.result.name
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

  handleRoomsBtnClick = () => {
    socket.emit('show me rooms', {}, console.log);
  };

  startClick = () => {
    socket.emit('game: start', { roomId: this.state.roomId }, answer => {
      this.checkSuccess(answer);
    });
  };
  ////////////////////////// GET TILE
  getTileClick = () => {
    console.log('//////// GET TILE');
    socket.emit('game: get tile', { roomId: this.state.roomId }, answer => {
      if (this.checkSuccess(answer)) {
        this.props.updateRoom(answer.result);
      }
    });
  };
  ////////////////////////////////////// PUT TILE executed in EtherealTile
  putTileClick = (position, rotation) => {
    socket.emit(
      'game: put tile',
      { roomId: this.state.roomId, position, rotation },
      answer => {
        if (this.checkSuccess(answer)) {
          console.log('/// PUT TILE executed in EtherealTile answer');
          console.log(answer.result);
          this.props.updateRoom(answer.result);
        }
      }
    );
  };

  //////////////////////////////////////
  handlePassBtnClick = () => {
    socket.emit(
      'game: pass the moove',
      { roomId: this.state.roomId },
      answer => {
        if (this.checkSuccess(answer)) {
          // console.log(answer.result);
          // this.props.updateRoom(answer.result);
        }
      }
    );
  };

  handlePassBtnClick;
  ////////////////////////////////////////////////////////
  checkSettings = ({ stamped_map }, { key, position }) => {
    if (stamped_map && key && position) {
      const x = position.x - 1;
      const y = position.y - 1;

      console.log(`Click key=${key}, position=${x}:${y}`);
      // const gameMap = new GameMap(stamped_map.tilesMap);

      // const { includedTiles, isAreaOpen } = gameMap.selectArea(key, x, y);
      // const stampedMap = gameMap.get();
      // const mapMatrix = stampedMap.tilesMap;

      // includedTiles.forEach(({ owners, x, y }) => {
      //   owners.forEach(owner => {
      //     mapMatrix[y][x].places[owner].color = 'red';
      //   });
      // });

      // const pointsCount = gameMap.calculatePoints(key, x, y);

      // console.log(
      //   `${key} is ${isAreaOpen ? 'open' : 'closed'}, points = ${pointsCount}`
      // );

      // this.setState(stampedMap);
    }
  };
  /* ================================================================================= */
  handleBtn2Click = () => {
    console.log(this.state);
  };
  /* ================================================================================= */
  handleTileSpotsVisibleChange = event => {
    this.props.settingsUpdate({ isTileSpotsVisible: event.target.checked });
  };
  /* ================================================================================= */
  handleSpotsKeysVisibleChange = event => {
    this.props.settingsUpdate({ isSpotsKeysVisible: event.target.checked });
  };
  /* ================================================================================= */

  render() {
    console.log(`Room render`);
    let thisRoom,
      whosTurn,
      playersQueue,
      startBtnFlag,
      gameState,
      tilesStackBlinkFlag;
    const { roomId, roomName } = this.state;
    const { classes, user, room, settings } = this.props;
    if (roomId && room && room.rooms) {
      thisRoom = room.rooms.find(room => room.id === roomId); //
      if (thisRoom) {
        //------------------------------------------
        this.checkSettings(thisRoom, settings);
        //------------------------------------------
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

          {gameState && (
            <TilesStack
              gameState={gameState}
              onClick={this.getTileClick}
              blinkFlag={tilesStackBlinkFlag}
            />
          )}
          {startBtnFlag && <button onClick={this.startClick}>Start</button>}
          <button onClick={this.handleBtn2Click}>State</button>
          <button onClick={this.handleRoomsBtnClick}>Rooms</button>

          <br></br>
          <Switch
            checked={settings.isTileSpotsVisible}
            onChange={this.handleTileSpotsVisibleChange}
            value="isTileSpotsVisible"
            // inputProps={{ 'aria-label': 'secondary checkbox' }}
            color="primary"
          />
          <span> tiles spots </span>
          <br></br>

          <Checkbox
            checked={settings.isSpotsKeysVisible}
            onChange={this.handleSpotsKeysVisibleChange}
            value="isSpotsKeysVisible"
            // inputProps={{ 'aria-label': 'primary checkbox' }}
            color="primary"
          />
          <span> Letters </span>

          <br></br>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handlePassBtnClick}
          >
            Pass
          </Button>
        </Paper>

        <Paper className={classes.root} elevation={1}>
          {thisRoom && thisRoom.stamped_map && gameState && (
            <MapView
              roomId={roomId}
              tilesMap={thisRoom.stamped_map}
              gameState={gameState}
              settings={settings}
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
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  room: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};

export default withStyles(styles)(Room);
