const { startTile, uniqueTiles } = require('./tiles');
const TilesStore = require('./tilesStore');
const GameMap = require('./gameMap');

let tilesStore = new TilesStore(uniqueTiles);
let gameMap = new GameMap();

//////////////////////////////////////////////////////
class GetSidesNames extends React.Component {
  render() {
    const { tile } = this.props;
    return (
      <>
        <h3 className="tileClass_name">{tile.name}</h3>
        {tile.sides.map(({ type, owner }, i) => (
          <span
            key={i}
            className={'tileClass_side' + i}
          >{`${type} ${owner}`}</span>
        ))}
      </>
    );
  }
}
//////////////////////////////////////////////////////
class Tile extends React.Component {
  render() {
    const { tile, onClick } = this.props;
    if (!tile) {
      return <div className="tileClass" onClick={onClick}></div>;
    }
    return (
      <div className="tileClass">
        <GetSidesNames tile={tile} />
      </div>
    );
  }
}
//////////////////////////////////////////////////////
class EtherealTile extends React.Component {
  render() {
    const { tile, onClick } = this.props;
    return (
      <div className="tileClass ethereal">
        <GetSidesNames tile={tile} />
        {tile.variants && tile.variants.length > 1 && (
          <button className="tileClass_btn_rotate">R</button>
        )}
      </div>
    );
  }
}
/////////////////////////////////////////////////////
class MapRaw extends React.Component {
  render() {
    const { raw } = this.props;
    return (
      <div className="map-raw">
        {raw.map((cell, i) => {
          if (cell && cell.variants) {
            return <EtherealTile key={i} tile={cell} />;
          }
          return <Tile key={i} tile={cell} />;
        })}
      </div>
    );
  }
}
//////////////////////////////////////////////////
class MapView extends React.PureComponent {
  //React.Component {
  state = {};
  componentDidMount() {}

  static getDerivedStateFromProps(props, state) {
    // console.log('getDerivedStateFromProps');
    const { tilesMap, newTile } = props;
    if (newTile) {
      console.log('newTile');
      return {
        extendedMap: findVariants(state.extendedMap, newTile)
      };
    }
    if (tilesMap.timeStamp !== state.timeStamp) {
      console.log(JSON.stringify(state.timeStamp));
      console.log(JSON.stringify(tilesMap.timeStamp));
      const extendedMap = extendMap(tilesMap.tilesMap);
      return {
        extendedMap,
        timeStamp: tilesMap.timeStamp
      };
    }
    // No state update necessary
    return null;
  }
  /*
  
  */
  render() {
    console.log(`MapView render`);
    const { newTile } = this.props;
    const { extendedMap } = this.state;
    return (
      <div className="map">
        {extendedMap &&
          extendedMap.map((raw, i) => <MapRaw key={i} raw={raw} />)}
      </div>
    );
  }
}
///////////////////////////////////////////

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
  const mapHeight = extendedMap.length;
  const mapLenght = extendedMap[0].length;
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
  const mapHeight = mapMatrix.length;
  const mapLenght = mapMatrix[0].length;
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
  const mapLenght = mapMatrix[0].length;
  return x < 0 || x >= mapLenght || y < 0 || y >= mapHeight;
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
///////////////////////////////////////////
class Board extends React.Component {
  state = {
    tile: null,
    tilesMap: gameMap.get(),
    jumbledTiles: tilesStore.getTilesInBox()
  };

  handleTileClick = () => {
    const tile = tilesStore.getTile();
    this.setState({ tile });
  };
  handleBtnClick = () => {
    const jumbledTiles = tilesStore.jumble(); //.reverse();
    this.setState({ jumbledTiles });
  };
  handleBtn2Click = () => {
    console.log(this.state);
  };

  render() {
    // console.log(`Board render`);
    const { tile, tilesMap, jumbledTiles } = this.state;
    return (
      <div className="board">
        <div className="sideBar">
          <Tile tile={tile} onClick={this.handleTileClick} />
          <button onClick={this.handleBtnClick}>Jumble</button>
          <button onClick={this.handleBtn2Click}>State</button>
          {jumbledTiles.map(({ name }, i) => (
            <p key={i}>{name}</p>
          ))}
        </div>
        <MapView tilesMap={tilesMap} newTile={tile} />
      </div>
    );
  }
}
/*
          <MapView tilesMap={tilesMap} newTile={tile}/>
  */
/////////////////////////////////////////////////////
ReactDOM.render(<Board />, document.getElementById('root'));
