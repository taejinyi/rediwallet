import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import {Button} from "native-base";
import Color from '../../constants/Colors'
import {actions} from "../../pages";
import { connect } from 'react-redux'
import {numberToString} from "../../utils/crypto";

class WalletAccountList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      lastAccountIndex: props.wallet.accounts ? ((Object.keys(props.wallet.accounts).length) - 1) : undefined,
      refreshing: false
    }
    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.wallet) {
      this.setState({
        lastAccountIndex: Object.keys(nextProps.wallet.accounts).length - 1,
      })
    }
  }

  onWalletClicked = (cardIndex) => {
  }

  _onRefresh = () => {
    console.log("onRefresh")
  }

  renderAccountItem = (account) => {
    const { navigation, iWallet } = this.props
    const accountData = account.item
    let accountColor, currencyIcon, currencyName, currencyTicker, fxRate

    currencyIcon = iWallet.currency
    if (currencyIcon === "KRWT") {
      currencyIcon = "￦"
    }
    try {
      fxRate = iWallet.fx[accountData.address][iWallet.currencyAddress]
    } catch(e) {
      fxRate = 1
    }

    if (accountData.currency === "ETH") {
      accountColor = Color.ethereumColor
      currencyTicker = "ETH"
      currencyName = "Ethereum"
    } else if (accountData.currency === "IFUM") {
      accountColor = Color.infleumColor
      currencyTicker = "IFUM"
      currencyName = "Infleum"
    } else if (accountData.currency === "KRWT") {
      accountColor = Color.krwtColor
      currencyTicker = "KRWT"
      currencyName = "KRW Tether"
    } else {
      currencyIcon = "?"
      currencyTicker = "???"
      currencyName = "Unknown"
      accountColor = "#999999"
    }
    const balance = accountData.balance / Math.pow(10, accountData.decimals)
    const moneyStr = numberToString(balance)

    return (
      <View style={ styles.walletContainer }>
        <TouchableOpacity onPress={ () => {
          this.props.showProcessingModal("Loading transaction history")
          this.debounceNavigate('WalletDetail', { account: accountData })
        }}>
          <View style={{ height: 90, width: '100%' ,backgroundColor: accountColor, flexDirection: "row"}}>
            <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ paddingLeft: 20, height: '100%', justifyContent: 'center' }}>
        				<Image style={{ width: 40, height: 40, }} source={ require('rediwallet/src/assets/images/bar_icon03.png') } />
              </View>
            </View>
            <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 20 }}>
              <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ fontWeight: 'bold', color: 'white', marginBottom: 8,fontSize: 16 }}>{ currencyName }</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'white', fontSize: 14 }}>{ currencyTicker + " " + moneyStr }</Text>
            </View>
            <View style={{ paddingRight: 20, flex: 0.4, justifyContent: 'center', alignItems: 'flex-end' }}>
              <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ fontWeight: 'bold', color: 'white', marginBottom: 8,fontSize: 16 }}>{ currencyIcon + " " + numberToString(balance * fxRate) }</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'white', fontSize: 14 }}>{ currencyIcon + " " + numberToString(fxRate) + " per " + currencyTicker }</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { wallet, } = this.props
    if(wallet === null || wallet.accounts === undefined)
      return null

    return (
      <FlatList
        data={ _.values(wallet.accounts) }
        renderItem={ this.renderAccountItem }
        refreshing={this.state.refreshing}
        onRefresh={this._onRefresh}
        contentContainerStyle={{ padding: 15 }}
        keyExtractor={( item, index ) => index.toString() }
      />
    )
  }
}

WalletAccountList.propTypes = {
  // wallets: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
  navigation: PropTypes.object,
}

const styles = StyleSheet.create({
  walletContainer: {
    width: '100%',
    paddingBottom: 10,
    paddingTop: 10
  },

  cardContainer: {
    height: 86,
    width: '100%',
  },

  cardHeaderContainer: {
    height: 56,
    justifyContent: 'center',
    borderTopRightRadius: 3,
    borderTopLeftRadius: 3,
  },

  cardBodyContainer: {
    height: 140,
    backgroundColor: 'white',
    borderBottomRightRadius: 3,
    borderBottomLeftRadius: 3,
  },
})
const mapDispatchToprops = (dispatch) => ({
  showProcessingModal: (message) => dispatch(actions.showProcessingModal(message))
})
export default connect(null, mapDispatchToprops)(WalletAccountList)
