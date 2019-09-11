import React from 'react';
import PropTypes from 'prop-types';
import GetSidesNames from './GetSidesNames';
import './EtherealTile.css';

class EtherealTile extends React.Component {
  state = { rotation: 0 };

  handleBtnClick = () => {
    let rotation = (this.state.rotation + 1) % 4;
    console.log(rotation);
    this.setState({ rotation });
  };

  render() {
    const { tile, onClick } = this.props;
    return (
      <div className="ethereal">
        <GetSidesNames tile={tile} rotation={this.state.rotation} />
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
