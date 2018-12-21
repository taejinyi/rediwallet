import React from 'react';
import {StatusBar, StyleSheet, View, AppState} from 'react-native';
import { Root } from 'native-base'
// import Modal from 'react-native-modal'
import { RippleLoader, TextLoader } from 'react-native-indicator'
import './global';
import {SecureStore, Updates, DangerZone } from "expo";
import Modal from 'react-native-modal'
import {actions, LockPage} from "./pages";
import { withDB, withLock, AppNavigator } from './system'

import i18n from './utils/i18n'

// const WatcherManager = withLock(withDB(Watcher))

import connect from "react-redux/es/connect/connect";
import Expo from "expo";
import PinView from 'react-native-pin-view'

class Main extends React.Component {
  constructor(props) {
    super(props)
  }

  _onTokenInvalid = async () => {
    await SecureStore.deleteItemAsync('mnemonic')
    await this.props.db.destroy()
    this.props.saveSeed(undefined)
    await Updates.reload()
    const { dispatch } = this.props

    // dispatch(NavigationActions.reset({
    //   index: 0,
    //   key: null,
    //   actions: [ NavigationActions.navigate({ routeName: 'Splash' }) ],
    // }))

  }
  async componentWillMount() {
    const deviceCountry = await DangerZone.Localization.getCurrentDeviceCountryAsync()
    this.props.saveCountry(deviceCountry)
  }

  render() {
    // web3.eth.getBlock('latest').then(console.log);
		const { isProcessingModalShow, processingModalMessage, unlocked } = this.props
    // TODO Comment
    // this.props.saveUnlocked(true)
    return (
      <Root>
        <Modal
          backdropColor='#303140'
          useNativeDriver={ true }
          animationInTiming={ 1 }
          animationOutTiming={ 1 }
          isVisible={ isProcessingModalShow }
          hideModalContentWhileAnimating={ true }>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <RippleLoader color='black' size={ 38 } />
            <TextLoader text={ processingModalMessage } textStyle={{ marginTop: 15, fontSize: 17, color: 'white', }} />
          </View>
        </Modal>
        <StatusBar barStyle='light-content' />
        {/*<NotificationSystem ref={ el => this.notificationSystem = el } />*/}
        {
          (this.props.unlocked) ? (
            <AppNavigator language="ko" screenProps={{ t: i18n.getFixedT() }} />
          ) : (
            <LockPage />
          )
        }
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
  isProcessingModalShow: state.appStateReducer.isShow,
  processingModalMessage: state.appStateReducer.message
})

const mapDispatchToProps = (dispatch) => ({
  saveCountry: (country) => dispatch(actions.saveCountry(country)),
  saveUnlocked: (unlocked) => dispatch(actions.saveUnlocked(unlocked)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Main)


