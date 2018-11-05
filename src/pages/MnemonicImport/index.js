import _ from 'lodash'
import React from 'react'
import t from 'tcomb-form-native'
import Modal from 'react-native-modal'
import update from 'immutability-helper'
import { RippleLoader, TextLoader } from 'react-native-indicator'
import { Ionicons, EvilIcons } from '@expo/vector-icons'
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

const Form = t.form.Form
const DismissKeyboardAvoidingView = DismissKeyboardViewHOC(KeyboardAvoidingView)
import {Currency, generateWallet, toHexString} from "../../utils";
import ethers from "ethers";
import {SecureStore} from "expo";
import {NavigationActions} from "react-navigation";
import {actions} from "../index";
import {connect} from "react-redux";
import Wallet from "../../system/Wallet";



@translate(['main'], { wait: true })
class MnemonicImportPage extends React.Component {
  navigateTo = (_routeName) => {
    const { dispatch } = this.props.navigation

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: _routeName })
      ]
    })

    dispatch(resetAction)
  }

  constructor(props) {
		super(props)
    const refinementMnemonic = t.refinement(t.String, (value) => /(.+)/.test(value))
    const { i18n } = props
    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })

		this.formFields = t.struct({
			mnemonic: refinementMnemonic,
		})
		this.state = {
			formOptions: {
				fields: {
					mnemonic: {
						label: props.t('mnemonic', { locale: i18n.language }),
						template: this.customTemplateForMnemonicInput,
					},
				},
			},
			formValue: {
				mnemonic: '',
      },
      confirmModalShow: false,
		}

		this.formElement = null

    this.data = {
      mnemonic: '',
    }
	}


  pasteClipboard = async () => {
	  const data = await Clipboard.getString()
	  const newFormValue = update(this.state.formValue, {
      mnemonic: { $set: data }
    })
    this.setState({
      formValue: newFormValue
    })
  }

	customTemplateForMnemonicInput = (locals) => {
	  const { t, i18n } = this.props
		return (
			<View style={ styles.formItem }>
        <Text style={ locals.hasError ? styles.textErrorDesc : styles.textDesc }>{ locals.label }</Text>
				<Input
          onEndEditing={async () => {
            const validationResult = this.formElement.getComponent(['mnemonic']).validate()
            if(!validationResult.errors.length) {
              const newFormOptions = update(this.state.formOptions, {
                fields: {
                  mnemonic: {
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
                  mnemonic: {
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
          style={ styles.buttonDanal }>
          <Text style={{ color: 'white', fontSize: 13, fontWeight: 'bold', }}>{ t('paste_clipboard', { locale: i18n.language })}</Text>
        </Button>
			</View>
		)
	}

	_onFormSubmit = async () => {
    Keyboard.dismiss()

    const value = this.formElement.getValue()
		if(value) {
			const { mnemonic } = value
      await this.importMnemonic(mnemonic)
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
  importMnemonic = async (mnemonic) => {
    let seed = await SecureStore.getItemAsync('seed')
    if(seed && seed.length > 10) {
    	 Alert.alert(
          // t('wallet_already_exist', { locale: i18n.language }),
          // t('wallet_already_exist_desc', { locale: i18n.language }),
				 	'Wallet Registered',
          'Wallet is already registered',
          [
            { text: 'OK', onPress: () => this.navigateTo('Main', nav) }
          ],
          { cancelable: false}
        )
			return
		}
		try {
			const entropy = await ethers.HDNode.mnemonicToEntropy(mnemonic)
      const hex = entropy.substr(entropy.length - 32)
			await SecureStore.setItemAsync('seed', hex)
      const wallet = await Wallet.generateWallet()
			await this.props.addWallet(this.props.db, wallet)
			this.navigateTo('Main')
		} catch(error) {
    	console.log(error)
			// Alert.alert(
			// 	"Error",
			// 	error,
			// 	[
			// 		{ text: 'OK', onPress: () => {} }
			// 	],
			// 	{ cancelable: false}
			// )
		}
  }
	render() {
    const {
      formValue,
      formOptions,
    } = this.state
    const { i18n, t } = this.props

    const PlatformKeyboardAvoidingView = Platform.OS === 'android' ? View : KeyboardAvoidingView
    const mnemonic = formValue.mnemonic

		return (

      <Container>
        <View style={{ flex: 0.3, }}>
          <Header
            headerTitle='Send'
            renderContent={ false }
          />
        </View>
        <PlatformKeyboardAvoidingView keyboardVerticalOffset={ -36 } style={{ flex: 1, }} behavior='padding'>
          <Content contentContainerStyle={{ alignItems: 'center', }} style={{ backgroundColor: '#f7f7f7', }}>
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
                  { t('import', { locale: i18n.language }) }
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
		color: '#303140',
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
		paddingLeft: 5,
		paddingRight: 5,
		backgroundColor: '#e03b74',
		position: 'absolute',
		right: 0,
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
  addWallet: (db, wallet) => dispatch(actions.addWallet(db, wallet)),
})

export default connect(null, mapDispatchToProps)(MnemonicImportPage)

