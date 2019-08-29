import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import StarIcon from '@material-ui/icons/Star';
import EmptyStarIcon from '@material-ui/icons/StarBorder';
////////////////////////////////////////////////////////////////////////////////////////////////////
import io from 'socket.io-client';

const socket = io({
  transports: ['websocket']
});
////////////////////////////////////////////////////////////////////////////////////////////////////

class Socket extends React.Component {
  componentDidMount() {
    socket.on('reconnect_attempt', () => {
      socket.io.opts.transports = ['polling', 'websocket'];
    });

    socket.on('connect', () => {
      this.props.setFlag(socket.connected);
    });

    socket.on('disconnect', () => {
      this.props.setFlag(socket.connected);
    });

    socket.on('roomsList', function(data) {
      console.log('roomsList ', data);
    });
  }

  render() {
    const { connected } = this.props.socket;
    if (connected) return <StarIcon color="secondary" />;
    return <EmptyStarIcon color="secondary" />;
  }
}

export { Socket, socket };
