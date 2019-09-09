import React, { Component } from 'react';
import { Route, Redirect, BrowserRouter, Link } from 'react-router-dom';
import Authentication from '../common/Authentication';
import Header from '../common/HeaderContainer';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import lime from '@material-ui/core/colors/lime';
import Home from './HomeContainer';
import Login from './LoginContainer';
import Admins from './AdminsContainer';
import Rooms from './RoomsContainer';
import Room from './RoomContainer';

const theme = createMuiTheme({
  palette: {
    primary: lime
    // secondary: purple,
  },
  typography: {
    useNextVariants: true
  }
});

class Routes extends Component {
  render() {
    const { user } = this.props;
    let isAllowed = user.redirectToReferrer;
    return (
      <BrowserRouter>
        <div>
          <MuiThemeProvider theme={theme}>
            <Header />
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
            <Route path="/rooms/:id" exact component={Room} />

            <LoginedRoute
              path="/rooms"
              exact
              isAllowed={isAllowed}
              component={Rooms}
            />
            <PrivateRoute path="/protected" user={user} component={Admins} />
          </MuiThemeProvider>
        </div>
      </BrowserRouter>
    );
  }
}

const LoginedRoute = ({ component: Component, isAllowed, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAllowed ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const PrivateRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      user.role === 'su' ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default Routes;
