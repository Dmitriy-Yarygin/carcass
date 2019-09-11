import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MapRaw from './MapRaw';

const styles = {
  root: {
    // padding: '5px',
    flexGrow: 1
    /*   align-item: stretch; */
  }
};

function extendMap(tilesMap) {
  if (!tilesMap || !tilesMap.length) {
    return console.log('Check arguments for extendMap!');
  }
  const mapHeight = tilesMap.length;
  const mapLength = tilesMap[0].length;
  let extendedMap = new Array(mapHeight + 2);
  for (let i = -1; i <= mapHeight; i++) {
    extendedMap[i + 1] = [];
    for (let j = -1; j <= mapLength; j++) {
      const flag = i < 0 || i === mapHeight || j < 0 || j === mapLength;
      extendedMap[i + 1][j + 1] = flag ? null : tilesMap[i][j];
    }
  }
  return extendedMap;
}
//------------------------------------------------------
function findVariants(extendedMap, newTile) {
  console.log('findVariants');
  let variantsCount = 0;
  let renewedMap = extendedMap.map((mapRaw, i) =>
    mapRaw.map((mapCell, j) => {
      if (mapCell !== null) {
        return Object.assign({}, mapCell);
      }
      if (hasntAnySideNeighbors(extendedMap, i, j)) {
        return null;
      }

      const cellBorders = getBorders(extendedMap, i, j);
      let variants = [];
      const tileSides = newTile.sides.map(({ type }) => type);
      const tileSidesTwice = [...tileSides, ...tileSides];
      for (let k = 0; k < 4; k++) {
        if (canPutTileInCell(cellBorders, tileSidesTwice.slice(4 - k))) {
          variantsCount++;
          variants.push(k);
        }
      }
      if (variants.length) {
        return Object.assign({}, newTile, { variants });
      }
      return null;
    })
  );
  if (variantsCount === 0) {
    extendedMap.forEach((mapRaw, i) =>
      mapRaw.forEach((mapCell, j) => {
        if (mapCell !== null) {
          return;
        }
        if (
          hasntAnySideNeighbors(extendedMap, i, j) &&
          hasSomeCornerNeighbor(extendedMap, i, j)
        ) {
          renewedMap[i][j] = Object.assign({}, newTile, {
            variants: [0, 1, 2, 3]
          });
        }
      })
    );
  }
  return renewedMap;
}
//------------------------------------------------------
function canPutTileInCell(cellBorders, tileSides) {
  return cellBorders.every(
    (borderType, i) => borderType === 'space' || tileSides[i] === borderType
  );
}
//------------------------------------------------------
function getBorders(mapMatrix, y, x) {
  const neighbors = [
    { x, y: y - 1, side: 2 },
    { x: x + 1, y, side: 3 },
    { x, y: y + 1, side: 0 },
    { x: x - 1, y, side: 1 }
  ];
  const borders = neighbors.map(({ x, y, side }) => {
    if (isCellOutsideMap(mapMatrix, y, x) || !mapMatrix[y][x]) return 'space';
    if (!mapMatrix[y][x].sides || !mapMatrix[y][x].sides[side]) {
      return console.error(`Check, why extendedMap[${y}][${x}] hasn't sides!`);
    }
    return mapMatrix[y][x].sides[side].type;
  });
  // console.log(`extendedMap[${y}][${x}] has borders: ${borders.join(', ')}`);
  return borders;
}
//------------------------------------------------------
function isCellOutsideMap(mapMatrix, y, x) {
  const mapHeight = mapMatrix.length;
  const mapLength = mapMatrix[0].length;
  return x < 0 || x >= mapLength || y < 0 || y >= mapHeight;
}
//------------------------------------------------------
function hasntAnySideNeighbors(mapMatrix, y, x) {
  const sideNeighbors = [
    { x, y: y - 1 },
    { x: x + 1, y },
    { x, y: y + 1 },
    { x: x - 1, y }
  ];
  return sideNeighbors.every(
    ({ x, y }) => isCellOutsideMap(mapMatrix, y, x) || !mapMatrix[y][x]
  );
}
//------------------------------------------------------
function hasSomeCornerNeighbor(mapMatrix, y, x) {
  const cornerNeighbors = [
    { x: x - 1, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x + 1, y: y + 1 },
    { x: x - 1, y: y + 1 }
  ];
  return cornerNeighbors.some(
    ({ x, y }) => !isCellOutsideMap(mapMatrix, y, x) && !!mapMatrix[y][x]
  );
}

class MapView extends React.PureComponent {
  //React.Component {
  state = { timeStamp: null };
  componentDidMount() {}

  static getDerivedStateFromProps(props, state) {
    // console.log('getDerivedStateFromProps');
    const { tilesMap, newTile } = props;
    const extendedMap = state.extendedMap
      ? state.extendedMap
      : extendMap(tilesMap.tilesMap);
    if (newTile) {
      console.log('newTile');
      return {
        extendedMap: findVariants(extendedMap, newTile)
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

  render() {
    console.log(`MapView render`);
    const { classes, newTile } = this.props;
    const { extendedMap } = this.state;
    return (
      <div className={classes.root}>
        {extendedMap &&
          extendedMap.map((raw, i) => <MapRaw key={i} raw={raw} />)}
      </div>
    );
  }
}

MapView.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MapView);
