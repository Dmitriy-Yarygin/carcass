import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

const styles = theme => ({
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    color: 'inherit'
  }
});

class Menu extends React.Component {
  state = { open: false };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  };

  render() {
    const { classes, fullMenu } = this.props;
    const { open } = this.state;
    return (
      <>
        <IconButton
          className={classes.menuButton}
          aria-label="Open drawer"
          aria-owns={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          buttonRef={node => {
            this.anchorEl = node;
          }}
          onClick={this.handleToggle}
        >
          <MenuIcon />
        </IconButton>
        <Popper
          style={{ zIndex: 12 }}
          open={open}
          anchorEl={this.anchorEl}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom'
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList>
                    <Link to="/" className="header-link">
                      <MenuItem onClick={this.handleClose}>Home</MenuItem>
                    </Link>

                    <Link to="/rooms">
                      <MenuItem onClick={this.handleClose}>Rooms</MenuItem>
                    </Link>

                    {fullMenu && (
                      <Link to="/protected">
                        <MenuItem onClick={this.handleClose}>Users</MenuItem>
                      </Link>
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    );
  }
}

export default withStyles(styles)(Menu);
