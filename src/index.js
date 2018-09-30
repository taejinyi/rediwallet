import React from 'react';
import {Alert, Platform, StatusBar, StyleSheet, View} from 'react-native';
import AppNavigator from './system/AppNavigator/AppNavigator';
import { Root } from 'native-base'
// import Modal from 'react-native-modal'
import { RippleLoader, TextLoader } from 'react-native-indicator'
import './global';
import {AppLoading, SecureStore} from "expo";
import Modal from 'react-native-modal'
import DialogInput from "react-native-dialog-input";
import {actions, LockPage} from "./pages";
import connect from "react-redux/es/connect/connect";
const Web3 = require('web3');

const web3 = new Web3(
  new Web3.providers.HttpProvider('https://mainnet.infura.io/'),
);

class Main extends React.Component {
  constructor(props) {
    super(props)
  }

  async componentWillMount() {
    console.log("unlocked?")
    console.log(this.props.unlocked)

    if (this.props.unlocked !== true) {
      console.log("isLocked")
      if (await Expo.Fingerprint.hasHardwareAsync()) {
        if(await Expo.Fingerprint.isEnrolledAsync()) {
          const result = await Expo.Fingerprint.authenticateAsync()
          if (result.success) {
            this.props.saveUnlocked(true)
          } else {

          }

        } else {
          console.log("Fingerprint is not enrolled")
          console.log(await Expo.Fingerprint.authenticateAsync())
        }
      }
    }
    else {
      console.log("isUnlocked")
      console.log(await Expo.Fingerprint.hasHardwareAsync())
      console.log(await Expo.Fingerprint.isEnrolledAsync())
      console.log(await Expo.Fingerprint.authenticateAsync())
    }

  //
  // saveunlocked
  //   await SecureStore.('mnemonic')    SecureStore.
  //   if (this.props.mnekl)
  //   if (Expo.Fingerprint.hasHardwareAsync()) {
  //     Expo.Fingerprint.isEnrolledAsync()
  //   }
  //       await SecureStore.deleteItemAsync('mnemonic')


  }

  render() {
    // web3.eth.getBlock('latest').then(console.log);
		const { isProcessingModalShow, processingModalMessage, unlocked } = this.props


    return (
      <Root>
        <Modal
          useNativeDriver={ true }
          animationInTiming={ 1 }
          animationOutTiming={ 1 }
          isVisible={ isProcessingModalShow }
          hideModalContentWhileAnimating={ true }>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <RippleLoader color='black' size={ 38 } />
            <TextLoader text={ processingModalMessage } textStyle={{ marginTop: 15, fontSize: 17, color: 'black', }} />
          </View>
        </Modal>
        <LockPage isVisible={ unlocked !== true }/>
        {/*<StatusBar barStyle='light-content' />*/}
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

const mapStateToProps = (state) => ({
  unlocked: state.appStateReducer.unlocked,
})

const mapDispatchToProps = (dispatch) => ({
  saveUnlocked: (unlocked) => dispatch(actions.saveUnlocked(unlocked)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Main)


