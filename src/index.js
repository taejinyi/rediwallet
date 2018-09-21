import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import AppNavigator from './system/AppNavigator/AppNavigator';
import { Root } from 'native-base'
// import Modal from 'react-native-modal'
import { RippleLoader, TextLoader } from 'react-native-indicator'

import './global';
import {AppLoading} from "expo";

const Web3 = require('web3');

const web3 = new Web3(
  new Web3.providers.HttpProvider('https://mainnet.infura.io/'),
);

class Main extends React.Component {
  render() {
    web3.eth.getBlock('latest').then(console.log);
		// const { isProcessingModalShow, processingModalMessage, addListener, nav } = this.props

    return (
      <Root>
        {/*<Modal*/}
          {/*useNativeDriver={ true }*/}
          {/*animationInTiming={ 1 }*/}
          {/*animationOutTiming={ 1 }*/}
          {/*isVisible={ isProcessingModalShow }*/}
          {/*hideModalContentWhileAnimating={ true }>*/}
          {/*<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>*/}
            {/*<RippleLoader color='white' size={ 38 } />*/}
            {/*<TextLoader text={ processingModalMessage } textStyle={{ marginTop: 15, fontSize: 17, color: 'white', }} />*/}
          {/*</View>*/}
        {/*</Modal>*/}
        <StatusBar barStyle='light-content' />
        {/*<NotificationSystem ref={ el => this.notificationSystem = el } />*/}
        {/*<AppNavigator screenProps={{ t: i18n.getFixedT() }} />*/}
        <AppNavigator />
        {/*<WatcherManager*/}
          {/*onTokenInvalid={ this._onTokenInvalid }*/}
          {/*notificationSystem={ this.notificationSystem }*/}
        {/*/>*/}
      </Root>
		)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#555555',
  },
});

export default Main
