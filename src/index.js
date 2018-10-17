import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import { Root } from 'native-base'
// import Modal from 'react-native-modal'
import { RippleLoader, TextLoader } from 'react-native-indicator'
import './global';
import {SecureStore, Updates} from "expo";
import Modal from 'react-native-modal'
import {actions, LockPage} from "./pages";
import { withDB, withLock, AppNavigator } from './system'

import i18n from './utils/i18n'

// const WatcherManager = withLock(withDB(Watcher))

import connect from "react-redux/es/connect/connect";

class Main extends React.Component {
  constructor(props) {
    super(props)
  }

  async componentWillMount() {


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

  render() {
    // web3.eth.getBlock('latest').then(console.log);
		const { isProcessingModalShow, processingModalMessage, unlocked } = this.props
    // TODO Comment
    this.props.saveUnlocked(true)
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
        <LockPage isVisible={ this.props.unlocked !== true }/>
        <StatusBar barStyle='light-content' />
        {/*<NotificationSystem ref={ el => this.notificationSystem = el } />*/}
        <AppNavigator screenProps={{ t: i18n.getFixedT() }} />
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


