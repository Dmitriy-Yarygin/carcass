const { objectClone } = require('../helpers/objectFunctions');
const { uniqueTiles } = require('./tiles');
const log = require('../helpers/logger')(__filename);

function getAllTilesInChessOrder() {
  const result = [];
  for (let y = 0; y < 3; y++) {
    result.push([]);

    if (y % 2) result[y].push(null);
    for (let x = 0; x < 9; x++) {
      result[y].push(uniqueTiles[y * 9 + x].tile, null);
    }
  }
  return result;
}
module.exports = getAllTilesInChessOrder;
