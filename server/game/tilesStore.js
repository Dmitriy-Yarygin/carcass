const { uniqueTiles } = require('./tiles');
const log = require('../helpers/logger')(__filename);

class TilesStore {
  constructor(tiles) {
    this.tilesInBox = tiles || [];
    if (!tiles) {
      uniqueTiles.forEach(({ quantity, tile }) => {
        for (let i = 0; i < quantity; i++) {
          this.tilesInBox.push({ ...tile });
        }
      });
    }
    this.jumble();
    log.warn(tiles);
  }

  jumble() {
    let jumbledArray = [];
    let totalElements = this.tilesInBox.length;
    let flagsArray = new Array(totalElements);
    while (totalElements > jumbledArray.length) {
      let i = Math.floor(Math.random() * totalElements);
      if (flagsArray[i]) continue;
      flagsArray[i] = true;
      jumbledArray.push(this.tilesInBox[i]);
    }
    return (this.tilesInBox = [...jumbledArray]);
  }

  getTilesInBox() {
    return [...this.tilesInBox];
  }
  getTile() {
    const i = this.tilesInBox.length - 1;
    if (i) return { ...this.tilesInBox[i] };
    return null;
  }
  popTile() {
    return this.tilesInBox.pop();
  }
}

module.exports = TilesStore;
