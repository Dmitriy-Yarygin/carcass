import React from 'react';
import PropTypes from 'prop-types';
import GetSidesNames from './GetSidesNames';
import './Tile.css';
import './EtherealTile.css';

class EtherealTile extends React.Component {
  state = { rotationIndex: 0 };

  componentDidMount() {
    // console.log(`EtherealTile componentDidMount`);
  }

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
        <GetSidesNames tile={tile} rotation={rotation} />
        {tile.variants && tile.variants.length > 1 && (
          <button
            className="tileClass_btn_rotate"
            onClick={this.handleBtnClick}
          >
            R
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
