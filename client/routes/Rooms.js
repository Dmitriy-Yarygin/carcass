import React from 'react';
// import PropTypes from "prop-types";
import MaterialTable from 'material-table';
import tableIcons from '../common/icons';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MySnackbar from '../common/MySnackbar';
import PlayIcon from '@material-ui/icons/PlayArrow';
import { socket } from '../common/Socket';

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
  // { title: 'Owner', field: 'owner', editable: 'never' },
  { title: 'Players', field: 'users', editable: 'never' },
  { title: 'Created at', field: 'created_at', editable: 'never' },
  { title: 'State', field: 'state', editable: 'never' }
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
    // console.log(`Rooms componentDidMount`);
    socket.emit('rooms', { method: 'read' }, this.checkSuccess);
  }

  componentDidUpdate() {
    // console.log(`Rooms componentDidUpdate`);
  }

  checkSuccess = answer => {
    if (!answer.success) {
      console.error(answer);
      this.setState({
        msg: answer.error.detail,
        msgVariant: 'error'
      });
    }
    return answer.success;
  };

  newPlayerEnterRoom = (event, rowData) =>
    socket.emit('rooms', { method: 'newPlayer', data: rowData.id }, answer => {
      if (this.checkSuccess(answer)) {
        this.props.history.push(`/rooms/${rowData.id}`);
      }
    });

  render() {
    const { classes, user, room } = this.props;
    let roomsArray = [];
    if (room && room.rooms && room.rooms.length) {
      roomsArray = room.rooms.map(room => ({
        ...room,
        users: room.users.map(user => user.email).join(', '),
        state: room.state.name
      }));
    }
    const editable = {
      onRowAdd: newData =>
        new Promise(resolve => {
          socket.emit(
            'rooms',
            { method: 'create', data: newData },
            this.checkSuccess
          );
          resolve();
        }),
      onRowUpdate: (newData, oldData) =>
        new Promise(resolve => {
          const { id, name } = newData;
          if (name !== oldData.name) {
            const data = { id, name };
            socket.emit('rooms', { method: 'update', data }, this.checkSuccess);
          }
          resolve();
        })
    };
    if (user.role === 'su' || user.role === 'admin') {
      editable.onRowDelete = oldData =>
        new Promise(resolve => {
          socket.emit(
            'rooms',
            { method: 'del', data: oldData.id },
            this.checkSuccess
          );
          resolve();
        });
    }

    const actions = [
      {
        icon: () => <PlayIcon color={'primary'} />,
        tooltip: 'Enter room',
        onClick: this.newPlayerEnterRoom
      }
    ];

    return (
      <Grid container justify="center" alignItems="center">
        <Paper className={classes.root} elevation={1}>
          <MaterialTable
            icons={tableIcons}
            title="Rooms"
            columns={columns}
            data={roomsArray}
            actions={actions}
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
              // grouping: true
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
