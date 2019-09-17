import React from 'react';
import PropTypes from 'prop-types';
import GetSidesNames from './GetSidesNames';
import MiplePlaces from './MiplePlaces';
import TileCover from './TileCover';
import withStyles from '@material-ui/core/styles/withStyles';

import './Tile.css';

const styles = {};

class Tile extends React.Component {
  render() {
    const { classes, position, tile, onClick, onMipleClick } = this.props;

    if (!tile || !tile.name) {
      return <div className="tileClass" onClick={onClick}></div>;
    }

    const rotation = tile.rotation || 0;

    return (
      <div className="tileClass">
        <TileCover tile={tile} rotation={rotation} />
        <GetSidesNames tile={tile} rotation={rotation} />
        <MiplePlaces
          position={position}
          tile={tile}
          rotation={rotation}
          onMipleClick={onMipleClick}
        />
      </div>
    );
  }
}

Tile.propTypes = {
  // classes: PropTypes.object.isRequired,
  tile: PropTypes.object
};

export default withStyles(styles)(Tile);
