import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
const rotate0 = {
  margin: 0,
  padding: 0,
  width: '100%',
  height: '100%',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
const styles = {
  tileClass_name: {
    display: 'flex'
  },
  tileClass_side0: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginRight: '-50%',
    transform: 'translate(-50%, 0)'
  },
  tileClass_side1: {
    width: '80%',
    textAlign: 'center',
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'rotate(-90deg)'
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
  },
  rotate0,
  rotate1: {
    ...rotate0,
    transform: 'rotate(90deg)'
  },
  rotate2: {
    ...rotate0,
    transform: 'rotate(180deg)'
  },
  rotate3: {
    ...rotate0,
    transform: 'rotate(270deg)'
  }
};

class GetSidesNames extends React.Component {
  render() {
    const { classes, tile, rotation } = this.props;
    // console.log(`GetSidesNames render`);
    // console.log(tile);

    const rotationClass = rotation ? `rotate${rotation}` : 'rotate0';
    // console.log(rotationClass);
    return (
      <div className={classes[rotationClass]}>
        <h3 className={classes.tileClass_name}>{tile.name}</h3>
        {tile.sides &&
          tile.sides.map(({ type, owner }, i) => (
            <span
              key={i}
              className={classes[`tileClass_side${i}`]}
            >{`${type} ${owner}`}</span>
          ))}
      </div>
    );
  }
}

GetSidesNames.propTypes = {
  classes: PropTypes.object.isRequired,
  tile: PropTypes.object.isRequired,
  rotation: PropTypes.number
};

export default withStyles(styles)(GetSidesNames);
