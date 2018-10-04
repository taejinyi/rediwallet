import _ from 'lodash'
import React from 'react'
import {StyleSheet, View, Text, Alert} from 'react-native'
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'
import { Container, Content, Body, Left, List, ListItem, Icon, Separator, Right } from 'native-base'
// import { Util, SecureStore } from 'expo'
import { Header, WalletAccountList } from 'rediwallet/src/components'
import {actions} from "../index";
import connect from "react-redux/es/connect/connect";
// import { NavigationActions } from 'react-navigation'
import {SecureStore} from "expo";

class WalletPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      wallet: props.wallet,
    }

    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })
  }
  addAccount = async () => {
    const strWalletIndex = await SecureStore.getItemAsync('walletIndex')
    const mnemonic = await SecureStore.getItemAsync('mnemonic')

    let walletIndex
    if(strWalletIndex == null) {
      walletIndex = 0
    } else {
      walletIndex = parseInt(strWalletIndex, 10) + 1
    }
    const ethers = require('ethers');
    const path = "m/44'/60'/0'/0/" + walletIndex
    const _newAccount = await ethers.Wallet.fromMnemonic(mnemonic, path);
    const newAccount = {
      address: _newAccount.address,
      privateKey: _newAccount.privateKey,
      nonce: walletIndex
    }
    console.log(newAccount)
    this.props.addAccount(this.props.db, newAccount)
    try {
      await SecureStore.setItemAsync('walletIndex', walletIndex.toString())
    } catch(error) {
      console.log(error)
      Alert.alert('Wallet Index Save Error', 'Failed to save the wallet index.')
    }
  }
  /*
   Wallet {
    "address": "0x8f55dE5d4df0Ac41A8e8b4dF9D0D87df5e94fC06",
    "defaultGasLimit": 1500000,
    "mnemonic": "glad blur gun hill possible copy laugh idea reopen visual blind east",
    "path": "m/44'/60'/0'/0/0",
    "privateKey": "0x509c06df0bf81b75f595f190a40ab59ab401bf6064badbbebb1021e9b3142637",
    "provider": undefined,
    "sign": [Function anonymous],
  }
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      wallet: nextProps.wallet,
    })
  }

  render() {
    const { navigation } = this.props
    const { wallet } = this.state

    return (
      <View style={{ flex: 1, }}>
        <View style={{ flex: 0.3, }}>
          <Header
            headerTitle='Wallet'
            renderContent={ false }
          />
        </View>
        <Content style={{ backgroundColor: 'white', }}>
          <ListItem
            onPress={ this.addAccount }
            icon last>
            <Left>
              <Icon style={{ color: '#666666', }} name='ios-megaphone' />
            </Left>
            <Body>
              <Text>Add Account</Text>
            </Body>
            <Right>
              <Icon name='arrow-forward' />
            </Right>
          </ListItem>
          <Separator />

          {
            wallet ? (
              <View style={ styles.WalletAccountListContainer }>
                <WalletAccountList
                  wallet={ wallet }
                  navigation={ navigation }
                />
              </View>
            ) : (
              <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <MaterialCommunityIcons name='close-circle-outline' style={{ fontSize: 84, color: '#aaaaaa', }} />
                <Text style={{ fontSize: 18, marginTop: 10, color: '#aaaaaa', }}>
                  만들어진 지갑이 없습니다.
                </Text>
              </View>
            )
          }
        </Content>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  walletsPageContainer: {
    flex: 1,
  },

  headerContainer: {
    flex: 0.3,
  },

  walletsContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },

  WalletAccountListContainer: {
    width: '100%',
    height: '100%',
  }
})

const mapDispatchToProps = (dispatch) => ({
  addAccount: (db, account) => dispatch(actions.addAccount(db, account)),
})

export default connect(null, mapDispatchToProps)(WalletPage)
