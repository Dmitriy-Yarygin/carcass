import React from 'react';
// import PropTypes from "prop-types";

import MaterialTable from 'material-table';
import tableIcons from '../common/icons';
// import SoftwareTable from '../common/SoftwareTable';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MySnackbar from '../common/MySnackbar';
import PlayIcon from '@material-ui/icons/PlayArrow';

const styles = {
  root: {
    margin: 20,
    padding: 5,
    width: 1000
  }
};

const columns = [
  { title: '№', field: 'id', editable: 'never' },
  { title: 'Name', field: 'name' },
  { title: 'Created at', field: 'created_at' },
  { title: 'State', field: 'state' }
];

class Rooms extends React.Component {
  state = {
    selectedRow: null,
    msg: null
  };

  warningOnClose = () => {
    this.setState({ msg: null });
  };

  componentDidMount() {
    this.props.loadRooms();
  }

  render() {
    const { classes, user, room } = this.props;
    const editable =
      user.role !== '0000000000000'
        ? {
            onRowAdd: newData =>
              new Promise(resolve => {
                this.props.roomAdd(newData).then(answer => {
                  if (!answer.success) {
                    this.setState({
                      msg: answer.error.detail,
                      msgVariant: 'error'
                    });
                  }
                  resolve();
                });
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise(resolve => {
                if (newData.name === oldData.name) delete newData.name;
                this.props.roomUpdate(newData).then(answer => {
                  if (!answer.success) {
                    this.setState({
                      msg: answer.error.detail,
                      msgVariant: 'error'
                    });
                  }
                  resolve();
                });
              }),
            onRowDelete: oldData =>
              new Promise(resolve => {
                this.props.roomDelete(oldData.id);
                resolve();
              })
          }
        : {};

    return (
      <Grid container justify="center" alignItems="center">
        <Paper className={classes.root} elevation={1}>
          <MaterialTable
            icons={tableIcons}
            title="Rooms"
            columns={columns}
            data={room.rooms}
            actions={[
              {
                icon: () => <PlayIcon color={'primary'} />,
                tooltip: 'Enter room',
                onClick: (event, rowData) => alert('You saved ' + rowData.name)
              }
            ]}
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

        <MySnackbar
          message={this.state.msg}
          onClose={this.warningOnClose}
          variant={this.state.msgVariant}
        />
      </Grid>
    );
  }
}

// Admins.propTypes = {
//   classes: PropTypes.object.isRequired
// };

export default withStyles(styles)(Rooms);
