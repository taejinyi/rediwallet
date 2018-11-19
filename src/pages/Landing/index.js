import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { Container } from 'native-base'
import { actions, sagas } from '../.'
import { SecureStore } from 'expo'
import {
  Alert, Image,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
	Button,
  Right,
	Left,
} from 'native-base'

import ethers from 'ethers'
import {toHexString} from '../../utils'
import Wallet from "../../system/Wallet";
import {translate} from "react-i18next";
import {getWalletFromNetwork, startWalletInstance} from "../Wallet/sagas";

@translate(['main'], { wait: true })
class LandingPage extends React.Component {
 	constructor(props) {
		super(props)
    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })
		this._logo = require('../../assets/images/logo_428x222.png')
	}
  createAccount = async () => {
 		// const { t, i18n } = this.props
 		// this.props.showProcessingModal('Please wait a moment')
		this.props.setLoading()
    let seed = await SecureStore.getItemAsync('seed')

    if(seed && seed.length > 10) {
    	 // Alert.alert(
       //    // t('wallet_already_exist', { locale: i18n.language }),
       //    // t('wallet_already_exist_desc', { locale: i18n.language }),
				//  	'Wallet Registered',
       //    'Wallet is already registered',
       //    [
       //      { text: 'OK', onPress: () => this.navigateTo('Main', nav) }
       //    ],
       //    { cancelable: false}
       //  )
			return
		}
		try {
      seed = await ethers.utils.randomBytes(16)
      const hex = toHexString(seed)
      await SecureStore.setItemAsync('seed', hex)
			const mnemonic = await ethers.HDNode.entropyToMnemonic(seed)
			await this.props.createWallet(this.props.db)
			this.debounceNavigate('MnemonicBackup', {mnemonic: mnemonic})
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
 		const { t, i18n } = this.props
    return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 0, backgroundColor: "#303140" }}>
				<View style={{ flex: 0.3, flexDirection: "row", alignItems: 'flex-end' }}>
						<Image style={{ height: 78, width: 150, alignItems: 'center' }} source={ require('rediwallet/src/assets/images/logo_428x222.png') } />
				</View>
				<View style={{ flex: 0.7, flexDirection: "row", width: '92%', alignItems: 'flex-end'}}>
					<View style={{padding: 10, width: '100%', marginBottom: "30%"}}>

						<Button
							style={{ backgroundColor: "blue", width: '100%' }}
							onPress={this.createAccount}
							transparent>
							<Text style={{ fontWeight: 'bold', color: 'white', width: '100%', textAlign: "center" }}>
								{t('create_new_account', { locale: i18n.language })}
							</Text>
						</Button>
						<Button
							onPress={this.importMnemonic}
							transparent
							style={{ marginTop: 30, backgroundColor: "gray", width: '100%' }}
						>
							<Text style={{ fontWeight: 'bold', color: 'white', width: '100%' , textAlign: "center" }}>
								{t('import_account', { locale: i18n.language })}
							</Text>
						</Button>
					</View>
				</View>
			</View>
    )
  }
}


const styles = StyleSheet.create({
	rootWrapper: {
		flex: 1,
		backgroundColor: '#303140',
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
		color: '#303140',
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
  createWallet: (db) => dispatch(actions.createWallet(db)),
	setLoading: () => dispatch(actions.setLoading())
})

export default connect(null, mapDispatchToProps)(LandingPage)


