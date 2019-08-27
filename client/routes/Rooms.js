import React from 'react';
// import PropTypes from "prop-types";

import MaterialTable from 'material-table';
import tableIcons from '../common/icons';
// import SoftwareTable from '../common/SoftwareTable';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = {
  root: {
    margin: 20,
    padding: 5,
    width: 1000
  }
};

const columns = [
  { title: '№', field: 'id' },
  { title: 'Name', field: 'email' },
  { title: 'Users', field: 'users' },
  { title: 'State', field: 'state' }
];

class Admins extends React.Component {
  state = {
    selectedRow: null
  };

  componentDidMount() {
    this.props.loadRooms();
  }

  render() {
    const { classes, user } = this.props;
    const editable =
      user.role === 'su'
        ? {
            onRowUpdate: (newData, oldData) => {
              return new Promise(resolve => {
                this.props.userUpdate(newData);
                resolve();
              });
            },
            onRowDelete: oldData =>
              new Promise(resolve => {
                this.props.userDelete(oldData.id);
                resolve();
              })
          }
        : {};

    return (
      <Grid container justify="center" alignItems="center">
        <Paper className={classes.root} elevation={1}>
          <MaterialTable
            icons={tableIcons}
            title="Users"
            columns={columns}
            data={user.users}
            editable={editable}
            onRowClick={(evt, selectedRow) => this.setState({ selectedRow })}
            options={{
              headerStyle: {
                backgroundColor: 'rgba(205, 220, 57, 0.7)'
              },
              rowStyle: rowData => ({
                backgroundColor:
                  this.state.selectedRow &&
                  this.state.selectedRow.tableData.id === rowData.tableData.id
                    ? '#EEE'
                    : '#FFF'
              })
              // searchFieldAlignment: 'left'
              // showTitle: false,
              // search: false
            }}
          />
        </Paper>
      </Grid>
    );
  }
}

// Admins.propTypes = {
//   classes: PropTypes.object.isRequired
// };

export default withStyles(styles)(Admins);
