import React from 'react';
// import PropTypes from 'prop-types';
// import MaterialTable from 'material-table';
// import tableIcons from '../common/icons';
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
  state = {
    selectedRow: null
  };

  componentDidMount() {
    console.log(`>> 1 >> home componentDidMount`);
    // this.props.clearSearch();
    // this.props.loadSoft();
  }

  componentDidUpdate(prevProps) {
    console.log(`>> 2 >> home componentDidUpdate`);
    // if (this.props.search !== prevProps.search) {
    //   this.props.loadSoft({ search: this.props.search });
    // }
  }

  render() {
    const { classes, user } = this.props;

    return (
      <Paper className={classes.root} elevation={1}>
        <Typography className={classes.title} variant="h6" noWrap>
          Title
        </Typography>
      </Paper>
    );
  }
}

// Home.propTypes = {
//   classes: PropTypes.func.isRequired
// };

export default withStyles(styles)(Home);
