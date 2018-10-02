import React from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import {AppLoading, Asset, Font, Icon} from 'expo';

import Main from './src'

import {DangerZone} from 'expo'
import {Provider} from 'react-redux'
import {all} from 'redux-saga/effects'
import createSagaMiddleware from 'redux-saga'
import moment from 'moment/min/moment-with-locales'
import {applyMiddleware, combineReducers, createStore} from 'redux'

import {reducers as pageReducers} from './src/pages'
import {reducers as systemReducers} from './src/system'

import {sagas} from './src/pages'

import './src/global';

function* rootSaga() {
  yield all(sagas)
}

const reducer = combineReducers({
  ...systemReducers,
  ...pageReducers,
})

const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(sagaMiddleware))

sagaMiddleware.run(rootSaga)

if (module.hot) {
  module.hot.accept(() => {
    store.replaceReducer(reducer)
  })
}
//
// const Web3 = require('web3');
//
// const web3 = new Web3(
//   new Web3.providers.HttpProvider('https://mainnet.infura.io/'),
// );
//


export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={store}>
          <Main />
        </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./src/assets/images/robot-dev.png'),
        require('./src/assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./src/assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({isLoadingComplete: true});
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#555555',
  },
});
