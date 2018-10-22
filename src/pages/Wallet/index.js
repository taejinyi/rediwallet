import _ from 'lodash'
import React from 'react'
import {StyleSheet, View, Text, Image, Alert} from 'react-native'
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

import Wallet from "../../system/Wallet"

class WalletPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      wallet: props.wallet,
      wallets: props.wallets,
    }

    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })
    this._wallet = new Wallet()
  }
  getWalletFromNetwork = async () => {
    const { db, dispatch, wallet } = this.props
    console.log('button')
    await this.props.getWalletFromNetwork(db, wallet)
  }

  addWallet = async (currency) => {
    const wallet = await Wallet.generateWallet(currency)
    const { db } = this.props
    this.props.addWallet(db, wallet)
    console.log(wallet)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      wallet: nextProps.wallet,
      wallets: nextProps.wallets,
    })
  }
  async componentWillMount() {
    const { db, wallets, wallet } = this.props
    await this.props.getWalletsFromDB(db)
    this.props.getWalletsFromNetwork(db)
    this.logo = require('rediwallet/src/assets/images/logo_400x400.png')
  }

  render() {
    const { navigation } = this.props
    const { wallets } = this.state

    return (
      <View style={{ flex: 1, backgroundColor: '#303140',}}>
        <View style={{ flex: 0.3, }}>
            <View style={{ flex: 0.5 }}>
            </View>
            <View style={{ color: 'white', flex: 0.5 }}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 0.5}} >
                  <Image style={{ height: 150, width: 150 }} source={ this.logo } />
                </View>
                <View style={{flex: 0.5}} >
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.TotalAsset}>TOTAL ASSET</Text>
                    <Text style={styles._137500}>
                      <Text>￦</Text>{'\n'}
                      <Text>137,500</Text>{'\n'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

        </View>
        <Content style={{ backgroundColor: '#303140', }}>
          <ListItem
            onPress={ () => this.addWallet(Currency.IFUM.ticker) }
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
            onPress={ () => this.addWallet(Currency.ETH.ticker) }
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
            onPress={ () => this.addWallet(Currency.KRWT.ticker) }
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
            wallets ? (
              <View style={ styles.WalletAccountListContainer }>
                <WalletAccountList
                  wallets={ wallets }
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
  headerContainer: {
    flex: 0.3,
    height: '100%',
    flexDirection: 'column',
  },

  actionsWrapper: {
    flex: 0.4,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
  },

  iconsWrapper: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  titleTextWrapper: {
    flex: 0.3,
  },

  titleText: {
    fontSize: 24,
    color: 'white',
    marginLeft: '4%',
  },
  TotalAsset: {
    backgroundColor: 'transparent',
    fontSize: 32,
    fontWeight: 'normal',
    color: '#D2D2D2',
    textAlign: 'right'
  },
  _137500: {
    backgroundColor: 'transparent',
    fontSize: 78,
    fontWeight: 'normal',
    color: '#FFFFFF',
    textAlign: 'left'
  },
  searchContainer: {
    flex: 0.3,
    alignItems: 'center',
  },
  walletsPageContainer: {
    flex: 1,
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
  getWalletsFromNetwork: (db) => dispatch(actions.getWalletsFromNetwork(db)),
  getWalletsFromDB: (db) => dispatch(actions.getWalletsFromDB(db)),
  addWallet: (db, wallet) => dispatch(actions.addWallet(db, wallet)),
})

export default connect(null, mapDispatchToProps)(WalletPage)
