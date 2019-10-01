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
import './justBlink.css';
import { COLORS } from '../common/constants';
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
    isVariantsVisible: false,
    shownVariantPosition: null
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

  componentDidUpdate() {
    const { settings } = this.props;
    const { msg, msgVariant } = settings;
    if (msg && msgVariant) {
      this.props.settingsUpdate({ msg: null, msgVariant: null });
      this.setState({ msg, msgVariant });
    }
  }

  checkSuccess = answer => {
    if (!answer.success) {
      this.setState({
        msg: answer.error.detail,
        msgVariant: 'error'
      });
    }
    return answer.success;
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
    const { isVariantsVisible, shownVariantPosition } = this.state;
    console.log(
      `putTileClick   isVariantsVisible=${isVariantsVisible}, 
      shownVariantPosition=${JSON.stringify(shownVariantPosition)}, 
      position=${JSON.stringify(position)} `
    );
    socket.emit(
      'game: put tile',
      { roomId: this.state.roomId, position, rotation },
      answer => {
        if (this.checkSuccess(answer)) {
          this.props.updateRoom(answer.result);
          this.setState({ shownVariantPosition: null });
        }
      }
    );
  };

  handlePassBtnClick = () => {
    socket.emit(
      'game: pass the moove',
      { roomId: this.state.roomId },
      answer => {
        if (this.checkSuccess(answer)) {
          // console.log(answer.result);
          this.props.updateRoom(answer.result);
        }
      }
    );
  };
  /* ================================================================================= */
  handleVariantsVisibleChange = event => {
    this.setState({ isVariantsVisible: event.target.checked });
  };
  /* ================================================================================= */
  changeShownVariant = position => {
    const { isVariantsVisible, shownVariantPosition } = this.state;
    if (isVariantsVisible) return;
    this.setState({ shownVariantPosition: position });
  };
  /* ================================================================================= */

  render() {
    console.log(`Room render`);
    let thisRoom,
      whosTurn,
      whosTurnColor,
      playersQueue,
      startBtnFlag,
      gameState,
      tilesStackBlinkFlag,
      showPassBtn;
    const {
      roomId,
      roomName,
      isVariantsVisible,
      shownVariantPosition
    } = this.state;
    const { classes, user, room } = this.props;
    if (roomId && room && room.rooms) {
      thisRoom = room.rooms.find(room => room.id === roomId); //
      if (thisRoom) {
        const { game_state, users } = thisRoom;
        gameState = game_state;

        if (gameState.turnOrder && users) {
          const { turnOrder, playerTurn, progress } = gameState;
          tilesStackBlinkFlag = !!(
            user.id === turnOrder[playerTurn] &&
            gameState.stage === 'pass' &&
            gameState.tilesInStack
          );

          whosTurn = users.find(({ id }, i) => {
            if (id !== turnOrder[playerTurn]) return false;
            whosTurnColor = { color: COLORS[i] };
            return true;
          }).email;
          playersQueue = turnOrder.map((id, i) => ({
            user: users.find(player => id === player.id).email,
            color: COLORS[i],
            ...progress[id]
          }));
        }
        startBtnFlag = gameState.name && gameState.name === 'created';
        showPassBtn =
          gameState && gameState.stage && gameState.stage === 'putTile';
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
            <Typography
              className={classes.title}
              variant="subtitle1"
              noWrap
              style={whosTurnColor}
            >
              Now turn of <b>{whosTurn}</b>
            </Typography>
          )}
          {playersQueue && playersQueue.length && (
            <Typography className={classes.title} variant="subtitle1" noWrap>
              Turn queue:
              {playersQueue.map(({ user, color, scores, freeMiples }, i) => (
                <Typography variant="body1" gutterBottom key={i}>
                  {`${i + 1}) ${user} - `}
                  <b style={{ color, border: '2px solid' }}>
                    {scores} &#9733; {freeMiples}
                  </b>
                </Typography>
              ))}
            </Typography>
          )}

          {gameState && (
            <TilesStack
              gameState={gameState}
              onClick={this.getTileClick}
              blinkFlag={tilesStackBlinkFlag}
            />
          )}
          <br></br>
          {startBtnFlag && (
            <Button
              className="justBlink"
              variant="contained"
              color="primary"
              onClick={this.startClick}
            >
              Start
            </Button>
          )}

          <br></br>
          <Switch
            checked={isVariantsVisible}
            onChange={this.handleVariantsVisibleChange}
            value="isVariantsVisible"
            color="primary"
          />
          <span> Show variants </span>

          <br></br>
          {showPassBtn && (
            <Button
              className="justBlink"
              variant="contained"
              color="primary"
              onClick={this.handlePassBtnClick}
            >
              Pass
            </Button>
          )}
        </Paper>

        <Paper className={classes.root} elevation={1}>
          {thisRoom && thisRoom.stamped_map && gameState && (
            <MapView
              roomId={roomId}
              tilesMap={thisRoom.stamped_map}
              gameState={gameState}
              // settings={settings}
              onClick={this.putTileClick}
              whatVariantsShow={{
                isVariantsVisible,
                shownVariantPosition,
                changeShownVariant: this.changeShownVariant
              }}
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
