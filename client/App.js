import React, { Component } from 'react';
import { Provider } from 'react-redux';
import './App.css';
import Routes from './routes/RouterContainer';
import { loadState, saveState } from './localStorage';
import throttle from 'lodash.throttle';
import storeCreator from './store';

const store = storeCreator({});

// const store = storeCreator(loadState());

// store.subscribe(
//   throttle(() => {
//     saveState(store.getState());
//   }, 1000)
// );

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    );
  }
}

export default App;
