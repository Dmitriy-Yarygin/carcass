import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import styles from './HeaderStyle';
import Authentication from '../common/Authentication';
import Button from '@material-ui/core/Button';
import HowToReg from '@material-ui/icons/HowToReg';
import Menu from './Menu';
import SocketIndicator from './SocketIndicatorContainer';

class Header extends React.Component {
  handleClickLogout = () => {
    Authentication.Logout().then(() => {
      this.props.logout();
    });
  };

  render() {
    const { classes, user } = this.props;
    let userName = 'admin';
    if (user && user.email) {
      const { email } = user;
      const position = Math.min(email.indexOf('.'), email.indexOf('@'));
      userName = position > 0 ? email.substring(0, position) : email;
    }
    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.header}>
          <Toolbar>
            <Menu
              fullMenu={user.role === 'su'}
              setSoftType={this.props.setSoftType}
            />

            <Typography className={classes.title} variant="h6" noWrap>
              Carcassone
            </Typography>

            <div className={classes.grow} />

            {user.redirectToReferrer ? (
              <>
                <Button color="inherit">
                  {userName}
                  <HowToReg />
                </Button>
                <Button color="inherit" onClick={this.handleClickLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button color="inherit">Login</Button>
              </Link>
            )}
            <SocketIndicator />
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Header);
