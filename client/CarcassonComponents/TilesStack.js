import React from 'react';
import PropTypes from 'prop-types';
import TileCover from './TileCover';
import GetSidesNames from './GetSidesNames';
import './Tile.css';
import './TileStack.css';

class TileStack extends React.Component {
  render() {
    console.log(`TileStack render this.props = ${JSON.stringify(this.props)} `);
    const { gameState, onClick, blinkFlag } = this.props;
    const { tile, tilesInStack } = gameState;

    const emptyTileClass = blinkFlag ? `tileClass blink` : `tileClass`;

    const thickness = Math.round(tilesInStack / 10);
    const cls = { boxShadow: `${thickness}px ${thickness}px` };

    if (!tile) {
      return (
        <div className={emptyTileClass} onClick={onClick} style={cls}>
          <h2 style={{ zIndex: 1 }}>{tilesInStack}</h2>
          <TileCover tile={tile} />
        </div>
      );
    }

    return (
      <div className="tileClass" style={cls}>
        <TileCover tile={tile} />
        <GetSidesNames tile={tile} />
      </div>
    );
  }
}

TileStack.propTypes = {
  gameState: PropTypes.object
};

export default TileStack;
