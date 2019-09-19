import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Miple from './Miple';
import { COLORS, NOT_SETTED_MIPLE_PLACE_COLOR } from '../common/constants';

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
    return COLORS[thisRoom.game_state.trunOrder.indexOf(occupied)]; // occupied === userId
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
    return (
      stage === 'putTile' &&
      lastTilePosition.x === position.x &&
      lastTilePosition.y === position.y
    );
  }
  // console.error(`Function "isThisLastTile": Check arguments!`);
  // console.log(position);
  // console.log(thisRoom);

  return false;
}

class MiplePlaces extends React.Component {
  state = { thisRoom: null };

  static getDerivedStateFromProps(props, state) {
    const { roomId, room } = props;
    const thisRoom = room.rooms
      ? room.rooms.find(room => room.id === roomId)
      : null;
    if (thisRoom && !Object.is(thisRoom, state.thisRoom)) {
      return { thisRoom };
    }
    // No state update necessary
    return null;
  }

  mipleClick = name => e => {
    const { settingsUpdate, position } = this.props;
    // const { thisRoom } = this.state;

    settingsUpdate({ key: name, position });

    // if (isThisLastTile(position, thisRoom)) {
    // }
    e.stopPropagation();
  };

  render() {
    // console.log(`MiplePlaces render`);
    const {
      classes,
      position,
      tile,
      rotation,
      roomId,
      room,
      user,
      settings
    } = this.props;

    const { thisRoom } = this.state;

    let points = [];
    if (tile.places) {
      for (let key in tile.places) {
        const { x, y, occupied } = tile.places[key];
        if (!x || !y) {
          console.error(`Check cordinates of ${tile.name} !`);
          continue;
        }
        const color = getStarColor(occupied, thisRoom);
        points.push({ name: key, x, y, color, occupied });
      }
    }

    const rotationStyle = rotation
      ? { transform: `rotate(${rotation * 90}deg)` }
      : {};

    let spotStyle = {};
    if (isThisLastTile(position, thisRoom) || settings.isSpotsKeysVisible)
      spotStyle.backgroundColor = NOT_SETTED_MIPLE_PLACE_COLOR;
    if (!settings.isTileSpotsVisible) spotStyle.border = 'none';

    let spotKeyStyle = settings.isSpotsKeysVisible ? {} : { display: 'none' };
    /* ****************************************************************************** */
    return (
      <div className={classes.root}>
        <div className={classes.subRoot} style={rotationStyle}>
          {points.map(({ name, x, y, color, occupied }) => (
            <div
              key={name}
              className={classes.pointStyle}
              style={{ left: x, top: y, color, ...spotStyle }}
              onClick={this.mipleClick(name)}
            >
              {color && <Miple description={{ name }} />}
              <span className={classes.name} style={spotKeyStyle}>
                {name}
              </span>
            </div>
          ))}
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
