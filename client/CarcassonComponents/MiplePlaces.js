import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Miple from './Miple';

const styles = {
  root: { position: 'absolute', width: '100%', height: '100%' },
  subRoot: { position: 'relative', width: '100%', height: '100%' },

  pointStyle: {
    zIndex: 9,
    position: 'absolute',
    padding: '1px',
    color: 'orange',
    cursor: 'pointer',
    height: '20px',
    width: '20px',
    border: '1px solid seagreen',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)'
  }
};

class MiplePlaces extends React.Component {
  mipleClick = name => e => {
    if (this.props.onMipleClick) {
      this.props.onMipleClick(name, this.props.position);
      e.stopPropagation();
    }
  };

  render() {
    // console.log(`MiplePlaces render`);
    const { classes, tile, rotation } = this.props;
    let points = [];
    if (tile.places) {
      for (let key in tile.places) {
        const { x, y, color } = tile.places[key];
        if (!x || !y) {
          console.error(`Check cordinates of ${tile.name} !`);
          continue;
        }
        points.push({ name: key, x, y, color });
      }
    }

    // console.log(points);

    const rotationStyle = rotation
      ? { transform: `rotate(${rotation * 90}deg)` }
      : {};

    return (
      <div className={classes.root}>
        <div className={classes.subRoot} style={rotationStyle}>
          {points.map(({ name, x, y, color }) => (
            <div
              key={name}
              className={classes.pointStyle}
              style={{ left: x, top: y, color }}
              onClick={this.mipleClick(name)}
            >
              <Miple ppp={{ name }} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

MiplePlaces.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MiplePlaces);
