import React from 'react';
// import PropTypes from 'prop-types';
// import MaterialTable from 'material-table';
// import tableIcons from '../common/icons';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// import EditedField from '../common/EditedField';
// import TextField from '@material-ui/core/TextField';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';

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

  handleBtnClick = () => {
    // const newData = { name: 'Room 133', state: 'test' };
    // console.log(`testing data = %O`, newData);
    // this.props.roomAdd(newData);
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
        <Button
          variant="contained"
          color="primary"
          onClick={this.handleBtnClick}
        >
          Test
        </Button>
      </Paper>
    );
  }
}

// Home.propTypes = {
//   classes: PropTypes.func.isRequired
// };

export default withStyles(styles)(Home);
