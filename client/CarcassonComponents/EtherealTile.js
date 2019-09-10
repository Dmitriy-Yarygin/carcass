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
    justifyContent: 'center',

    background: 'yellow'
    /*   transform: rotate(25deg); */
    // animationName: blink,
    // animationDuration: '2s',
    // animationIterationCount: infinite
  },
  //   @keyframes blink {
  //     0% { opacity: 1 }
  //     50% { opacity: 0.3 }
  //     100% { opacity: 1 }
  //   }
  tileClass_btn_rotate: {
    fontSize: '0.5em',
    position: 'absolute',
    top: '0%',
    left: '100%',
    transform: 'translate(-100%, 0%)'
  }
};

function MapView(props) {
  return <p>MapView</p>;
}

class EtherealTile extends React.Component {
  render() {
    const { classes, tile, onClick } = this.props;
    return (
      <div className={classes.ethereal}>
        <GetSidesNames tile={tile} />
        {tile.variants && tile.variants.length > 1 && (
          <button className={classes.tileClass_btn_rotate}>R</button>
        )}
      </div>
    );
  }
}

EtherealTile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EtherealTile);
