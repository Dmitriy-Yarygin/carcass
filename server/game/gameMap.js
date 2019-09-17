const { objectClone } = require('../helpers/objectFunctions');
const { startTile } = require('./tiles');

function calculatePoints(includedTiles, mapMatrix, openFlag) {
  const { owners, x, y } = includedTiles[0];
  const placeType = mapMatrix[y][x].places[owners[0]].name;
  let points = includedTiles.length;
  switch (placeType) {
    case 'town':
      includedTiles.forEach(({ owners, x, y }) => {
        owners.forEach(owner => {
          console.log(mapMatrix[y][x].places[owner]);
          if (mapMatrix[y][x].places[owner].shields)
            points += mapMatrix[y][x].places[owner].shields;
        });
      });
      if (!openFlag) points *= 2;
      break;
    case 'road':
      break;
    case 'field':
      points = -555;
      break;
    case 'monastery':
      if (!openFlag) points = 9;
      break;
  }
  return points;
}

function getBorders(mapMatrix, { x, y }) {
  // console.log(`mapMatrix [${y}][${x}]`);
  const neighbors = [
    { x, y: y - 1, side: 2 },
    { x: x + 1, y, side: 3 },
    { x, y: y + 1, side: 0 },
    { x: x - 1, y, side: 1 }
  ];
  const borders = neighbors.map(({ x, y, side }) => {
    if (isCellOutsideMap(mapMatrix, { x, y }) || !mapMatrix[y][x])
      return { type: 'space' };

    const cell = mapMatrix[y][x];
    if (!cell.sides) {
      return console.error(`Check, why [${y}][${x}] hasn't sides!`);
    }
    // if (!cell.rotation) return cell.sides[side].type;

    if (!cell.rotation) return objectClone({ ...cell.sides[side], x, y });
    const rotatedSideIndex = (4 + side - cell.rotation) % 4;
    // return cell.sides[rotatedSideIndex].type;
    return objectClone({ ...cell.sides[rotatedSideIndex], x, y });
  });
  // console.log(`extendedMap[${y}][${x}] has borders: ${borders.join(', ')}`);
  return borders;
}

function isCellOutsideMap(mapMatrix, { x, y }) {
  const mapHeight = mapMatrix.length;
  const mapLenght = mapMatrix[0].length;
  return x < 0 || x >= mapLenght || y < 0 || y >= mapHeight;
}

function getRotationVariants(mapMatrix, newTile, position) {
  const cellBorders = getBorders(mapMatrix, position);
  let variants = [];
  const tileSides = newTile.sides.map(({ type }) => type);
  const tileSidesTwice = [...tileSides, ...tileSides];
  for (let k = 0; k < 4; k++) {
    if (canPutTileInCell(cellBorders, tileSidesTwice.slice(4 - k))) {
      variants.push(k);
    }
  }
  return variants;
}

function canPutTileInCell(cellBorders, tileSides) {
  return cellBorders.every(
    (border, i) => border.type === 'space' || border.type === tileSides[i]
  );
}

function hasntAnySideNeighbors(mapMatrix, y, x) {
  const sideNeighbors = [
    { x, y: y - 1 },
    { x: x + 1, y },
    { x, y: y + 1 },
    { x: x - 1, y }
  ];
  return sideNeighbors.every(
    ({ x, y }) => isCellOutsideMap(mapMatrix, { x, y }) || !mapMatrix[y][x]
  );
}

function hasSomeCornerNeighbor(mapMatrix, y, x) {
  const cornerNeighbors = [
    { x: x - 1, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x + 1, y: y + 1 },
    { x: x - 1, y: y + 1 }
  ];
  return cornerNeighbors.some(
    ({ x, y }) => !isCellOutsideMap(mapMatrix, { x, y }) && !!mapMatrix[y][x]
  );
}
//=======================================================================
class GameMap {
  constructor(initMap) {
    this.tilesMap = Array.isArray(initMap)
      ? objectClone(initMap)
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
          return objectClone(mapCell);
        }
        if (hasntAnySideNeighbors(extendedMap, i, j)) {
          return null;
        }
        const variants = getRotationVariants(extendedMap, newTile, {
          x: j,
          y: i
        });
        if (!variants.length) return null;
        variantsCount = variantsCount + variants.length;
        return objectClone({ ...newTile, variants });
      })
    );
    if (!variantsCount) {
      extendedMap.forEach((mapRaw, i) =>
        mapRaw.forEach((mapCell, j) => {
          if (mapCell !== null) {
            return;
          }
          if (
            hasntAnySideNeighbors(extendedMap, i, j) &&
            hasSomeCornerNeighbor(extendedMap, i, j)
          ) {
            renewedMap[i][j] = objectClone({
              ...newTile,
              variants: [0, 1, 2, 3]
            });
          }
        })
      );
    }
    return renewedMap;
  }

  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////

  selectArea(key, x, y) {
    const mapMatrix = this.tilesMap;
    let checkedPlaces = [];
    // let checkedPlaces = [{ owner: key, x, y }];
    let includedTiles = [{ owners: [key], x, y }];
    let openFlag = false;

    selectAreaRecursive(key, x, y);
    // console.log(`checkedPlaces: ${JSON.stringify(checkedPlaces)}`);
    // console.log(`includedTiles: ${JSON.stringify(includedTiles)}`);

    const pointsCount = calculatePoints(includedTiles, mapMatrix, openFlag);

    console.log(
      `${key} is ${openFlag ? 'open' : 'closed'}, points = ${pointsCount}`
    );

    includedTiles.forEach(({ owners, x, y }) => {
      owners.forEach(owner => {
        mapMatrix[y][x].places[owner].color = 'red';
      });
    });
    return mapMatrix;
    // return { tilesMap: this.tilesMap, timeStamp: this.timeStamp };
    /* -------------------------------------------------------*/
    function selectAreaRecursive(key, x, y) {
      // checkedTilesPositions.push({ x, y });
      // console.log(`>>> Cell [${x}][${y}] >>>`);
      if (isCellOutsideMap(mapMatrix, { x, y })) {
        console.error(`Cell [${x}][${y}] outside the map`);
        return;
      }
      // console.log(mapMatrix[y][x]);
      if (!mapMatrix[y][x]) return;
      if (
        checkedPlaces.some(
          place => place.x === x && place.y === y && place.owner === key
        )
      ) {
        return;
      }
      checkedPlaces.push({ owner: key, x, y });
      let ownSides = [];
      const { sides, rotation = 0 } = mapMatrix[y][x];
      sides.forEach(({ owner }, i) => {
        if (owner === key) ownSides.push((i + rotation) % 4);
      });
      // console.log(`ownSides: ${JSON.stringify(ownSides)}`);

      console.log(`>>> Cell [${x}][${y}] >>>`);

      const borders = getBorders(mapMatrix, { x, y });
      // console.log(`borders: ${JSON.stringify(borders)}`);

      ownSides.forEach(ownSideIndex => {
        const isThisBorderOpen = borders[ownSideIndex].type === 'space';
        if (isThisBorderOpen) openFlag = true;

        console.log(
          `borders[ownSideIndex=${ownSideIndex}].type = ${borders[ownSideIndex].type} `
        );
        if (isThisBorderOpen) return;
        const { owner, type, x, y } = borders[ownSideIndex];
        const tileWithSameXY = includedTiles.find(
          place => place.x === x && place.y === y
        );
        if (!tileWithSameXY) {
          includedTiles.push({ owners: [owner], x, y });
        }
        if (
          tileWithSameXY &&
          tileWithSameXY.owners.every(key => key !== owner)
        ) {
          tileWithSameXY.owners.push(owner);
        }

        selectAreaRecursive(owner, x, y);
      });
    }
    /* -------------------------------------------------------*/
  }
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////

  putTileOnMap(tile, position, rotation) {
    const extendedMap = GameMap.extendMap(this.tilesMap);
    if (isCellOutsideMap(extendedMap, position)) {
      return false;
    }
    let variants = getRotationVariants(extendedMap, tile, position);
    if (!variants.length || variants.every(variant => variant !== rotation)) {
      return false;
    }
    const { x, y } = position;

    if (!isCellOutsideMap(this.tilesMap, { x: x - 1, y: y - 1 })) {
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
