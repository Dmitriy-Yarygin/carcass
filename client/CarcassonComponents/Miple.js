import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Star from '@material-ui/icons/Star';

const styles = {
  root: {
    // zIndex: 9,
    position: 'relative'
  },

  star: {
    zIndex: 11,
    position: 'absolute',
    width: '38px',
    height: '38px',
    top: '10px',
    left: '10px',
    transform: 'translate(-50%, -50%)'
  },
  starUnder: {
    zIndex: 10,
    position: 'absolute',
    width: '42px',
    height: '42px',
    top: '10px',
    left: '10px',
    transform: 'translate(-50%, -50%)',
    color: 'black'
  },

  name: {
    zIndex: 12,
    position: 'absolute',
    color: 'black',
    // fontSize: '0.6em',
    fontFamily: 'serif',
    fontWeight: 'bold',
    top: '10px',
    left: '10px',
    textShadow: '0 0 2px white'
    // transform: 'translate(-50%,-50%)'
  }
};

class Miple extends React.Component {
  render() {
    // console.log(`Miple render`);
    const { classes, description, rotation } = this.props;

    const antiRotationStyle = rotation
      ? { transform: `translate(-50%, -50%) rotate(${rotation * -90}deg)` }
      : { transform: 'translate(-50%, -50%)' };

    return (
      <div className={classes.root}>
        <Star className={classes.star} />
        <Star className={classes.starUnder} />
        {description.points >= 0 && (
          <span className={classes.name} style={antiRotationStyle}>
            {description.points}
          </span>
        )}
      </div>
    );
  }
}

Miple.propTypes = {
  classes: PropTypes.object.isRequired,
  description: PropTypes.object.isRequired
};

export default withStyles(styles)(Miple);
