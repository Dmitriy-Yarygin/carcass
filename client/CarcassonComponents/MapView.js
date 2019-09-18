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
  componentDidMount() {}

  static getDerivedStateFromProps(props, state) {
    console.log('getDerivedStateFromProps');
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
      console.log(JSON.stringify(state.timeStamp));
      console.log(JSON.stringify(tilesMap.timeStamp));
      return {
        extendedMap,
        timeStamp: tilesMap.timeStamp
      };
    }
    // No state update necessary
    return null;
  }

  ////////////////////////////////////// onMipleClick executed in MiplePlaces
  onMipleClick = (key, { x, y }) => {
    console.log(`Click key=${key}, position=${x}:${y}`);
    const gameMap = new GameMap(this.state.extendedMap);

    const { includedTiles, isAreaOpen } = gameMap.selectArea(key, x, y);
    const mapMatrix = gameMap.get().tilesMap;

    includedTiles.forEach(({ owners, x, y }) => {
      owners.forEach(owner => {
        mapMatrix[y][x].places[owner].color = 'red';
      });
    });

    const pointsCount = gameMap.calculatePoints(key, x, y);

    console.log(
      `${key} is ${isAreaOpen ? 'open' : 'closed'}, points = ${pointsCount}`
    );

    this.setState({ extendedMap: mapMatrix });
  };
  ////////////////////////////////////////////////////////////////////////////

  render() {
    console.log(`MapView render`);
    const { classes, onClick } = this.props;
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
              onMipleClick={this.onMipleClick}
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
