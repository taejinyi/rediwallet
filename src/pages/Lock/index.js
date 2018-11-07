import React from 'react'
import {Alert, View} from 'react-native'
import {TextLoader} from 'react-native-indicator'
import Modal from 'react-native-modal'
import DialogInput from "react-native-dialog-input";
import {actions} from "../index";
import connect from "react-redux/es/connect/connect";
import { SecureStore } from 'expo'

class LockPage extends React.Component {
  state = {
    showPinNumberDialog: false,
  };
  async componentDidMount() {
    if (await Expo.Fingerprint.hasHardwareAsync()) {
      if(await Expo.Fingerprint.isEnrolledAsync()) {
        const result = await Expo.Fingerprint.authenticateAsync()
        if (result.success) {
          this.props.saveUnlocked(true)
        } else {

        }

      } else {
        this.setState({
          showPinNumberDialog: true
        })
      }
    }
    else {
      this.setState({
        showPinNumberDialog: true
      })
    }
  }

  unlockWithPinNumber = async (inputText) => {
    const pinNumber = await SecureStore.getItemAsync('pinNumber')
    if (pinNumber) {
      if(pinNumber === inputText) {
        this.props.saveUnlocked(true)
        this.setState({
          showPinNumberDialog: false
        })
      }
    } else {
      try {
        await SecureStore.setItemAsync('pinNumber', inputText)
      } catch(error) {
        Alert.alert('Pin Number save error', 'Failed to save pin number.')
      }
    }
  }

  render() {

    return (
      <Modal
        useNativeDriver={ true }
        animationInTiming={ 1 }
        animationOutTiming={ 1 }
        isVisible={ this.props.unlocked !== true }
        hideModalContentWhileAnimating={ true }>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
          <TextLoader text='잠금페이지를 불러오는 중' textStyle={{ marginTop: 15, color: '#303140', fontSize: 17, }} />
        </View>
        <DialogInput isDialogVisible={this.state.showPinNumberDialog &&  this.props.unlocked !== true}
          title={"Locked"}
          message={"Input pin number."}
          hintInput ={"6 digits"}
          submitInput={ (inputText) => {this.unlockWithPinNumber(inputText).then({})} }
          closeDialog={ () => {}}>
        </DialogInput>

      </Modal>
    )
  }
}

const mapStateToProps = (state) => ({
  unlocked: state.appStateReducer.unlocked,
})

const mapDispatchToProps = (dispatch) => ({
  saveUnlocked: (unlocked) => dispatch(actions.saveUnlocked(unlocked)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LockPage)
