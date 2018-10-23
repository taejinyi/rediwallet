import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import {Button} from "native-base";
import Color from '../../constants/Colors'
class WalletAccountList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      lastWalletIndex: props.wallets ? ((Object.keys(props.wallets).length) - 1) : undefined,
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.wallets) {
      this.setState({
        lastWalletIndex: Object.keys(nextProps.wallets).length - 1,
      })
    }
  }

  onWalletClicked = (cardIndex) => {
  }

  renderAccountItem = (account) => {
    const { navigation, wallet } = this.props
    const accountData = account.item
    let accountColor, currencyIcon, currencyName, currencyTicker, fxRate

    if (accountData.currency === "ETH") {
      accountColor = Color.ethereumColor
      currencyIcon = "￦"
      currencyTicker = "ETH"
      currencyName = "Ethereum"
      fxRate = 230500
    } else if (accountData.currency === "IFUM") {
      accountColor = Color.infleumColor
      currencyIcon = "￦"
      currencyTicker = "IFUM"
      currencyName = "Infleum"
      fxRate = 22
    } else if (accountData.currency === "KRWT") {
      accountColor = Color.krwtColor
      currencyIcon = "￦"
      currencyTicker = "KRWT"
      currencyName = "KRW Tether"
      fxRate = 1
    } else {
      currencyIcon = "?"
      currencyTicker = "???"
      currencyName = "Unknown"
      accountColor = "#999999"
      fxRate = 1
    }


    console.log('accountColor', accountColor)

    return (
      <View style={ styles.walletContainer }>
        <TouchableOpacity onPress={ () => {
          navigation.navigate('WalletDetail', { wallet: accountData })
        }}>
          <View style={{ height: 90, width: '100%' ,backgroundColor: accountColor, flexDirection: "row"}}>
            <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ paddingLeft: 20, height: '100%', justifyContent: 'center' }}>
        				<Image style={{ width: 40, height: 40, }} source={ require('rediwallet/src/assets/images/bar_icon03.png') } />
              </View>
            </View>
            <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 20 }}>
              <Text numberOfLines={1} style={{ fontWeight: 'bold', color: 'white', marginBottom: 8,fontSize: 16 }}>{ currencyName }</Text>
              <Text numberOfLines={1} style={{ color: 'white', fontSize: 14 }}>{ currencyTicker + " " + accountData.balance.toString() }</Text>
            </View>
            <View style={{ paddingRight: 20, flex: 0.4, justifyContent: 'center', alignItems: 'flex-end' }}>
              <Text numberOfLines={1} style={{ fontWeight: 'bold', color: 'white', marginBottom: 8,fontSize: 16 }}>{ currencyIcon + Math.floor(accountData.balance * fxRate).toString() }</Text>
              <Text numberOfLines={1} style={{ color: 'white', fontSize: 14 }}>{ currencyTicker + " per " + currencyIcon + fxRate.toString() }</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { wallet, } = this.props

    if(wallet === null)
      return null

    return (
      <FlatList
        data={ _.values(wallet.accounts) }
        renderItem={ this.renderAccountItem }
        contentContainerStyle={{ padding: 15 }}
        keyExtractor={( item, index ) => index.toString() }
      />
    )
  }
}

WalletAccountList.propTypes = {
  wallets: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
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

export default WalletAccountList
