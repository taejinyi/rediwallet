import React from 'react'
import {Alert, Image, KeyboardAvoidingView, StatusBar, Text, TouchableWithoutFeedback, View} from 'react-native'
import {TextLoader} from 'react-native-indicator'
import Modal from 'react-native-modal'
import DialogInput from "react-native-dialog-input";
import {actions} from "../index";
import connect from "react-redux/es/connect/connect";
import { SecureStore } from 'expo'
import {Container} from "native-base";
import { PinNumberInputs } from "../../components";
import {translate} from "react-i18next";
import { MaterialCommunityIcons, Feather, FontAwesome } from '@expo/vector-icons'
import PinView from "react-native-pin-view";
import {NavigationActions} from "react-navigation";

@translate(['main'], { wait: true })
class ChangePinNumberPage extends React.Component {
  constructor() {
    super()
    this.state = {
      unlocked: false,
      newPinNumber: undefined,
      newPinNumberValid: false,
      pinNumber: undefined,
      invalid: false
    }
  }
  closePage = () => {
    const { dispatch } = this.props.navigation

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Main' })
      ]
    })
    dispatch(resetAction)
  }

  _onInputFinished = async (code, clear) => {
    const { t, i18n } = this.props
    console.log(code, this.state.pinNumber)
    if (this.state.unlocked === false){
      if (code === this.state.pinNumber) {
        this.setState({
          unlocked: true,
          invalid: false
        })
      } else {
        this.setState({
          invalid: true
        })
      }
      clear()
    } else if (this.state.newPinNumber === undefined){
      this.setState({
        newPinNumber: code
      })
      clear()
    } else if (!this.state.newPinNumberValid) {
      if (code === this.state.newPinNumber) {
        this.setState({
          newPinNumberValid: true,
          invalid: false
        })
        await SecureStore.setItemAsync('pinNumber', code)
        Alert.alert(
          t('pinNumberChanged', { locale: i18n.language }),
          t('pinNumberChangedDesc', { locale: i18n.language }),
          [
            { text: 'OK', onPress: () => {
              setTimeout(() => {
                this.props.navigation.goBack(null)
              }, 500)
            }}
          ],
          { cancelable: false}
        )

      } else {
        this.setState({
          invalid: true,
          newPinNumber: undefined
        })
      }
      clear()
    } else {
    }
  }

  async componentWillMount() {
    const pinNumber = await SecureStore.getItemAsync('pinNumber')
    console.log("pinNumber", pinNumber)
    if (pinNumber) {
      console.log("pinNumber", pinNumber)
      this.setState({
        pinNumber: pinNumber
      })
    } else {
      Alert.alert(
        'PinNumber is empty',
        "You can't change pin number",
        [
          { text: 'OK', onPress: () => this.props.navigation.goBack(null)}
        ],
        { cancelable: false}
      )
    }
  }

  render() {
    const { t, i18n } = this.props
    let desc1, desc2
    if (this.state.unlocked === false){
      if (this.state.invalid) {
        desc1 = t('wrongExistingPinNumber', { locale: i18n.language })
        desc2 = t('wrongExistingPinNumberDesc', { locale: i18n.language })
      } else {
        desc1 = t('inputExistingPinNumber', { locale: i18n.language })
        desc2 = t('inputExistingPinNumberDesc', { locale: i18n.language })
      }
    } else if (this.state.newPinNumber === undefined){
      if (this.state.invalid) {
        desc1 = t('wrongNewPinNumber', { locale: i18n.language })
        desc2 = t('wrongNewPinNumberDesc', { locale: i18n.language })
      } else {
        desc1 = t('inputNewPinNumber', { locale: i18n.language })
        desc2 = t('inputNewPinNumberDesc', { locale: i18n.language })
      }
    } else if (!this.state.newPinNumberValid) {
      desc1 = t('confirmNewPinNumber', { locale: i18n.language })
      desc2 = t('confirmNewPinNumberDesc', { locale: i18n.language })
    } else {
      desc1 = t('pinNumberChanged', { locale: i18n.language })
      desc2 = t('pinNumberChangedDesc', { locale: i18n.language })
    }

    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#303140',
      }}>
        <StatusBar barStyle='light-content' />
        <View style={{ paddingTop: 15, paddingLeft: 15, flex: 0.1, width: "100%", justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', }}>
          <TouchableWithoutFeedback onPress={() => this.props.navigation.goBack(null)}>
            <Feather name='x' style={{ fontSize: 32, color: 'white', }} />
          </TouchableWithoutFeedback>
        </View>
        <View style={{flex:0.2,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{ marginTop: 25, fontSize: 15, color: 'white', }}>
              { desc1 }
            </Text>
            <Text style={{ marginTop: 15, fontSize: 15, color: 'white', }}>
              { desc2 }
            </Text>
          </View>
        </View>
        <View style={{flex:0.7,
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

export default ChangePinNumberPage
