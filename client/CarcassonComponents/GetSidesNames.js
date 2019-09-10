import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  tileClass_name: {
    display: 'flex'
  },
  tileClass_side0: {
    width: '100%',
    textAlign: 'center',
    position: 'absolute',
    top: 0
  },
  tileClass_side1: {
    width: '80%',
    textAlign: 'center',
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'rotate(90deg)'
  },
  tileClass_side2: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    marginRight: '-50%',
    transform: 'translate(-50%, -100%)'
  },
  tileClass_side3: {
    width: '80%',
    textAlign: 'center',
    position: 'absolute',
    top: '40%',
    left: '-30%',
    transform: 'rotate(90deg)'
  }
};

class GetSidesNames extends React.Component {
  render() {
    const { classes, tile } = this.props;
    return (
      <>
        <h3 className={classes.tileClass_name}>{tile.name}</h3>
        {tile.sides.map(({ type, owner }, i) => (
          <span
            key={i}
            className={classes[`tileClass_side${i}`]}
          >{`${type} ${owner}`}</span>
        ))}
      </>
    );
  }
}

GetSidesNames.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GetSidesNames);
