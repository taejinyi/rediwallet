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

import ethers from 'ethers'
import { toHexString } from '../../utils'
import Wallet from "../../system/Wallet";

class LandingPage extends React.Component {
 	constructor(props) {
		super(props)
    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })
	}
  createAccount = async () => {
 		// const { t, i18n } = this.props
 		this.props.showProcessingModal('Please wait a moment')
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
      seed = await ethers.utils.randomBytes(16)
      const hex = toHexString(seed)
      await SecureStore.setItemAsync('seed', hex)
			const mnemonic = await ethers.HDNode.entropyToMnemonic(seed)
			const wallet = await Wallet.generateWallet()
			await this.props.addWallet(this.props.db, wallet)
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
    return (
      <Container>
        <View style={{ flex: 1, }}>
          <Left>
            <Button
              style={{ marginTop: 200 }}
              onPress={this.createAccount}
              transparent>
              <Text style={{ fontWeight: 'bold', color: '#303140' }}>Create New Account</Text>
            </Button>
          </Left>
          <Right>
            <Button
              onPress={this.importMnemonic}
              transparent>
              <Text style={{ fontWeight: 'bold', color: '#303140' }}>Import Account</Text>
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
  addWallet: (db, wallet) => dispatch(actions.addWallet(db, wallet)),
})

export default connect(null, mapDispatchToProps)(LandingPage)


