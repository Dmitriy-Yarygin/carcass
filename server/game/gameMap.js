const { objectClone } = require('../helpers/objectFunctions');
const { startTile, town52, town53 } = require('./tiles');

class GameMap {
  constructor(initMap) {
    this.tilesMap = Array.isArray(initMap)
      ? initMap
      : [[objectClone(startTile)]];
    this.timeStamp = new Date();
  }

  get() {
    return { tilesMap: this.tilesMap, timeStamp: this.timeStamp };
  }

  static extendMap(tilesMap) {
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

  static findVariants(extendedMap, newTile) {
    console.log('findVariants');
    let variantsCount = 0;
    let renewedMap = extendedMap.map((mapRaw, i) =>
      mapRaw.map((mapCell, j) => {
        if (mapCell !== null) {
          return Object.assign({}, mapCell);
        }
        if (GameMap.hasntAnySideNeighbors(extendedMap, i, j)) {
          return null;
        }
        const variants = GameMap.getRotationVariants(extendedMap, newTile, {
          x: j,
          y: i
        });
        if (!variants.length) return null;
        variantsCount = variantsCount + variants.length;
        return Object.assign({}, newTile, { variants });
      })
    );
    if (!variantsCount) {
      extendedMap.forEach((mapRaw, i) =>
        mapRaw.forEach((mapCell, j) => {
          if (mapCell !== null) {
            return;
          }
          if (
            GameMap.hasntAnySideNeighbors(extendedMap, i, j) &&
            GameMap.hasSomeCornerNeighbor(extendedMap, i, j)
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

  static getRotationVariants(mapMatrix, newTile, position) {
    const cellBorders = GameMap.getBorders(mapMatrix, position);
    let variants = [];
    const tileSides = newTile.sides.map(({ type }) => type);
    const tileSidesTwice = [...tileSides, ...tileSides];
    for (let k = 0; k < 4; k++) {
      if (GameMap.canPutTileInCell(cellBorders, tileSidesTwice.slice(4 - k))) {
        variants.push(k);
      }
    }
    return variants;
  }

  static canPutTileInCell(cellBorders, tileSides) {
    return cellBorders.every(
      (borderType, i) => borderType === 'space' || tileSides[i] === borderType
    );
  }

  static getBorders(mapMatrix, { x, y }) {
    // console.log(`mapMatrix [${y}][${x}]`);

    const neighbors = [
      { x, y: y - 1, side: 2 },
      { x: x + 1, y, side: 3 },
      { x, y: y + 1, side: 0 },
      { x: x - 1, y, side: 1 }
    ];
    const borders = neighbors.map(({ x, y, side }) => {
      if (GameMap.isCellOutsideMap(mapMatrix, { x, y }) || !mapMatrix[y][x])
        return 'space';

      const cell = mapMatrix[y][x];
      if (!cell.sides) {
        return console.error(`Check, why [${y}][${x}] hasn't sides!`);
      }
      if (!cell.rotation) return cell.sides[side].type;
      const rotatedSideIndex = (4 + side - cell.rotation) % 4;
      return cell.sides[rotatedSideIndex].type;
    });
    // console.log(`extendedMap[${y}][${x}] has borders: ${borders.join(', ')}`);
    return borders;
  }

  static isCellOutsideMap(mapMatrix, { x, y }) {
    const mapHeight = mapMatrix.length;
    const mapLenght = mapMatrix[0].length;
    return x < 0 || x >= mapLenght || y < 0 || y >= mapHeight;
  }

  static hasntAnySideNeighbors(mapMatrix, y, x) {
    const sideNeighbors = [
      { x, y: y - 1 },
      { x: x + 1, y },
      { x, y: y + 1 },
      { x: x - 1, y }
    ];
    return sideNeighbors.every(
      ({ x, y }) =>
        GameMap.isCellOutsideMap(mapMatrix, { x, y }) || !mapMatrix[y][x]
    );
  }

  static hasSomeCornerNeighbor(mapMatrix, y, x) {
    const cornerNeighbors = [
      { x: x - 1, y: y - 1 },
      { x: x + 1, y: y - 1 },
      { x: x + 1, y: y + 1 },
      { x: x - 1, y: y + 1 }
    ];
    return cornerNeighbors.some(
      ({ x, y }) =>
        !GameMap.isCellOutsideMap(mapMatrix, { x, y }) && !!mapMatrix[y][x]
    );
  }

  putTileOnMap(tile, position, rotation) {
    const extendedMap = GameMap.extendMap(this.tilesMap);
    if (GameMap.isCellOutsideMap(extendedMap, position)) {
      return false;
    }
    let variants = GameMap.getRotationVariants(extendedMap, tile, position);
    if (!variants.length || variants.every(variant => variant !== rotation)) {
      return false;
    }
    const { x, y } = position;

    if (!GameMap.isCellOutsideMap(this.tilesMap, { x: x - 1, y: y - 1 })) {
      this.tilesMap[y - 1][x - 1] = { ...tile, rotation };
      this.timeStamp = new Date();
      return true;
    }

    extendedMap[y][x] = { ...tile, rotation };
    // console.log(`>>>>>>>>>>>>>> extendedMap[${y}][${x}]`);
    const h = extendedMap.length - 1;
    const w = extendedMap[0].length - 1;
    if (y < h) extendedMap.pop();
    if (x < w) extendedMap.forEach(raw => raw.pop());
    if (y > 0) extendedMap.shift();
    if (x > 0) extendedMap.forEach(raw => raw.shift());

    this.tilesMap = extendedMap;
    this.timeStamp = new Date();

    return true;
  }
}

module.exports = GameMap;
