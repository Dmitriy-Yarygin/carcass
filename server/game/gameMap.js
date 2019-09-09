const { startTile } = require('./tiles');

class GameMap {
  constructor(initMap) {
    this.tilesMap = Array.isArray(initMap) ? initMap : [[{ ...startTile }]];
    this.timeStamp = new Date();
  }

  get() {
    return { tilesMap: this.tilesMap, timeStamp: this.timeStamp };
  }
}

module.exports = GameMap;
