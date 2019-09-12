import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import GetSidesNames from './GetSidesNames';

const styles = {
  tileClass: {
    position: 'relative',
    width: '90px',
    height: '90px',
    border: '1px solid green',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

class Tile extends React.Component {
  render() {
    const { classes, tile, onClick } = this.props;
    if (!tile) {
      return <div className={classes.tileClass} onClick={onClick}></div>;
    }
    const rotation = tile.rotation || 0;

    return (
      <div className={classes.tileClass}>
        <GetSidesNames tile={tile} rotation={rotation} />
      </div>
    );
  }
}

Tile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Tile);
