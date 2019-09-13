import React from 'react';
import PropTypes from 'prop-types';
import GetSidesNames from './GetSidesNames';
import './Tile.css';

class Tile extends React.Component {
  render() {
    const { tile, onClick } = this.props;
    if (!tile) {
      return <div className="tileClass" onClick={onClick}></div>;
    }
    const rotation = tile.rotation || 0;

    return (
      <div className="tileClass">
        <GetSidesNames tile={tile} rotation={rotation} />
      </div>
    );
  }
}

Tile.propTypes = {
  tile: PropTypes.object
};

export default Tile;
