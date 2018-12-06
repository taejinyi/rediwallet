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

import Sentry from 'sentry-expo';
// import { SentrySeverity, SentryLog } from 'react-native-sentry';
Sentry.config('https://af988a17f47c4e7082b40ee4c8687b26@sentry.io/1315592').install();

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

export default class App extends React.Component {
  constructor() {
    super()

    this.state = {
      country: undefined,
    }

  }
  async componentWillMount() {
    if(Platform.OS === 'android') {
      await Expo.Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      })
    }

    await Expo.Font.loadAsync({
      'Ionicons': require('native-base/Fonts/Ionicons.ttf')
    })

    const deviceLocale = await DangerZone.Localization.getCurrentLocaleAsync()
    moment.locale(deviceLocale.split('_')[0])
  }

  render() {
    return (
      <Provider store={ store }>
        <Main />
      </Provider>
    );
  }
}
