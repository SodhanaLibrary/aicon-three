import React from 'react';
import App from './app';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import animaticonApp from './reducers/index';
import InitialState from './reducers/InitialState';
import "../sass/index.scss";

let store = createStore(animaticonApp, InitialState, compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
));

window.animaticonStore = store;

render(
  <AppContainer>
    <Provider store={store}>
      <App />
    </Provider>
  </AppContainer>, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept('./app.js', () => {
    const App = require('./app.js');
    render(
      <AppContainer>
        <Provider store={store}>
          <App />
        </Provider>
      </AppContainer>,
      document.querySelector("#app")
    );
  });
}
