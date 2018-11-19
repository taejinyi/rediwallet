import _ from 'lodash'
import React from 'react'
import {StyleSheet, View, Text, Image, Alert} from 'react-native'
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'
import { Container, Content, Body, Left, List, ListItem, Icon, Separator, Right } from 'native-base'
// import { Util, SecureStore } from 'expo'
import { Header, WalletAccountList } from '../../components'
import {actions, sagas} from "../index";
import { call, put, take, takeEvery } from 'redux-saga/effects'

import connect from "react-redux/es/connect/connect";
// import { NavigationActions } from 'react-navigation'
import {SecureStore} from "expo";
import {Currency, numberToString} from '../../utils'

import Wallet from "../../system/Wallet"
import Color from "../../constants/Colors";
import {saveWalletToDB} from "./sagas";
import {SAVE_WALLET} from "./actions";
import {translate} from "react-i18next";

@translate(['wallet'], { wait: true, })
class WalletPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      wallet: props.wallet,
      wallets: props.wallets,
    }

    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })
  }

  addWallet = async (currency) => {
    const wallet = await Wallet.generateWallet(currency)
    const { db } = this.props
    this.props.addWallet(db, wallet)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      wallet: nextProps.wallet,
      iWallet: nextProps.iWallet,
      wallets: nextProps.wallets,
    })
  }

  async componentWillMount() {
    const { db, wallet, iWallet } = this.props
    this.props.getWalletFromNetwork(db, iWallet)
    this.logo = require('../../assets/images/logo_428x222.png')
  }

  async componentDidMount() {
    this._internal = setInterval( () => {
      this.refreshWallet()
    }, 15000);
  }

  async componentWillUnmount() {
    clearInterval(this._interval);
  }


  async refreshWallet() {
    try {
      const { db, iWallet } = this.props
      // console.log("iWallet.address in refreshWallet", iWallet.address)
      await this.props.getWalletFromNetwork(db, iWallet)
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const { navigation } = this.props
    const { wallet, iWallet } = this.props

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
      if (iWallet !== undefined) {
        totalAssetAmount = iWallet.getTotalAssetAmount()
        console.log('totalAssetAmount', totalAssetAmount)
      }
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
                <View style={{alignItems: 'flex-end', width: '100%' }}>
                  <View>
                    <Text style={styles.TotalAsset}>TOTAL ASSET</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ fontWeight: 'bold', color: 'white', marginBottom: 8,fontSize: 26 }}>{currencyIcon + " " + numberToString(totalAssetAmount)}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <Content style={{ backgroundColor: '#303140', width:'100%'}}>
          {
            (wallet && wallet.address !== undefined) ? (
              <View style={ styles.WalletAccountListContainer }>
                <WalletAccountList
                  wallet={ wallet }
                  iWallet={this.props.iWallet}
                  navigation={ navigation }
                />
              </View>
            ) : (
              <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                <MaterialCommunityIcons name='close-circle-outline' style={{ fontSize: 84, color: '#aaaaaa', }} />
                <Text style={{ fontSize: 18, marginTop: 10, color: '#aaaaaa', }}>
                  Loading...
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
    fontSize:26,
    textAlign: "right",
    backgroundColor: 'transparent',
    fontWeight: 'normal',
    color: '#FFFFFF',
  },
  TotalAssetAmount: {
    backgroundColor: 'transparent',
    fontWeight: 'normal',
    color: '#FFFFFF',
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
  // getWalletFromDB: (db) => dispatch(actions.getWalletFromDB(db)),
  getWalletFromNetwork: (db, iWallet) => dispatch(actions.getWalletFromNetwork(db, iWallet)),
  showProcessingModal: (message) => dispatch(actions.showProcessingModal(message))
})

export default connect(null, mapDispatchToProps)(WalletPage)