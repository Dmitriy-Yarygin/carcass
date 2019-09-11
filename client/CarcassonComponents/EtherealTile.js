import React from 'react';
import PropTypes from 'prop-types';
import GetSidesNames from './GetSidesNames';
import './EtherealTile.css';
import { socket } from '../common/Socket';

class EtherealTile extends React.Component {
  state = { rotation: 0, variantsLength: 0 };

  componentDidMount() {
    // console.log(`EtherealTile componentDidMount`);
    if (this.props.tile && this.props.tile.variants) {
      this.setState({
        rotation: this.props.tile.variants[0],
        variantsLength: this.props.tile.variants.length
      });
    }
  }

  handleBtnClick = e => {
    e.stopPropagation();
    const { rotation, variantsLength } = this.state;
    if (variantsLength) {
      this.setState({ rotation: (rotation + 1) % variantsLength });
    }
  };

  tileClick = e => {
    const { onClick, position } = this.props;
    onClick(position, this.state.rotation);
  };

  render() {
    console.log(this.props);
    const { tile } = this.props;
    return (
      <div className="ethereal" onClick={this.tileClick}>
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
