import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MapRaw from './MapRaw';
import GameMap from '../../server/game/gameMap';
const styles = {
  root: {
    // padding: '5px',
    flexGrow: 1
    /*   align-item: stretch; */
  }
};

class MapView extends React.PureComponent {
  //React.Component {
  state = { timeStamp: null };

  static getDerivedStateFromProps(props, state) {
    const { tilesMap, gameState } = props;
    const extendedMap = GameMap.extendMap(tilesMap.tilesMap);
    if (
      gameState &&
      gameState.tile &&
      gameState.stage &&
      gameState.stage === 'gotTile'
    ) {
      return {
        extendedMap: GameMap.findVariants(extendedMap, gameState.tile)
      };
    }
    if (tilesMap.timeStamp !== state.timeStamp) {
      if (gameState.stage === 'putTile')
        return {
          extendedMap,
          timeStamp: tilesMap.timeStamp
        };
      return {
        extendedMap,
        timeStamp: tilesMap.timeStamp
      };
    }
    // No state update necessary
    return null;
  }

  render() {
    console.log(`MapView render`);
    const {
      classes,
      onClick,
      roomId,
      gameState,
      whatVariantsShow
    } = this.props;
    const { lastTilePosition } = gameState;
    const { extendedMap } = this.state;
    return (
      <div className={classes.root}>
        {extendedMap &&
          extendedMap.map((raw, i) => (
            <MapRaw
              key={i}
              y={i}
              raw={raw}
              onClick={onClick}
              roomId={roomId}
              lastTilePosition={lastTilePosition}
              whatVariantsShow={whatVariantsShow}
            />
          ))}
      </div>
    );
  }
}

MapView.propTypes = {
  classes: PropTypes.object.isRequired,
  tilesMap: PropTypes.object.isRequired,
  gameState: PropTypes.object.isRequired
};

export default withStyles(styles)(MapView);
