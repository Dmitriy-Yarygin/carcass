import React from 'react';
import PropTypes from 'prop-types';
import GetSidesNames from './GetSidesNames';
import './Tile.css';
import './TileStack.css';

class TileStack extends React.Component {
  render() {
    console.log(`TileStack render this.props = ${JSON.stringify(this.props)} `);
    const { gameState, onClick, blinkFlag } = this.props;
    const { tile, tilesInStack } = gameState;

    const emptyTileClass = blinkFlag ? `tileClass blink` : `tileClass`;

    if (!tile) {
      return (
        <div className={emptyTileClass} onClick={onClick}>
          <h2>{tilesInStack}</h2>
        </div>
      );
    }

    return (
      <div className="tileClass">
        <GetSidesNames tile={tile} />
      </div>
    );
  }
}

TileStack.propTypes = {
  gameState: PropTypes.object
};

export default TileStack;
