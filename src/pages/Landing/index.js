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

const ethers = require('ethers');

class LandingPage extends React.Component {
 	constructor(props) {
		super(props)

    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })
	}
  generateMnemonic = async () => {
 		this.props.showProcessingModal('잠시만 기다려주세요')
 		console.log("generating mnemonic")
    const random = await ethers.utils.randomBytes(16)
    const mnemonic = await ethers.HDNode.entropyToMnemonic(random)
    const wallet = await ethers.Wallet.fromMnemonic(mnemonic);
    console.log(random)
    console.log(mnemonic)
    console.log(wallet)
		const { saveMnemonic, } = this.props
		try {
          await SecureStore.setItemAsync('mnemonic', mnemonic)
        } catch(error) {
          Alert.alert('토큰 저장 에러', '토큰을 저장하는데 에러가 발생 하였습니다.')
        }
		saveMnemonic(mnemonic)
    const { db } = this.props
    this.props.getInformation(db)
    this.debounceNavigate('MnemonicBackup')
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
              style={{ marginTop: 50 }}
              onPress={this.generateMnemonic}
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
  saveMnemonic: (mnemonic) => dispatch(actions.saveMnemonic(mnemonic)),
  getInformation: (db) => dispatch(actions.getInformation(db)),
})

export default connect(null, mapDispatchToProps)(LandingPage)


