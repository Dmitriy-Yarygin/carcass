import React, { Component } from 'react';
import { Route, Redirect, BrowserRouter, Link } from 'react-router-dom';
import Authentication from '../common/Authentication';
import Header from '../common/HeaderContainer';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import lime from '@material-ui/core/colors/lime';
import Home from './HomeContainer';
import Login from './LoginContainer';
import Admins from './RoomsContainer';
import Rooms from './RoomsContainer';

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

            <PrivateRoute
              path="/ChooseCreateRoom"
              isAllowed={isAllowed}
              user={user}
              component={Admins}
            />
            <PrivateRoute
              path="/rooms"
              isAllowed={isAllowed}
              user={user}
              component={Rooms}
            />
            <PrivateRoute
              path="/protected"
              isAllowed={isAllowed}
              user={user}
              component={Admins}
            />
          </MuiThemeProvider>
        </div>
      </BrowserRouter>
    );
  }
}

const PrivateRoute = ({ component: Component, isAllowed, user, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      user.role === 'su' ? (
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

export default Routes;
