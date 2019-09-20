const { objectClone } = require('../helpers/objectFunctions');
const { startTile } = require('./tiles');

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

  selectArea(key, x, y, extraCondition) {
    const { tilesMap } = this;
    const placeType = tilesMap[y][x].places[key].name;
    console.log(`selectArea =================  ${placeType}  =========`);
    let checkedPlaces = [];
    // let checkedPlaces = [{ owner: key, x, y }];
    let includedTiles = [{ owners: [key], x, y }];
    if (extraCondition && !extraCondition(tilesMap[y][x], key)) {
      includedTiles = [];
    }
    let openFlag = false;

    selectAreaRecursive(key, x, y);
    // console.log(`checkedPlaces: ${JSON.stringify(checkedPlaces)}`);
    // console.log(`includedTiles: ${JSON.stringify(includedTiles)}`);

    return { includedTiles, isAreaOpen: openFlag };
    // return { tilesMap: this.tilesMap, timeStamp: this.timeStamp };
    /* -------------------------------------------------------*/
    function selectAreaRecursive(key, x, y) {
      // checkedTilesPositions.push({ x, y });
      // console.log(`selectAreaRecursive Cell [${x}][${y}] >>>`);
      if (isCellOutsideMap(tilesMap, { x, y })) {
        console.error(`Cell [${x}][${y}] outside the map`);
        return;
      }
      // console.log(tilesMap[y][x]);
      if (!tilesMap[y][x]) return;
      if (
        checkedPlaces.some(
          place => place.x === x && place.y === y && place.owner === key
        )
      ) {
        return;
      }
      checkedPlaces.push({ owner: key, x, y });
      let ownSides = [];

      const { sides, rotation = 0 } = tilesMap[y][x];
      sides.forEach((side, i) => {
        const rotatedSideIndex = (i + rotation) % 4;
        if (side.owner === key) {
          ownSides.push({ i: rotatedSideIndex, fromRoad: null });
        }
        // console.log(`key=${key}, side${JSON.stringify(side)}`);
        if (
          (placeType === 'field' &&
            side.type === 'road' &&
            side.left === key) ||
          side.right === key
        ) {
          const fromRoad = side.left === key ? 'right' : 'left';
          ownSides.push({ i: rotatedSideIndex, fromRoad });
        }
      });
      // console.log(`ownSides: ${JSON.stringify(ownSides)}`);
      // console.log(`>>> Cell [${x}][${y}] >>>`);

      const borders = getBorders(tilesMap, { x, y });
      // console.log(`borders: ${JSON.stringify(borders)}`);

      ownSides.forEach(({ i, fromRoad }) => {
        const isThisBorderOpen = borders[i].type === 'space';
        if (isThisBorderOpen) openFlag = true;

        // console.log(`borders[i=${i}] = ${JSON.stringify(borders[i])} `);
        if (isThisBorderOpen) return;
        const { x, y } = borders[i];
        const owner =
          placeType === 'field' && fromRoad
            ? borders[i][fromRoad]
            : borders[i].owner;

        const tileWithSameXY = includedTiles.find(
          place => place.x === x && place.y === y
        );

        if (!tileWithSameXY) {
          if (
            !extraCondition ||
            (extraCondition && extraCondition(tilesMap[y][x], owner))
          ) {
            includedTiles.push({ owners: [owner], x, y });
          }
        }

        if (
          tileWithSameXY &&
          tileWithSameXY.owners.every(key => key !== owner)
        ) {
          if (
            !extraCondition ||
            (extraCondition && extraCondition(tilesMap[y][x], owner))
          ) {
            tileWithSameXY.owners.push(owner);
          }
        }
        // console.log(includedTiles.map(({ x, y }) => `${x}:${y}`));

        selectAreaRecursive(owner, x, y);
      });
    }
    /* -------------------------------------------------------*/
  }
  ///////////////////////////////////////////////////////////////////////
  calculatePoints(key, x, y) {
    const { tilesMap } = this;
    const placeType = tilesMap[y][x].places[key].name;
    if (placeType === 'field') {
      return this.calculateFieldPoints(key, x, y);
    }
    if (placeType === 'monastery') {
      return this.calculateMonasteryPoints(key, x, y);
    }

    const { includedTiles, isAreaOpen } = this.selectArea(key, x, y);

    let points = includedTiles.length;

    if (placeType === 'town') {
      includedTiles.forEach(({ owners, x, y }) => {
        owners.forEach(owner => {
          // console.log(tilesMap[y][x].places[owner]);
          if (tilesMap[y][x].places[owner].shields)
            points += tilesMap[y][x].places[owner].shields;
        });
      });
      if (!isAreaOpen) points *= 2;
    }

    // if (placeType === 'road') // just return points = includedTiles.length;

    return points;
  }

  ///////////////////////////////////////////////////////////////////////
  calculateFieldPoints(key, x, y) {
    function extraCondition(thisTile, key) {
      // console.log(        `extraCondition(thisTile=${JSON.stringify(thisTile)}, key=${key})`      );
      return (
        !thisTile.places[key].disConnected &&
        thisTile.sides.some(({ type }) => type === 'town')
      );
    }
    const { tilesMap } = this;
    const placeType = tilesMap[y][x].places[key].name;
    if (placeType !== 'field')
      return console.error(
        `calculateFieldPoints works with "fields" areas, but receive "${placeType}"`
      );
    const { includedTiles } = this.selectArea(key, x, y, extraCondition);
    console.log(`=====>>> includedTiles=${JSON.stringify(includedTiles)}`);

    const checkedTownsTiles = [];
    let closedTownsCount = 0;

    includedTiles.forEach(({ x, y }) => {
      const townsKey = [];
      const { places } = tilesMap[y][x];
      for (let key in places) {
        if (places[key].name === 'town' && townsKey.every(k => k !== key)) {
          townsKey.push(key);
        }
      }
      console.log(`townsKey=${JSON.stringify(townsKey)}`);

      townsKey.forEach(townKey => {
        const selectTownResult = this.selectArea(townKey, x, y);
        console.log(`selectTownResult=${JSON.stringify(selectTownResult)}`);
        // selectTownResult.includedTiles, selectTownResult.isAreaOpen

        const isSomeTilesAlreadyCounted = selectTownResult.includedTiles.every(
          ({ owners, x, y }) =>
            owners.some(owner =>
              checkedTownsTiles.some(
                tile => tile.owner === owner && tile.x === x && tile.y === y
              )
            )
        );

        if (!isSomeTilesAlreadyCounted && !selectTownResult.isAreaOpen) {
          closedTownsCount++;
        }
        // if finded town tiles not in checkedTownsTiles, then add them
        selectTownResult.includedTiles.forEach(({ owners, x, y }) =>
          owners.forEach(owner => {
            if (
              !checkedTownsTiles.find(
                tile => tile.owner === owner && tile.x === x && tile.y === y
              )
            ) {
              checkedTownsTiles.push({ owner, x, y });
            }
          })
        );
      });
    });

    // console.log(`includedTiles=${JSON.stringify(includedTiles)}`);
    // includedTiles=[{"owners":["B"],"x":3,"y":2},{"owners":["B"],"x":2,"y":2}]
    return closedTownsCount * 3;
  }
  ///////////////////////////////////////////////////////////////////////
  calculateMonasteryPoints(key, x, y) {
    const neighbors = [
      { x, y: y - 1 },
      { x: x + 1, y: y - 1 },
      { x: x + 1, y },
      { x: x + 1, y: y + 1 },
      { x, y: y + 1 },
      { x: x - 1, y: y + 1 },
      { x: x - 1, y },
      { x: x - 1, y: y - 1 }
    ];
    const { tilesMap } = this;
    const placeType = tilesMap[y][x].places[key].name;
    if (placeType !== 'monastery')
      return console.error(
        `calculateMonasteryPoints works with "monasteries" areas, but receive "${placeType}"`
      );
    let points = 1;
    neighbors.forEach(position => {
      const { x, y } = position;
      if (!isCellOutsideMap(tilesMap, position) && tilesMap[y][x]) {
        points++;
      }
    });
    return points;
  }
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
    if (y < h) {
      extendedMap.pop();
      y + 1;
    }
    if (x < w) {
      extendedMap.forEach(raw => raw.pop());
      x + 1;
    }
    if (y > 0) {
      extendedMap.shift();
    }
    if (x > 0) {
      extendedMap.forEach(raw => raw.shift());
    }

    this.tilesMap = extendedMap;

    return true;
  }

  setMipleOnMap(userId, key, lastTilePosition) {
    console.error(userId, key, JSON.stringify(lastTilePosition));

    let { x, y } = lastTilePosition;
    x--;
    y--;
    if (key) {
      console.log(this.tilesMap);
      this.tilesMap[y][x].places[key].occupied = userId;
      console.log(
        `>>>>>>>>>>>>>> this.tilesMap[${y}][${x}] = ${JSON.stringify(
          this.tilesMap[y][x]
        )}`
      );
    }

    console.log(
      `>>>>>>>>>>>>>> this.tilesMap = ${JSON.stringify(this.tilesMap)}`
    );
  }
}

module.exports = GameMap;
