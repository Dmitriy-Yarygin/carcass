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

import { socket } from '../common/Socket';

const styles = theme => ({
  root: {
    margin: 20,
    padding: 5
  }
});

class Room extends React.Component {
  state = {
    msg: null,
    gameState: { tile: null, stage: null },
    tilesMap: { tilesMap: null, timeStamp: null }
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
  ///////////////////////////// START
  startClick = () => {
    socket.emit('game: start', { roomId: this.state.id }, answer => {
      if (this.checkSuccess(answer)) {
        // console.log(answer.result);
        const { map, state } = answer.result;
        this.setState({
          tilesMap: map,
          gameState: state
        });
      }
    });
  };
  ////////////////////////// GET TILE
  getTileClick = () => {
    if (this.state.tile) {
      return;
    }
    console.log('//////// GET TILE');
    socket.emit('game: get tile', { roomId: this.state.id }, answer => {
      if (this.checkSuccess(answer)) {
        // tile = answer.result.state.tile;
        this.setState({ gameState: answer.result.state });
      }
    });
  };
  ////////////////////////////////////// PUT TILE executed in EtherealTile
  putTileClick = (position, rotation) => {
    const gameState = this.state;
    this.setState({ gameState: { ...gameState, tile: null } });

    socket.emit(
      'game: put tile',
      { roomId: this.state.id, position, rotation },
      answer => {
        if (this.checkSuccess(answer)) {
          console.log('/// PUT TILE executed in EtherealTile answer');
          console.log(answer.result);
          // this.props.updateRoom(answer.result);
          const { state, map } = answer.result;
          this.setState({
            tilesMap: map,
            gameState: state
          });
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
    const { classes, user, room } = this.props;
    const { name, gameState, tilesMap, players } = this.state;
    // console.log(`gameState = ${JSON.stringify(gameState)}`);
    // console.log(`user = ${JSON.stringify(user)}`);

    const { tile, stage, turn, turnOrder, playerTurn } = gameState;
    let whosTurn = false;
    let playersQueue;
    if (turnOrder && players) {
      whosTurn = players.find(({ id }) => id === turnOrder[playerTurn]).email;
      playersQueue = turnOrder
        .map(
          (id, i) =>
            `${i + 1}) ${players.find(player => id === player.id).email}`
        )
        .join('; ');
    }
    const startBtnFlag =
      gameState && gameState.name && gameState.name === 'created';
    const newTileBtnFlag =
      gameState && gameState.name && gameState.name === 'started';
    const isYourTurn = turnOrder && user.id == turnOrder[playerTurn];
    return (
      <Grid container direction="row">
        <Paper className={classes.root} elevation={1}>
          <Typography className={classes.title} variant="h6" noWrap>
            Room {name}
          </Typography>
          {whosTurn && (
            <Typography className={classes.title} variant="subtitle1" noWrap>
              Now turn of <b>{whosTurn}</b>
              <br></br>
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

          {newTileBtnFlag && isYourTurn && (
            <Tile tile={tile} onClick={this.getTileClick} />
          )}
          {startBtnFlag && <button onClick={this.startClick}>Start</button>}
          <button onClick={this.handleBtn2Click}>State</button>
          {/* {jumbledTiles.map(({ name }, i) => ( <p key={i}>{name}</p> ))} */}
        </Paper>

        <Paper className={classes.root} elevation={1}>
          {/* JSON.stringify(this.state.tilesMap) */}
          {tilesMap && (
            <MapView
              tilesMap={tilesMap}
              newTile={tile}
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
