import React from 'react'
import {Alert, Image, KeyboardAvoidingView, StatusBar, Text, View} from 'react-native'
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
import PinView from "react-native-pin-view";

@translate(['main'], { wait: true })
class ChangePinNumberPage extends React.Component {
  constructor() {
    super()
    this.pinNumberElements = undefined
    this.state = {
      justSet: false,
      pinNumberInvalid: false,
      pinNumber: undefined
    }
  }

  _onInputFinished = async (code, clear) => {
    if (this.state.pinNumber === undefined) {
      await SecureStore.setItemAsync('pinNumber', code)
      clear()
      this.setState({
        justSet: true,
        pinNumberInvalid: false,
        pinNumber: code
      })
    } else if (this.state.pinNumber === code) {
      this.props.saveUnlocked(true)
    } else {
      clear()
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
        }
      }
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
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#303140',
      }}>
        <StatusBar barStyle='light-content' />
        <View style={{flex:0.3,
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}>
  				<Image style={{ width: 150, height: 150, }} source={ require('rediwallet/src/assets/images/logo_400x400.png') } />
          <Text style={{ fontSize: 24, color: 'white', }}>
            {t('locked_desc', { locale: i18n.language })}
          </Text>
        </View>
        <View style={{flex:0.2,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{ marginTop: 25, fontSize: 15, color: '#999999', }}>
              { desc1 }
            </Text>
            <Text style={{ marginTop: 15, fontSize: 15, color: '#999999', }}>
              { desc2 }
            </Text>
          </View>
        </View>
        <View style={{flex:0.5,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <PinView
            onComplete={(val, clear)=>{this._onInputFinished(val, clear).then()}}
            pinLength={6}
            buttonTextColor={'#303140'}
            inputBgColor={'white'}
            inputActiveBgColor={'#555555'}
          />
        </View>

			</View>
    )
  }
}

const mapStateToProps = (state) => ({
  unlocked: state.appStateReducer.unlocked,
})

const mapDispatchToProps = (dispatch) => ({
  saveUnlocked: (unlocked) => dispatch(actions.saveUnlocked(unlocked)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChangePinNumberPage)
