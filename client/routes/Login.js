import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Authentication from '../common/Authentication';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import styles from './LoginStyles';
import MySnackbar from '../common/MySnackbar';
import { Link } from 'react-router-dom';

class SignIn extends React.Component {
  state = {
    msg: null,
    value: this.props.loginOrRegister,
    redirectToReferrer: Authentication.isUserLogin
  };

  warningOnClose = () => {
    this.setState({ msg: null });
  };
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  passwordRecoveryClick = () => {
    if (!this.state.login) {
      this.setState({
        msg: 'You should enter your login for recovery.',
        msgVariant: 'warning'
      });
      return;
    }
    Authentication.recovery({ login: this.state.login }).then(({ success }) => {
      const message = success
        ? {
            msg: 'We will send you email with new password. Please check.',
            msgVariant: 'info'
          }
        : { msg: 'Couldn`t find record with such login.', msgVariant: 'error' };
      this.setState(message);
    });
  };

  handleClickLogin = () => {
    if (this.validate()) {
      const { login, password } = this.state;
      const data = JSON.stringify({ email: login, password });
      Authentication.Login(data).then(answer => {
        if (answer) {
          this.props.login({
            redirectToReferrer: true,
            ...answer
          });
          this.setState({
            redirectToReferrer: true,
            msg: 'Authentification succed!',
            msgVariant: 'success'
          });
        } else {
          this.setState({
            msg: 'You entered wrong login or password!',
            msgVariant: 'error'
          });
        }
      });
    }
  };

  validate = () => {
    if (!Authentication.validateLogin(this.state.login)) {
      this.setState({
        msg: "Check login it's incorrect",
        msgVariant: 'warning'
      });
      return false;
    }
    if (!Authentication.validatePassword(this.state.password)) {
      this.setState({
        msg: "Check password it's incorrect",
        msgVariant: 'warning'
      });
      return false;
    }
    return true;
  };

  handleClickReg = () => {
    if (this.validateWith2Passwords()) {
      const { login, password } = this.state;
      const data = JSON.stringify({ email: login, password });
      Authentication.registrate(data).then(res => {
        if (res.success) {
          this.setState({
            msg: 'Registration succed!',
            msgVariant: 'success',
            value: 0
          });
        } else {
          console.error(res.success);

          this.setState({
            msg: `Registration error: ${res.error.detail}`,
            msgVariant: 'error'
          });
        }
      });
    }
  };

  validateWith2Passwords = () => {
    if (!this.validate()) {
      return false;
    }
    if (
      !Authentication.validatePassword(this.state.password_repeat) ||
      this.state.password !== this.state.password_repeat
    ) {
      this.setState({
        msg: 'Please check - password not match repeated password',
        msgVariant: 'warning'
      });
      return false;
    }
    return true;
  };

  handleTabsChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { from } = this.props.location.state || {
      from: { pathname: '/protected' }
    };
    const { redirectToReferrer } = this.state;
    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <div>
            <Tabs
              value={value}
              onChange={this.handleTabsChange}
              classes={{
                root: classes.tabsRoot,
                indicator: classes.tabsIndicator
              }}
            >
              <Tab
                disableRipple
                classes={{
                  root: classes.tabRoot,
                  selected: classes.tabSelected
                }}
                label="Login"
              />
              <Tab
                disableRipple
                classes={{
                  root: classes.tabRoot,
                  selected: classes.tabSelected
                }}
                label="Register"
              />
            </Tabs>
          </div>
          <div method="POST" className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Enter your login</InputLabel>
              <Input
                id="email"
                name="login"
                type="email"
                autoComplete="email"
                autoFocus
                onChange={this.handleChange('login')}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={this.handleChange('password')}
              />
            </FormControl>
            {this.state.value === 1 ? (
              <>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="password">Password repeat</InputLabel>
                  <Input
                    name="password_repeat"
                    type="password"
                    id="password_repeat"
                    onChange={this.handleChange('password_repeat')}
                  />
                </FormControl>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={this.handleClickReg}
                >
                  Register
                </Button>
              </>
            ) : (
              <>
                <Button size="small" onClick={this.passwordRecoveryClick}>
                  Password recovery
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={this.handleClickLogin}
                >
                  Login
                </Button>
              </>
            )}
            <Link to="/">
              <Button
                fullWidth
                variant="contained"
                color="default"
                className={classes.submit}
              >
                Cancel
              </Button>
            </Link>
          </div>
        </Paper>
        <MySnackbar
          message={this.state.msg}
          onClose={this.warningOnClose}
          variant={this.state.msgVariant}
        />
      </main>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired
};
SignIn.defaultProps = {
  loginOrRegister: 0
};

export default withStyles(styles)(SignIn);
