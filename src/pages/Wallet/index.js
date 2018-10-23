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
import Color from "../../constants/Colors";

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
    const { db, wallet } = this.props
    await this.props.getWalletFromDB(db)
    await this.props.getWalletsFromDB(db)
    this.props.getWalletsFromNetwork(db)
    this.logo = require('rediwallet/src/assets/images/logo_428x222.png')
  }

  render() {
    const { navigation } = this.props
    const { wallet } = this.state

    let currencyIcon, currencyName, totalAssetAmount = 0

    if (wallet){
      if (wallet.currency === "ETH") {
        currencyIcon = "ETH"
        currencyName = "Ethereum"
      } else if (wallet.currency === "IFUM") {
        currencyIcon = "IFUM"
        currencyName = "Infleum"
      } else if (wallet.currency === "KRWT") {
        currencyIcon = "￦"
        currencyName = "KRW Tether"
      } else {
        currencyIcon = "?"
        currencyName = "Unknown"
      }
      totalAssetAmount = wallet.accounts.ETH.balance * 230500 + wallet.accounts.IFUM.balance * 22 + wallet.accounts.KRWT.balance
    }



    return (
      <View style={{ flex: 1, backgroundColor: '#303140', alignItems: 'center'}}>
        <View style={{ flex: 0.3, width:'92%'}}>
            <View style={{ flex: 1, alignItems: 'flex-end', }}>
              <View style={{flexDirection: 'row', height: '100%', justifyContent: 'space-between', alignItems: 'flex-end', }}>
                <View style={{flex: 0.5, flexDirection: 'column'}} >
                  <Image style={{ height: 78, width: 150, alignItems: 'flex-end',  }} source={ this.logo } />
                </View>
                <View style={{flex: 0.5, flexDirection: 'column'}} >
                  <View style={{alignItems: 'flex-end', }}>
                    <View>
                      <Text style={styles.TotalAsset}>TOTAL ASSET</Text>
                    </View>
                    <View>
                      <Text numberOfLines={1} >
                        <Text style={styles.Currency}>{currencyIcon}</Text>
                        <Text numberOfLines={1} style={styles.TotalAssetAmount}>{totalAssetAmount.toString()}</Text>{'\n'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

        </View>
        <Content style={{ backgroundColor: '#303140', width:'100%'}}>
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
    fontSize: 20,
    fontWeight: 'normal',
    color: '#D2D2D2',
    textAlign: 'right',
  },
  Currency: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 26,
    fontWeight: 'normal',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  TotalAssetAmount: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 36,
    fontWeight: 'normal',
    color: '#FFFFFF',
    textAlign: 'right',
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
  getWalletFromDB: (db) => dispatch(actions.getWalletFromDB(db)),
  getWalletFromNetwork: (db, wallet) => dispatch(actions.getWalletFromNetwork(db, wallet)),
  getWalletsFromNetwork: (db) => dispatch(actions.getWalletsFromNetwork(db)),
  getWalletsFromDB: (db) => dispatch(actions.getWalletsFromDB(db)),
  addWallet: (db, wallet) => dispatch(actions.addWallet(db, wallet)),
})

export default connect(null, mapDispatchToProps)(WalletPage)
