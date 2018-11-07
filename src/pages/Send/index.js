import _ from 'lodash'
import React from 'react'
import t from 'tcomb-form-native'
import Modal from 'react-native-modal'
import update from 'immutability-helper'
import { RippleLoader} from 'react-native-indicator'
import { Ionicons, EvilIcons } from '@expo/vector-icons'
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'

import { Toast, Container, Content, Footer, FooterTab, Button, Icon, Spinner, Card, CardItem, Body } from 'native-base'
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  ScrollView,
  Clipboard,
  KeyboardAvoidingView,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Alert
} from 'react-native'
import { LoadingButton, Header, DismissKeyboardViewHOC, Input } from '../../components'
import {translate} from "react-i18next";
import { getHeaderBackgroundColor, getHeaderTitle } from "../../utils/crypto";
import {convertToMoney} from "../../utils";
import Color from "../../constants/Colors";
import {actions} from "../index";
import connect from "react-redux/es/connect/connect";

const Form = t.form.Form
const DismissKeyboardAvoidingView = DismissKeyboardViewHOC(KeyboardAvoidingView)

@translate(['main'], { wait: true })
class SendPage extends React.Component {
	constructor(props) {
		super(props)
    const refinementAddress = t.refinement(t.String, (value) => /(.+)/.test(value))
    const refinementAmount = t.refinement(t.Number, (value) => /(.+)/.test(value))
    const { i18n } = props
    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })

		this.formFields = t.struct({
			address: refinementAddress,
			amount: refinementAmount,
		})
		this.state = {
			formOptions: {
				fields: {
					address: {
						label: props.t('address', { locale: i18n.language }),
						template: this.customTemplateForAddressInput,
					},
					amount: {
						label: props.t('amount', { locale: i18n.language }),
						template: this.customTemplateForAmountInput,
					},
				},
			},
			formValue: {
				address: '',
				amount: 0,
      },
      confirmModalShow: false,
		}

		this.formElement = null

    this.sendData = {
      address: "",
      amount: 0,
    }
	}
	scanQRCode = () => {
    setTimeout(() => this.debounceNavigate('QRCodeScan', {returnData: this.returnData.bind(this)}), 400)
  }

  returnData = (data) => {
	  const newFormValue = update(this.state.formValue, {
      address: { $set: data }
    })
    this.setState({
      formValue: newFormValue
    })
  }

  pasteClipboard = async () => {
	  const data = await Clipboard.getString()
	  const newFormValue = update(this.state.formValue, {
      address: { $set: data }
    })
    this.setState({
      formValue: newFormValue
    })
  }

	customTemplateForAddressInput = (locals) => {
	  const { t, i18n } = this.props
		return (
			<View style={ styles.formItem }>
        <Text style={ locals.hasError ? styles.textErrorDesc : styles.textDesc }>{ locals.label }</Text>
				<Input
          textStyle={{ color: '#eeeeee'}}
          onEndEditing={async () => {
            const validationResult = this.formElement.getComponent(['address']).validate()
            if(!validationResult.errors.length) {
              const newFormOptions = update(this.state.formOptions, {
                fields: {
                  address: {
                    hasError: { $set: false },
                  }
                }
              })
              this.setState({
                formOptions: newFormOptions
              })
            } else {
              const newFormOptions = update(this.state.formOptions, {
                fields: {
                  address: {
                    hasError: { $set: true },
                  }
                }
              })
              this.setState({
                formOptions: newFormOptions
              })
            }
          }}
          autoCapitalize="none"
					onChangeText={value => locals.onChange(value)}
					value={ locals.value }
					underlineColor={ locals.hasError ? '#e75a5a' : '#dadada' }
					underlineHoverColor='#aaaaaa'
				/>
        <Button
          onPress={ () => this.pasteClipboard() }
          style={[ styles.buttonDanal, { right: 50 } ]}>
          <MaterialCommunityIcons style={{ color: 'white', fontSize: 20 }} name='content-paste' />
          {/*<Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold', }}>{ t('paste_clipboard', { locale: i18n.language })}</Text>*/}
        </Button>
        <Button
          onPress={ () => this.scanQRCode() }
          style={[ styles.buttonDanal, { right: 5 } ]}>
          <MaterialCommunityIcons style={{ color: 'white', fontSize: 20 }} name='qrcode-scan' />
          {/*<Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold', }}>{ t('scan_qrcode', { locale: i18n.language })}</Text>*/}
        </Button>

			</View>
		)
	}

	customTemplateForAmountInput = (locals) => {
		return (
			<View style={ styles.formItem }>
        <Text style={ locals.hasError ? styles.textErrorDesc : styles.textDesc }>{ locals.label }</Text>
				<Input
          textStyle={{ color: '#eeeeee'}}
          onEndEditing={async () => {
            const validationResult = this.formElement.getComponent(['amount']).validate()

            if(!validationResult.errors.length) {
              const newFormOptions = update(this.state.formOptions, {
                fields: {
                  amount: {
                    hasError: { $set: false },
                  }
                }
              })
              this.setState({
                formOptions: newFormOptions
              })
            } else {
              const newFormOptions = update(this.state.formOptions, {
                fields: {
                  amount: {
                    hasError: { $set: true },
                  }
                }
              })
              this.setState({
                formOptions: newFormOptions
              })
            }
          }}
          autoCapitalize="none"
					onChangeText={value => locals.onChange(value)}
					value={ locals.value }
					underlineColor={ locals.hasError ? '#e75a5a' : '#dadada' }
					underlineHoverColor='#aaaaaa'
				/>
			</View>
		)
	}
	_onFormSubmit = async () => {
    Keyboard.dismiss()

    const value = this.formElement.getValue()
		if(value) {
			const { address, amount } = value

			this.sendData = {
				address: address,
				amount: amount,
			}
      this.setState({
        confirmModalShow: true
      })

      return true
    }
	}

  confirm = async () => {
    await this.setState({
      confirmModalShow: false
    })
    const account = this.props.navigation.state.params.account
    const wallet = this.props.navigation.state.params.wallet
    const _wallet = this.props.navigation.state.params._wallet
    const promise = _wallet.transfer(account, this.sendData.address, this.sendData.amount)

    setTimeout(async () => {
      await this.props.showProcessingModal("Please wait a few seconds")
      promise.then((tx) => {
        const now = parseInt(Date.now() / 1000)
        const transactionData = {
          from: wallet.address,
          to: this.sendData.address,
          value: this.sendData.amount * account.decimals,
          hash: tx.transactionHash,
          confirmations: 0,
          timeStamp: now
        }

        const transaction = Object.assign({}, tx, transactionData)
        this.props.saveOneTransaction(this.props.db, wallet, account, transaction)
        this.props.hideProcessingModal()

        setTimeout(async () => {
          Alert.alert(
            'Transfer Requested',
            'Transfer is successfully requested',
            [
              { text: 'OK', onPress: () => this.props.navigation.goBack(null)}
            ],
            { cancelable: false}
          )
        }, 300);  //5000 milliseconds
      })
    }, 300);  //5000 milliseconds
  }
  async componentWillMount() {
	  const account = this.props.navigation.state.params.account
    this.headerBackgroundColor = getHeaderBackgroundColor(account)
  }
	render() {
    const {
      formValue,
      formOptions,
    } = this.state
    const { i18n, t } = this.props

    const PlatformKeyboardAvoidingView = Platform.OS === 'android' ? View : KeyboardAvoidingView
    const targetAddress = formValue.address
    const amount = formValue.amount


    const { navigation, transactions } = this.props
    const { wallet, account, _wallet } = this.props.navigation.state.params
    let accountColor, currencyIcon, currencyName, currencyTicker, fxRate

    if (account.currency === "ETH") {
      accountColor = Color.ethereumColor
      currencyIcon = "￦"
      currencyTicker = "ETH"
      currencyName = "Ethereum"
      fxRate = 230500
    } else if (account.currency === "IFUM") {
      accountColor = Color.infleumColor
      currencyIcon = "￦"
      currencyTicker = "IFUM"
      currencyName = "Infleum"
      fxRate = 22
    } else if (account.currency === "KRWT") {
      accountColor = Color.krwtColor
      currencyIcon = "￦"
      currencyTicker = "KRWT"
      currencyName = "KRW Tether"
      fxRate = 1
    } else {
      currencyIcon = "?"
      currencyTicker = "???"
      currencyName = "Unknown"
      accountColor = "#999999"
      fxRate = 1
    }

    let moneyStr
    const fraction = (account.balance - Math.floor(account.balance))
    const strFraction = fraction.toFixed(8)
    if (fraction > 0) {
      moneyStr = convertToMoney(Math.floor(account.balance)) + strFraction.substr(1)
    } else {
      moneyStr = convertToMoney(account.balance)
    }

		return (

      <Container>
        {/*<View style={{ flex: 0.3 }}>*/}
          {/*<Header*/}
            {/*backgroundColor={this.headerBackgroundColor}*/}
            {/*headerTitle='Send'*/}
            {/*renderContent={ false }*/}
          {/*/>*/}
        {/*</View>*/}
        <View style={{ height: 140, width:'100%', backgroundColor: this.headerBackgroundColor, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{ width:'90%', justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderColor: '#aaaaaa' }}>
            <Button
              onPress={this.copyAddressToClipboard}
              transparent
              style={{ width:'100%', justifyContent: 'center', alignItems: 'center', marginTop:0, marginBottom: 0}}
            >
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 12 }}>{ wallet.address }</Text>
            </Button>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'white', fontSize: 14, marginTop: 0 }}>{ currencyIcon + convertToMoney(fxRate) + " per " + currencyTicker }</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'white', fontSize: 18, marginTop: 10 }}>{ currencyTicker + " " + moneyStr }</Text>
            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 28 }}>{ " ~ " + currencyIcon + convertToMoney(Math.floor(account.balance * fxRate)) }</Text>
          </View>
        </View>
        <Modal
          avoidKeyboard={ true }
          useNativeDriver={ true }
          isVisible={ this.state.confirmModalShow }
          style={{ marginLeft: 'auto', marginRight: 'auto', }}>
          <View style={{ borderRadius: 5, backgroundColor: 'white', height: 230, width: '80%', }}>
            <View style={{ flex: 0.7, padding: 20, }}>
              <Text style={{ marginBottom: 10, fontSize: 19, fontWeight: 'bold', }}>{ t('confirm_send', { locale: i18n.language }) }</Text>
              <Text style={{ color: '#666666', }}>{t('confirm_send_desc', { locale: i18n.language })}</Text>
              <Text style={{ color: '#666666', }}>{t('address', { locale: i18n.language })}: {this.sendData.address}</Text>
              <Text style={{ color: '#666666', }}>{t('amount', { locale: i18n.language })}: {this.sendData.amount}</Text>
            </View>
            <View style={{ borderColor: '#999999', borderTopWidth: 0.6, flex: 0.3, flexDirection: 'row', }}>
              <TouchableWithoutFeedback onPress={() => this.setState({ confirmModalShow: false, })}>
                <View style={{ borderColor: '#999999', borderRightWidth: 0.6, flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                  <Text style={{ fontSize: 18, color: '#666666', }}>{ t('cancel', { locale: i18n.language }) }</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => this.confirm() }>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#666666', }}>{ t('send', { locale: i18n.language }) }</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </Modal>
        <PlatformKeyboardAvoidingView keyboardVerticalOffset={ -36 } style={{ flex: 1, }} behavior='padding'>
          <Content contentContainerStyle={{ alignItems: 'center', }} style={{ backgroundColor: '#303140', }}>
            <View style={ styles.formContainer }>
              <Form
                ref={ (el) => this.formElement = el }
                type={ this.formFields }
                options={ formOptions }
                value={ formValue }
                onChange={(value) => { this.setState({ formValue: { ... value } })}}
              />
            </View>
          </Content>
          <Footer>
            <FooterTab>
              <LoadingButton
                full
                Component={ Button }
                onPress={ this._onFormSubmit }
                loadingView={
                  <RippleLoader size={ 18 } color='white' />
                }
                style={ styles.buttonSubmit }>
                <Text style={{ color: 'white', fontSize: 17, }}>
                  { t('send', { locale: i18n.language }) }
                </Text>
              </LoadingButton>
            </FooterTab>
          </Footer>
        </PlatformKeyboardAvoidingView>
      </Container>
		)
	}
}

const styles = StyleSheet.create({
	signupContainer: {
    flex: 1,
	},

	descContainer: {
    height: 70,
    backgroundColor: '#303140',
	},

	textContainer: {
    marginLeft: 12,
    marginTop: 30,
	},

	signupFormContainer: {
    height: '100%',
		backgroundColor: 'black',
    width: '100%',
		alignItems: 'center',
	},

	formContainer: {
		width: '93%',
    height: '100%',
	},

	formItem: {
		marginTop: '7%',
	},

	textDesc: {
		color: '#ffffff',
		fontSize: 14,
		fontWeight: 'bold',
	},

	textErrorDesc: {
		color: '#e75a5a',
		fontSize: 14,
		fontWeight: 'bold',
	},

	buttonDanal: {
		height: 'auto',
		paddingLeft: 8,
		paddingRight: 8,
		backgroundColor: '#e03b74',
		position: 'absolute',
		bottom: Platform.OS === 'android' ? 12 : 3,
	},

	textDanalOK: {
		position: 'absolute',
		right: 0,
		bottom: 3,
		height: 'auto',
		color: '#303140',
	},

	buttonSubmit: {
		backgroundColor: '#6341d3',
	}
})

const mapDispatchToProps = (dispatch) => ({
  showProcessingModal: (message) => dispatch(actions.showProcessingModal(message)),
  hideProcessingModal: () => dispatch(actions.hideProcessingModal()),
  saveOneTransaction: (db, wallet, account, transaction) => dispatch(actions.saveOneTransaction(db, wallet, account, transaction)),
})

export default connect(null, mapDispatchToProps)(SendPage)


