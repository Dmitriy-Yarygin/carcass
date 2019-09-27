const { objectClone } = require('../helpers/objectFunctions');
const { startTile } = require('./tiles');

function getSideNeighborsCoordinates(x, y) {
  return [
    { x, y: y - 1, side: 2 },
    { x: x + 1, y, side: 3 },
    { x, y: y + 1, side: 0 },
    { x: x - 1, y, side: 1 }
  ];
}

function getCornerNeighborsCoordinates(x, y) {
  return [
    { x: x - 1, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x + 1, y: y + 1 },
    { x: x - 1, y: y + 1 }
  ];
}
function getAllNeighborsCoordinates(x, y) {
  const sideNeighborsCoordinates = getSideNeighborsCoordinates(x, y);
  const cornerNeighborsCoordinates = getCornerNeighborsCoordinates(x, y);
  return [...sideNeighborsCoordinates, ...cornerNeighborsCoordinates];
}

function getBorders(mapMatrix, { x, y }) {
  // console.log(`mapMatrix [${y}][${x}]`);
  const neighbors = getSideNeighborsCoordinates(x, y);
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
  const sideNeighbors = getSideNeighborsCoordinates(x, y);
  return sideNeighbors.every(
    ({ x, y }) => isCellOutsideMap(mapMatrix, { x, y }) || !mapMatrix[y][x]
  );
}

function hasSomeCornerNeighbor(mapMatrix, y, x) {
  const cornerNeighbors = getCornerNeighborsCoordinates(x, y);
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

  getTile(x, y) {
    if (isCellOutsideMap(this.tilesMap, { x, y })) {
      console.error(`Cell ${x}:${y} is outside!`);
      return null;
    }
    return this.tilesMap[y][x];
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
    // console.log(`selectArea =================  ${placeType}  =========`);
    let checkedPlaces = [];
    // let checkedPlaces = [{ owner: key, x, y }];
    let includedTiles = [{ owners: [key], x, y }];
    if (extraCondition && !extraCondition(tilesMap[y][x], key)) {
      includedTiles = [];
    }
    let openFlag = false;
    const miples = {};

    selectAreaRecursive(key, x, y);
    // console.log(`checkedPlaces: ${JSON.stringify(checkedPlaces)}`);
    // console.log(`includedTiles: ${JSON.stringify(includedTiles)}`);

    return { includedTiles, isAreaOpen: openFlag, miples };
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

      const { occupied } = tilesMap[y][x].places[key];
      if (occupied) {
        if (!miples[occupied]) {
          miples[occupied] = { locations: [{ key, x, y }] };
        } else {
          miples[occupied].locations.push({ key, x, y });
        }
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
      return this.calculateMonasteryPoints(x, y);
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
    // console.log(`=====>>> includedTiles=${JSON.stringify(includedTiles)}`);

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
      // console.log(`townsKey=${JSON.stringify(townsKey)}`);

      townsKey.forEach(townKey => {
        const selectTownResult = this.selectArea(townKey, x, y);
        // console.log(`selectTownResult=${JSON.stringify(selectTownResult)}`);
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
  calculateMonasteryPoints(x, y) {
    const neighbors = getAllNeighborsCoordinates(x, y);
    const { tilesMap } = this;
    const { center } = tilesMap[y][x];
    if (center && center.type && center.type !== 'monastery')
      return console.error(
        `calculateMonasteryPoints works with "monasteries" areas!"`
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
    let lastTilePosition = { x: x - 1, y: y - 1 };

    if (!isCellOutsideMap(this.tilesMap, lastTilePosition)) {
      this.tilesMap[y - 1][x - 1] = { ...tile, rotation };
      return lastTilePosition;
    }

    extendedMap[y][x] = { ...tile, rotation };

    const h = extendedMap.length - 1;
    const w = extendedMap[0].length - 1;
    if (y < h) {
      extendedMap.pop();
    }
    if (x < w) {
      extendedMap.forEach(raw => raw.pop());
    }
    if (y > 0) {
      extendedMap.shift();
    }
    if (x > 0) {
      extendedMap.forEach(raw => raw.shift());
    }

    this.tilesMap = extendedMap;
    return { x: x ? x - 1 : 0, y: y ? y - 1 : 0 };
  }

  isItPossibleSetMipleOnMap(key, { x, y }) {
    if (!key) return false;
    const { miples } = this.selectArea(key, x, y);
    return !Object.keys(miples).length;
  }

  setMipleOnMap(userId, key, { x, y }) {
    if (!this.isItPossibleSetMipleOnMap(key, { x, y })) return false;
    this.tilesMap[y][x].places[key].occupied = userId;
    return true;
  }

  finalScoresCount() {
    console.log('@@@@@@@@@@@@@@@@  finalScoresCount  @@@@@@@@@@@@@@@@');
    // console.log(this.tilesMap);
    this.tilesMap.forEach((raw, y) => {
      raw.forEach((cell, x) => {
        if (!cell) return;
        this.endTurnScoresCount({ x, y }, true);
      });
    });
  }

  endTurnScoresCount({ x, y }, isFinal) {
    if (isCellOutsideMap(this.tilesMap, { x, y })) return;
    // check all neigbors if there are monasteries
    const neighborsCoordinates = getAllNeighborsCoordinates(x, y);
    [{ x, y }, ...neighborsCoordinates].forEach(({ x, y }) => {
      // console.log(`>>> x=${x}:y=${y} `);
      const tile = this.getTile(x, y);
      if (
        tile &&
        tile.center &&
        tile.center.type &&
        tile.center.type === 'monastery' &&
        tile.places[tile.center.owner].occupied &&
        !tile.places[tile.center.owner].points
      ) {
        const points = this.calculateMonasteryPoints(x, y);
        if (points === 9 || isFinal)
          tile.places[tile.center.owner].points = points;
      }
    });
    /// check all thisTile places for closing roads or towns
    const { places } = this.tilesMap[y][x];
    // console.log('<<<<<<< places >>>>>>>>>');
    // console.log(places);
    for (let key in places) {
      if (places[key].points || places[key].points === 0) continue;
      if (places[key].name === 'monastery') continue;
      if (places[key].name === 'field') {
        if (isFinal) {
          // TODO final count for peasants and fields
          // TODO final count for peasants and fields
          // TODO final count for peasants and fields
          // TODO final count for peasants and fields
          // TODO final count for peasants and fields
          // TODO final count for peasants and fields
          // TODO final count for peasants and fields
        }
        continue;
      }
      const { isAreaOpen, miples } = this.selectArea(key, x, y);
      const rivals = Object.entries(miples);
      if ((isFinal || !isAreaOpen) && rivals.length) {
        const { key, x, y } = rivals[0][1].locations[0];
        const points = this.calculatePoints(key, x, y);
        if (rivals.length === 1) {
          this.tilesMap[y][x].places[key].points = points;
        } else {
          // console.log(` choose bigger knight :) ${JSON.stringify(rivals)}`);
          const miplesCounts = rivals.map(elem => elem[1].locations.length);
          const maxMiples = Math.max(...miplesCounts);
          const winners = rivals.filter(
            elem => elem[1].locations.length === maxMiples
          );
          winners.forEach(winner => {
            const { key, x, y } = winner[1].locations[0];
            this.tilesMap[y][x].places[key].points = points;
          });
        }
      }
    }
  }

  takeOffMiple(userId, key, position, progress) {
    if (!key || !position || !progress) return false;

    const x = position.x - 1;
    const y = position.y - 1;
    const tile = this.getTile(x, y);
    const thisPlaceName = tile.places[key].name;

    if (
      !tile.places[key] ||
      !tile.places[key].occupied ||
      tile.places[key].occupied !== userId
    ) {
      return false;
    }

    if (tile.places[key].points && tile.places[key].points > 0) {
      progress[userId].scores += tile.places[key].points;
      progress[userId].freeMiples++;
      tile.places[key].points = -tile.places[key].points;
      tile.places[key].occupied = null;

      if (thisPlaceName === 'monastery') return true;

      const { miples } = this.selectArea(key, x, y);
      if (
        miples[userId] &&
        miples[userId].locations &&
        miples[userId].locations.length
      ) {
        miples[userId].locations.forEach(({ key, x, y }) => {
          progress[userId].freeMiples++;
          this.tilesMap[y][x].places[key].points = null;
          this.tilesMap[y][x].places[key].occupied = null;
        });
      }

      return true;
    } else if (thisPlaceName === 'road' || thisPlaceName === 'town') {
      // console.log(`Check looser (knight or robber ) miple`);
      const { isAreaOpen } = this.selectArea(key, x, y);
      if (isAreaOpen) return false;
      progress[userId].freeMiples++;
      tile.places[key].occupied = null;
      return true;
    }

    return false;
  }
  // FORCEsetMiple  only for development testing
  FORCEsetMiple(userId, key, position) {
    const x = position.x - 1;
    const y = position.y - 1;
    const tile = this.getTile(x, y);
    tile.places[key].occupied = userId;
    tile.places[key].points = 0;
  }
}

module.exports = GameMap;
