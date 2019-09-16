import React from 'react';
import PropTypes from 'prop-types';
import TileCover from './TileCover';
import MiplePlaces from './MiplePlaces';
import GetSidesNames from './GetSidesNames';
import './Tile.css';
import './EtherealTile.css';

class EtherealTile extends React.Component {
  state = { rotationIndex: 0 };

  handleBtnClick = e => {
    e.stopPropagation();
    const { tile } = this.props;
    if (tile.variants && tile.variants.length) {
      const rotationIndex =
        (this.state.rotationIndex + 1) % tile.variants.length;
      this.setState({ rotationIndex });
    }
  };

  tileClick = e => {
    const { onClick, position, tile } = this.props;
    onClick(position, tile.variants[this.state.rotationIndex]);
  };

  render() {
    // console.log(this.props);
    const { tile } = this.props;
    const { rotationIndex } = this.state;
    const rotation = tile.variants[rotationIndex];

    return (
      <div className="tileClass ethereal" onClick={this.tileClick}>
        <TileCover tile={tile} rotation={rotation} />
        <GetSidesNames tile={tile} rotation={rotation} />
        <MiplePlaces tile={tile} rotation={rotation} />

        {tile.variants && tile.variants.length > 1 && (
          <button
            className="tileClass_btn_rotate"
            onClick={this.handleBtnClick}
          >
            &#8635;
          </button>
        )}
      </div>
    );
  }
}

EtherealTile.propTypes = {
  tile: PropTypes.object.isRequired
};

export default EtherealTile;
