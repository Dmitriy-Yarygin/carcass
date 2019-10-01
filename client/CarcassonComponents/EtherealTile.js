import React from 'react';
import PropTypes from 'prop-types';
import TileCover from './TileCover';
import MiplePlaces from './MiplePlacesContainer';
import GetSidesNames from './GetSidesNames';
import './Tile.css';
import './EtherealTile.css';

let timerId;

class EtherealTile extends React.PureComponent {
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

  onMouseOver = () => {
    const { position, whatVariantsShow } = this.props;
    const { changeShownVariant } = whatVariantsShow;
    changeShownVariant(position);
  };

  render() {
    // console.log(this.props);
    const { position, tile, whatVariantsShow } = this.props;
    const { isVariantsVisible, shownVariantPosition } = whatVariantsShow;
    const { rotationIndex } = this.state;
    const rotation = tile.variants[rotationIndex];

    const showThisVariants =
      isVariantsVisible ||
      (shownVariantPosition &&
        shownVariantPosition.x === position.x &&
        shownVariantPosition.y === position.y);

    return (
      <div
        className={
          showThisVariants ? `tileClass ethereal` : `tileClass solidGreenBorder`
        }
        onClick={this.tileClick}
        onMouseOver={this.onMouseOver}
      >
        {showThisVariants && (
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
