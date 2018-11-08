import React from 'react'
import {Alert, KeyboardAvoidingView, Text, View} from 'react-native'
import {TextLoader} from 'react-native-indicator'
import Modal from 'react-native-modal'
import DialogInput from "react-native-dialog-input";
import {actions} from "../index";
import connect from "react-redux/es/connect/connect";
import { SecureStore } from 'expo'
import {Container} from "native-base";
import { PinNumberInputs } from "../../components";
import {translate} from "react-i18next";
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'

@translate(['main'], { wait: true })
class LockPage extends React.Component {
  constructor() {
    super()
    this.pinNumberElements = undefined
    this.state = {
      justSet: false,
      pinNumberInvalid: false,
      pinNumber: undefined
    }
  }

  _onTextFilled = async (code) => {
    if (this.state.pinNumber === undefined) {
      await SecureStore.setItemAsync('pinNumber', code)
      this.pinNumberElements.clearAllInputs()
      this.setState({
        justSet: true,
        pinNumberInvalid: false,
        pinNumber: code
      })
    } else if (this.state.pinNumber === code) {
      this.props.saveUnlocked(true)
    } else {
      this.pinNumberElements.clearAllInputs()
      this.setState({
        justSet: false,
        pinNumberInvalid: true
      })

    }
  }

  async componentWillMount() {
    const pinNumber = await SecureStore.getItemAsync('pinNumber')
    if (pinNumber) {
      this.setState({
        pinNumber: pinNumber
      })
    }
  }

  async componentDidMount() {
    if (await Expo.Fingerprint.hasHardwareAsync()) {
      if(await Expo.Fingerprint.isEnrolledAsync()) {
        const result = await Expo.Fingerprint.authenticateAsync()
        if (result.success) {
          this.props.saveUnlocked(true)
        } else {

        }

      } else {
        // this.setState({
        //   showPinNumberDialog: true
        // })
      }
    }
    else {
      // this.setState({
      //   showPinNumberDialog: true
      // })
    }
  }

  render() {
    const { t, i18n } = this.props
    let desc1, desc2
    if (this.state.pinNumber === undefined){
      desc1 = t('set_pin_number_desc1', { locale: i18n.language })
      desc2 = t('set_pin_number_desc2', { locale: i18n.language })
    } else if (this.state.justSet){
      desc1 = t('confirm_pin_number_desc1', { locale: i18n.language })
      desc2 = t('confirm_pin_number_desc2', { locale: i18n.language })
    } else if (this.state.pinNumberInvalid) {
      desc1 = t('wrong_pin_number_desc1', { locale: i18n.language })
      desc2 = t('wrong_pin_number_desc2', { locale: i18n.language })
    } else {
      desc1 = t('input_pin_number_desc1', { locale: i18n.language })
      desc2 = t('input_pin_number_desc2', { locale: i18n.language })
    }
    return (
      <Modal
        useNativeDriver={ true }
        animationInTiming={ 1 }
        animationOutTiming={ 1 }
        isVisible={ this.props.unlocked !== true }
        hideModalContentWhileAnimating={ true }>

        <KeyboardAvoidingView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }} behavior='padding'>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 0, backgroundColor: "#303140" }}>
            <View style={{ marginBottom: 35, justifyContent: 'center', alignItems: 'center', }}>
              <MaterialCommunityIcons name='lock' style={{ fontSize: 128, color: '#666666', }} />
              <Text style={{ fontSize: 24, color: '#666666', }}>
                {t('locked_desc', { locale: i18n.language })}
              </Text>
              <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <Text style={{ marginTop: 5, fontSize: 15, color: '#999999', }}>
                  { desc1 }
                </Text>
                <Text style={{ fontSize: 15, color: '#999999', }}>
                  { desc2 }
                </Text>
              </View>
            </View>
            <View style={{ height: 50, }}>
              <PinNumberInputs
                ref={ el => this.pinNumberElements = el }
                numberOfInputs={ 6 }
                focusTextBorderColor='#6e6e6e'
                normalTextBorderColor='#9e9e9e'
                onTextFilled={ this._onTextFilled }
              />
            </View>
          </View>
        </KeyboardAvoidingView>
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
