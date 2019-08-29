import React from 'react';
// import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// import EditedField from '../common/EditedField';
// import TextField from '@material-ui/core/TextField';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';

import { socket } from '../common/Socket';

const styles = theme => ({
  root: {
    margin: 20,
    padding: 5
  }
});

class Home extends React.Component {
  state = {};

  handleBtnClick = () => {
    socket.emit('message', { foo: 'To be or not to be? TO BE!' });
  };

  render() {
    const { classes } = this.props;
    const id = Number(this.props.match.params.id);

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography className={classes.title} variant="h6" noWrap>
          Entrance room id={id}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleBtnClick}
        >
          Hello socket
        </Button>
      </Paper>
    );
  }
}

// Home.propTypes = {
//   classes: PropTypes.func.isRequired
// };

export default withStyles(styles)(Home);
