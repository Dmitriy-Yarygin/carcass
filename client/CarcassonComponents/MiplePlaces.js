import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Miple from './Miple';
import { COLORS, NOT_SETTED_MIPLE_PLACE_COLOR } from '../common/constants';
import { socket } from '../common/Socket';
import './TileStack.css'; // for blink
import GameMap from '../../server/game/gameMap';

const styles = {
  root: { position: 'absolute', width: '100%', height: '100%' },
  subRoot: { position: 'relative', width: '100%', height: '100%' },

  pointStyle: {
    zIndex: 9,
    position: 'absolute',
    padding: '1px',
    // color: 'white',
    cursor: 'pointer',
    height: '20px',
    width: '20px',
    border: '2px solid seagreen',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)'
  },

  name: {
    position: 'absolute',
    color: 'black',
    // fontSize: '0.6em',
    top: '10px',
    left: '10px',
    transform: 'translate(-50%,-50%)'
  }
};

function getStarColor(occupied, thisRoom) {
  if (occupied) {
    return COLORS[thisRoom.game_state.turnOrder.indexOf(occupied)]; // occupied === userId
  }
}

function isThisLastTile(position, thisRoom) {
  if (
    position &&
    thisRoom &&
    thisRoom.game_state &&
    thisRoom.game_state.stage &&
    thisRoom.game_state.lastTilePosition
  ) {
    const { lastTilePosition, stage } = thisRoom.game_state;
    const result =
      stage === 'putTile' &&
      lastTilePosition.x === position.x - 1 &&
      lastTilePosition.y === position.y - 1;
    return result;
  }

  return false;
}

class MiplePlaces extends React.Component {
  state = { thisRoom: null };

  static getDerivedStateFromProps(props, state) {
    const { roomId, room } = props;
    const thisRoom = room.rooms
      ? room.rooms.find(room => room.id === roomId)
      : null;
    if (thisRoom) {
      return { thisRoom };
    }
    // No state update necessary
    return null;
  }

  mipleClick = name => e => {
    const { roomId, position, tile } = this.props;
    const { thisRoom } = this.state;
    if (isThisLastTile(position, thisRoom)) {
      socket.emit(
        'game: pass the moove',
        { roomId, key: name, position },
        answer => {
          if (answer.success) {
            this.props.updateRoom(answer.result);
          } else {
            this.props.settingsUpdate({
              msg: answer.error.detail,
              msgVariant: 'error'
            });
          }
        }
      );
    } else if (tile.places[name].occupied) {
      // console.log(`tile.places[name].points = ${tile.places[name].points}`);
      socket.emit(
        'game: take off miple',
        { roomId, key: name, position },
        answer => {
          if (answer.success) {
            this.props.updateRoom(answer.result);
          } else {
            this.props.settingsUpdate({
              msg: answer.error.detail,
              msgVariant: 'error'
            });
          }
        }
      );
      // } else { // only for development testing
      // socket.emit(
      //   'game: FORCE set miple',
      //   { roomId, key: name, position },
      //   answer => {
      //     if (answer.success) {
      //       this.props.updateRoom(answer.result);
      //     } else {
      //       this.props.settingsUpdate({
      //         msg: answer.error.detail,
      //         msgVariant: 'error'
      //       });
      //     }
      //   }
      // );
    }
    e.stopPropagation();
  };

  render() {
    // console.log(`MiplePlaces render`);
    // console.log(this.props);
    const { classes, position, tile, rotation, settings } = this.props;

    const { thisRoom } = this.state;

    let places = [];
    if (tile.places) {
      for (let key in tile.places) {
        const { x, y, occupied, points } = tile.places[key];
        if (!x || !y) {
          console.error(`Check cordinates of ${tile.name} !`);
          continue;
        }
        const color = getStarColor(occupied, thisRoom);
        places.push({ name: key, x, y, color, points, occupied });
      }
    }
    const rotationStyle = rotation
      ? { transform: `rotate(${rotation * 90}deg)` }
      : {};
    let spotStyle = {};
    const lastTileFlag = isThisLastTile(position, thisRoom);

    if (lastTileFlag) {
      spotStyle = {
        border: '3px solid orangered',
        animationName: 'blink',
        animationDuration: '2s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite'
      };
    }

    if (lastTileFlag || settings.isSpotsKeysVisible) {
      spotStyle.backgroundColor = NOT_SETTED_MIPLE_PLACE_COLOR;
    }
    if (!settings.isTileSpotsVisible && !lastTileFlag) {
      spotStyle.border = 'none';
    }
    const spotKeyStyle = settings.isSpotsKeysVisible ? {} : { display: 'none' };
    const gameMap = new GameMap(thisRoom.stamped_map.tilesMap);
    /* ****************************************************************************** */
    return (
      <div className={classes.root}>
        <div className={classes.subRoot} style={rotationStyle}>
          {places.map(({ name, x, y, color, points, occupied }) => {
            if (lastTileFlag) {
              // console.log(`lastTileFlag=${lastTileFlag}`);
              const isPlaceAvailableForSettingMiple = gameMap.isItPossibleSetMipleOnMap(
                name,
                { x: position.x - 1, y: position.y - 1 }
              );

              spotStyle.visibility = isPlaceAvailableForSettingMiple
                ? 'visible'
                : 'hidden';
            }
            return (
              <div
                key={name}
                className={classes.pointStyle}
                style={{ left: x, top: y, color, ...spotStyle }}
                onClick={this.mipleClick(name)}
              >
                {color && (
                  <Miple description={{ name, points }} rotation={rotation} />
                )}
                <span className={classes.name} style={spotKeyStyle}>
                  {name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

MiplePlaces.propTypes = {
  classes: PropTypes.object.isRequired,
  settingsUpdate: PropTypes.func.isRequired,
  position: PropTypes.object.isRequired,
  tile: PropTypes.object.isRequired,
  rotation: PropTypes.number.isRequired,
  roomId: PropTypes.number.isRequired,
  room: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};

export default withStyles(styles)(MiplePlaces);
