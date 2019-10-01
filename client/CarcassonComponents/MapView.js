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
  state = { timeStamp: null, shownVariantPosition: null }; //shownVariantPosition:{x,y}

  static getDerivedStateFromProps(props, state) {
    // console.log('getDerivedStateFromProps');
    const { tilesMap, gameState } = props;
    // const extendedMap = state.extendedMap
    //   ? state.extendedMap
    //   : GameMap.extendMap(tilesMap.tilesMap);
    const extendedMap = GameMap.extendMap(tilesMap.tilesMap);
    if (
      gameState &&
      gameState.tile &&
      gameState.stage &&
      gameState.stage === 'gotTile'
    ) {
      console.log('newTile');
      return {
        extendedMap: GameMap.findVariants(extendedMap, gameState.tile)
      };
    }
    if (tilesMap.timeStamp !== state.timeStamp) {
      // console.log(JSON.stringify(state.timeStamp));
      // console.log(JSON.stringify(tilesMap.timeStamp));
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

  changeShownVariant = position => {
    if (!this.props.isVariantsVisible) {
      this.setState({ shownVariantPosition: position });
    }
  };

  render() {
    console.log(`MapView render`);
    const {
      classes,
      onClick,
      roomId,
      gameState,
      isVariantsVisible
    } = this.props;
    const { lastTilePosition } = gameState;
    const { changeShownVariant, state } = this;
    const { extendedMap, shownVariantPosition } = state;
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
              whatVariantsShow={{
                isVariantsVisible,
                shownVariantPosition,
                changeShownVariant
              }}
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
