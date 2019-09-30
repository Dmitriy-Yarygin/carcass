import React from 'react';
import PropTypes from 'prop-types';
import TileCover from './TileCover';
import MiplePlaces from './MiplePlacesContainer';
import GetSidesNames from './GetSidesNames';
import './Tile.css';
import './EtherealTile.css';

let timerId;

class EtherealTile extends React.PureComponent {
  state = { rotationIndex: 0, showThisVariants: false };

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

  onMouseOver = e => {
    timerId = null;
    this.setState({ showThisVariants: true });
  };
  onMouseOut = e => {
    console.log(e.target);
    this.setState({ showThisVariants: false });
  };

  render() {
    // console.log(this.props);
    const { tile, isVariantsVisible } = this.props;
    const { rotationIndex, showThisVariants } = this.state;
    const rotation = tile.variants[rotationIndex];

    // const showVariants = isVariantsVisible;

    return (
      <div
        className={
          isVariantsVisible || showThisVariants
            ? `tileClass ethereal`
            : `tileClass solidGreenBorder`
        }
        onClick={this.tileClick}
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
      >
        {(isVariantsVisible || showThisVariants) && (
          <>
            <TileCover tile={tile} rotation={rotation} />
            {/*  <GetSidesNames tile={tile} rotation={rotation} /> */}
            {/*  <MiplePlaces tile={tile} rotation={rotation} /> */}

            {tile.variants && tile.variants.length > 1 && (
              <button
                className="tileClass_btn_rotate"
                onClick={this.handleBtnClick}
              >
                &#8635;
              </button>
            )}
          </>
        )}
      </div>
    );
  }
}

EtherealTile.propTypes = {
  tile: PropTypes.object.isRequired
};

export default EtherealTile;
