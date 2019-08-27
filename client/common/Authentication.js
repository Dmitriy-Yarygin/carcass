import { fetchAndCatch } from '../common/helpers';

export default class Authentication {
  static registrate(data) {
    return fetchAndCatch(`/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    });
  }

  static recovery(data) {
    return fetchAndCatch(`/api/auth/recovery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  static update(data) {
    return fetchAndCatch(`/api/users/${0}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: data
    });
  }

  static Login(data) {
    return fetch(`/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data
    })
      .then(response => {
        if (response.status === 401) {
          return false;
        }
        return response.json().then(answer => answer.user);
      })
      .catch(console.error);
  }

  static Logout() {
    return fetch(`/api/auth/logout`, {
      method: 'POST'
    })
      .then(response => {
        if (response.status !== 200) {
          throw response.statusText;
        }
        this.isUserLogin = false;
        return false;
      })
      .catch(console.error);
  }

  static validateLogin(login) {
    // const emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // const phoneReg = /^\d[\d\(\)\ -]{4,14}\d$/;
    // return (emailReg.test(login) || phoneReg.test(login));
    return login && login.length && login.length >= 1;
  }
  static validatePassword(pw) {
    return pw && pw.length && pw.length >= 1;
  }
}
