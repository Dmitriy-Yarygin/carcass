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
    position: 'absolute',
    width: '42px',
    height: '42px',
    top: '10px',
    left: '10px',
    transform: 'translate(-50%, -50%)'
    // border: '1px dotted black'
  }
};

class Miple extends React.Component {
  render() {
    // console.log(`Miple render`);
    const { classes, description } = this.props;
    const { name } = description;

    return (
      <div className={classes.root}>
        <Star className={classes.star} />
      </div>
    );
  }
}

Miple.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Miple);
