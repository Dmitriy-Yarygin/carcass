import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Tile from './Tile';
import EtherealTile from './EtherealTile';

const styles = {
  root: {
    display: 'flex'
  }
};

class MapRaw extends React.Component {
  render() {
    const { classes, raw, onClick, y, roomId, lastTilePosition } = this.props;
    return (
      <div className={classes.root}>
        {raw.map((cell, i) => {
          if (cell && cell.variants) {
            return (
              <EtherealTile
                key={i}
                position={{ x: i, y }}
                tile={cell}
                onClick={onClick}
              />
            );
          }
          return (
            <Tile
              key={i}
              position={{ x: i, y }}
              tile={cell}
              roomId={roomId}
              lastTilePosition={lastTilePosition}
            />
          );
        })}
      </div>
    );
  }
}

MapRaw.propTypes = {
  classes: PropTypes.object.isRequired,
  lastTilePosition: PropTypes.object
};

export default withStyles(styles)(MapRaw);
