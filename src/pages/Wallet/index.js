import _ from 'lodash'
import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'
import { Container, Content, Body, Left, List, ListItem, Icon, Separator, Right } from 'native-base'
// import { Util, SecureStore } from 'expo'
import { Header, WalletsList } from 'rediwallet/src/components'
import {actions} from "../index";
import connect from "react-redux/es/connect/connect";
// import { NavigationActions } from 'react-navigation'

class WalletPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      wallets: props.wallets,
    }

    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })
  }
  addWallet = async () => {
    const ethers = require('ethers');
    const wallet = await ethers.Wallet.fromMnemonic(this.props.mnemonic);
    console.log(this.props.mnemonic)
    console.log(wallet)
    this.props.addWallet(wallet)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      wallets: nextProps.wallets,
    })
  }

  render() {
    const { navigation } = this.props
    const { wallets } = this.state

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
            onPress={ this.addWallet }
            icon last>
            <Left>
              <Icon style={{ color: '#666666', }} name='ios-megaphone' />
            </Left>
            <Body>
              <Text>Create Account</Text>
            </Body>
            <Right>
              <Icon name='arrow-forward' />
            </Right>
          </ListItem>
          <Separator />

          {
            wallets ? (
              <View style={ styles.walletsListContainer }>
                <WalletsList
                  wallets={ wallets }
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

  walletsListContainer: {
    width: '100%',
    height: '100%',
  }
})

const mapDispatchToProps = (dispatch) => ({
  addWallet: (wallet) => dispatch(actions.addWallet(wallet)),
})

export default connect(null, mapDispatchToProps)(WalletPage)
