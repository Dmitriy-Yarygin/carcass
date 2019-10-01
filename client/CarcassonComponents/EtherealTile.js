import React from 'react';
import PropTypes from 'prop-types';
import TileCover from './TileCover';
import MiplePlaces from './MiplePlacesContainer';
import GetSidesNames from './GetSidesNames';
import './Tile.css';
import './EtherealTile.css';

class EtherealTile extends React.PureComponent {
  state = { rotationIndex: 0, isMouseEnter: false };

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
    e.stopPropagation();
    const { onClick, position, tile, whatVariantsShow } = this.props;
    const {
      isVariantsVisible,
      shownVariantPosition,
      changeShownVariant,
      isItMouse
    } = whatVariantsShow;

    const isVariantShown =
      isVariantsVisible ||
      (isItMouse && this.state.isMouseEnter) ||
      (!!shownVariantPosition &&
        shownVariantPosition.x === position.x &&
        shownVariantPosition.y === position.y);
    if (isVariantShown) {
      onClick(position, tile.variants[this.state.rotationIndex]);
      return;
    }
    changeShownVariant(position);
  };

  onMouseEnter = e => {
    if (!this.state.isMouseEnter) this.setState({ isMouseEnter: true });
  };
  onMouseLeave = e => {
    if (this.state.isMouseEnter) this.setState({ isMouseEnter: false });
  };

  render() {
    const { position, tile, whatVariantsShow } = this.props;
    const { isVariantsVisible, shownVariantPosition } = whatVariantsShow;
    const { rotationIndex } = this.state;
    const rotation = tile.variants[rotationIndex];

    const showThisVariants =
      isVariantsVisible ||
      this.state.isMouseEnter ||
      (shownVariantPosition &&
        shownVariantPosition.x === position.x &&
        shownVariantPosition.y === position.y);

    if (showThisVariants)
      return (
        <div
          className={`tileClass ethereal`}
          onClick={this.tileClick}
          onMouseLeave={this.onMouseLeave}
        >
          <TileCover tile={tile} rotation={rotation} className={''} />
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
        </div>
      );
    return (
      <div
        className={`tileClass solidGreenBorder`}
        onClick={this.tileClick}
        onMouseEnter={this.onMouseEnter}
      >
        <b className={'ethereal-cross'}> + </b>
      </div>
    );
  }
}

EtherealTile.propTypes = {
  tile: PropTypes.object.isRequired
};

export default EtherealTile;
