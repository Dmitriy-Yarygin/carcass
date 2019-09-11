import React from 'react';
import PropTypes from 'prop-types';
import GetSidesNames from './GetSidesNames';
import './EtherealTile.css';

class EtherealTile extends React.Component {
  state = { rotation: 0, variantsLength: 0 };

  componentDidMount() {
    console.log(`EtherealTile componentDidMount`);
    if (this.props.tile && this.props.tile.variants) {
      this.setState({
        rotation: this.props.tile.variants[0],
        variantsLength: this.props.tile.variants.length
      });
    }
  }

  handleBtnClick = () => {
    const { rotation, variantsLength } = this.state;
    if (variantsLength) {
      this.setState({ rotation: (rotation + 1) % variantsLength });
    }
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
