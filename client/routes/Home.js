import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    margin: 20
    // padding: 5
  },
  media: {
    height: 0,
    paddingTop: '45%' // 541/1200
  }
});

class Home extends React.Component {
  render() {
    const { classes } = this.props;
    /*  <Paper className={classes.root} elevation={1}> */
    return (
      <Typography className={classes.title} variant="h6" noWrap>
        Carcasson
      </Typography>
    );
  }
}
Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);
