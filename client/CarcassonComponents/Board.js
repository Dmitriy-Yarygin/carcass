import React from 'react';
// import PropTypes from "prop-types";
import withStyles from '@material-ui/core/styles/withStyles';
// import MapView from './MapView';
function MapView(props) {
  return <p>MapView</p>;
}

const styles = {
  root: {
    //   margin: 20,
    //   padding: 5,
    //   width: 1000
  }
};

class Board extends React.Component {
  state = {
    tile: null,
    tilesMap: gameMap.get(),
    jumbledTiles: tilesStore.getTilesInBox()
  };

  handleTileClick = () => {
    const tile = tilesStore.getTile();
    this.setState({ tile });
  };
  handleBtnClick = () => {
    const jumbledTiles = tilesStore.jumble(); //.reverse();
    this.setState({ jumbledTiles });
  };
  handleBtn2Click = () => {
    console.log(this.state);
  };

  render() {
    // console.log(`Board render`);
    const { classes } = this.props;
    const { tile, tilesMap, jumbledTiles } = this.state;
    return (
      <div className="board">
        <div className="sideBar">
          <Tile tile={tile} onClick={this.handleTileClick} />
          <button onClick={this.handleBtnClick}>Jumble</button>
          <button onClick={this.handleBtn2Click}>State</button>
          {jumbledTiles.map(({ name }, i) => (
            <p key={i}>{name}</p>
          ))}
        </div>
        <MapView tilesMap={tilesMap} newTile={tile} />
      </div>
    );
  }
}

Board.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Board);
