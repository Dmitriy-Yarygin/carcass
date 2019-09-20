import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CardMedia from '@material-ui/core/CardMedia';

const styles = {
  media: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  }
};

class TileCover extends React.Component {
  render() {
    const { classes, tile, rotation } = this.props;
    const rotationClass = rotation ? `rotate${rotation}` : 'rotate0';
    // console.log(rotationClass);

    const rotationStyle = rotation
      ? { transform: `rotate(${rotation * 90}deg)` }
      : {};

    return (
      <CardMedia
        className={classes.media}
        style={rotationStyle}
        image={tile && tile.image ? tile.image : '/images/tiles/tileBack.jpg'}
        title={
          tile && tile.name
            ? tile.name
            : 'This tile name still unknown. You should take it in your turn.'
        }
      />
    );
  }
}

TileCover.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TileCover);
