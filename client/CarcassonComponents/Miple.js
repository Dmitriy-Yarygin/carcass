import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import mipleStar from './star.svg';
import './Miple.css';
import Star from '@material-ui/icons/Star';

const styles = {
  root: {
    // zIndex: 9,
    position: 'relative'
  },
  star: {
    position: 'absolute',
    // width: '20px',
    // height: '20px',
    top: '10px',
    left: '10px',
    transform: 'translate(-50%, -50%)'
  },
  name: {
    position: 'absolute',
    color: 'black',
    fontSize: '0.6em',

    top: '10px',
    left: '10px',
    transform: 'translate(-50%,-50%)'
  }
};

class Miple extends React.Component {
  render() {
    // console.log(`Miple render`);
    const { classes, ppp } = this.props;
    const { name } = ppp;

    return (
      <div className={classes.root}>
        <Star className={classes.star} />
        {/* <span className={classes.star}>&#9733;</span> */}
        <span className={classes.name}>{name}</span>
      </div>
    );
  }
}

Miple.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Miple);
