import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { Container } from 'native-base'
import { actions, sagas } from '../.'
import { SecureStore } from 'expo'
import {
  Alert,
	StyleSheet,
  Text,
	View,
} from 'react-native'
import {
	Button,
  Right,
	Left,
} from 'native-base'
import platform from 'rediwallet/src/native-base-theme/variables/platform'
import getTheme from 'rediwallet/src/native-base-theme/components'
import {TextLoader} from "react-native-indicator";

import MnemonicPhrase from "../../library/mnemonic-phrase.min";
import * as loomjs from '../../network/web3/loom.umd'
import Math from '../../library/seedrandom.min'

class LandingPage extends React.Component {
 	constructor(props) {
		super(props)

    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })
	}
  generateWallet = async () => {
 		// const { t, i18n } = this.props
 		this.props.showProcessingModal('잠시만 기다려주세요')
    let publicAddress = await SecureStore.getItemAsync('publicAddress')
		console.log("publicAddress", publicAddress)
    if(publicAddress && publicAddress.length > 10) {
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
			console.log('in generateWallet, starting')
			console.log('in generateWallet, starting', Math)
			console.log('in generateWallet, starting', Math.default)
			console.log('in generateWallet, starting', Math.seedrandom)

			const arrayPrivateKey = loomjs.CryptoUtils.generatePrivateKey()
			console.log('in generateWallet', arrayPrivateKey)
			const privateKey = loomjs.CryptoUtils.bytesToHex(arrayPrivateKey)
			console.log('in generateWallet', privateKey)
			const arrayPublicAddress = loomjs.CryptoUtils.publicKeyFromPrivateKey(arrayPrivateKey)
			publicAddress = loomjs.CryptoUtils.bytesToHexAddr(arrayPublicAddress)
			console.log('in generateWallet', publicAddress, privateKey)
			await SecureStore.setItemAsync('publicAddress', publicAddress)
			await SecureStore.setItemAsync(publicAddress, privateKey)
			const { db } = this.props
			this.debounceNavigate('MnemonicBackup')
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

  importMnemonic = () => {
    this.debounceNavigate('MnemonicImport')
  }

  render() {
    return (
      <Container>
        <View style={{ flex: 1, }}>
          <Left>
            <Button
              style={{ marginTop: 200 }}
              onPress={this.generateWallet}
              transparent>
              <Text style={{ fontWeight: 'bold', color: '#10b5bc' }}>Create New Account</Text>
            </Button>
          </Left>
          <Right>
            <Button
              onPress={this.importMnemonic}
              transparent>
              <Text style={{ fontWeight: 'bold', color: '#10b5bc' }}>Import Account</Text>
            </Button>
          </Right>
        </View>
      </Container>
    )
  }
}


const styles = StyleSheet.create({
	rootWrapper: {
		flex: 1,
		backgroundColor: '#10b5bc',
		flexDirection: 'column',
	},

	descWrapper: {
    alignItems: 'center',
    marginTop: 30,
	},

	textWrapper: {
    width: '94%',
		marginTop: 45,
	},

	formWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
    marginBottom: '10%',
	},

	formCardStyle: {
		width: '94%',
		marginTop: 25,
	},

	formItemWrapper: {
		marginBottom: '6%',
		marginTop: '6%',
		width: '100%',
		flexDirection: 'column'
	},

	formItemDesc: {
		color: '#10b5bc',
		fontWeight: 'bold'
	},

	textErrorDesc: {
		color: '#e75a5a',
		fontWeight: 'bold'
	}
})

const mapDispatchToProps = (dispatch) => ({
  showProcessingModal: (message) => dispatch(actions.showProcessingModal(message)),
  hideProcessingModal: () => dispatch(actions.hideProcessingModal()),
})

export default connect(null, mapDispatchToProps)(LandingPage)


