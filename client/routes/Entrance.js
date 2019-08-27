import React from 'react';
// import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// import EditedField from '../common/EditedField';
// import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  root: {
    margin: 20,
    padding: 5
  }
});

class Home extends React.Component {
  state = {};

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography className={classes.title} variant="h6" noWrap>
          Entrance
        </Typography>
      </Paper>
    );
  }
}

// Home.propTypes = {
//   classes: PropTypes.func.isRequired
// };

export default withStyles(styles)(Home);
