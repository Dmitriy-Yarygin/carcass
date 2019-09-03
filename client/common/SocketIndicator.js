import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import StarIcon from '@material-ui/icons/Star';
import EmptyStarIcon from '@material-ui/icons/StarBorder';
import { socketListeners } from './Socket';

class SocketIndicator extends React.Component {
  componentDidMount() {
    socketListeners(this.props);
  }

  render() {
    const { connected } = this.props.socket;
    if (connected) return <StarIcon color="secondary" />;
    return <EmptyStarIcon color="secondary" />;
  }
}

export default SocketIndicator;
