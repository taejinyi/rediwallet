import _ from 'lodash'
import React from 'react'
import {StyleSheet, View, Text, Alert} from 'react-native'
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'
import { Container, Content, Body, Left, List, ListItem, Icon, Separator, Right } from 'native-base'
// import { Util, SecureStore } from 'expo'
import { Header, WalletAccountList } from 'rediwallet/src/components'
import {actions, sagas} from "../index";
import { call, put, take, takeEvery } from 'redux-saga/effects'

import connect from "react-redux/es/connect/connect";
// import { NavigationActions } from 'react-navigation'
import {SecureStore} from "expo";
import {generateWallet, Currency} from '../../utils'
class WalletPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      wallet: props.wallet,
    }

    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })
  }
  getWalletFromNetwork = async () => {
    const { db, dispatch, wallet } = this.props
    console.log('button')
    await this.props.getWalletFromNetwork(db, wallet)
  }

  addWallet = async (currency) => {
    const wallet = await generateWallet(currency)
    console.log(wallet)
  }

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
            onPress={ () => this.addWallet(Currency.IFUM) }
            icon last>
            <Left>
              <Icon style={{ color: '#666666', }} name='ios-megaphone' />
            </Left>
            <Body>
              <Text>Generate IFUM Wallet</Text>
            </Body>
            <Right>
              <Icon name='arrow-forward' />
            </Right>
          </ListItem>
          <ListItem
            onPress={ () => this.addWallet(Currency.ETH) }
            icon last>
            <Left>
              <Icon style={{ color: '#666666', }} name='ios-megaphone' />
            </Left>
            <Body>
              <Text>Generate ETH Wallet</Text>
            </Body>
            <Right>
              <Icon name='arrow-forward' />
            </Right>
          </ListItem>
          <ListItem
            onPress={ () => this.addWallet(Currency.KRWT) }
            icon last>
            <Left>
              <Icon style={{ color: '#666666', }} name='ios-megaphone' />
            </Left>
            <Body>
              <Text>Generate KRWT Wallet</Text>
            </Body>
            <Right>
              <Icon name='arrow-forward' />
            </Right>
          </ListItem>
          <ListItem
            onPress={ this.getWalletFromNetwork }
            icon last>
            <Left>
              <Icon style={{ color: '#666666', }} name='ios-megaphone' />
            </Left>
            <Body>
              <Text>Get Wallet From Network</Text>
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
                  만들어진 지갑이 없습니다..
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
  getWalletFromNetwork: (db, wallet) => dispatch(actions.getWalletFromNetwork(db, wallet)),
})

export default connect(null, mapDispatchToProps)(WalletPage)
