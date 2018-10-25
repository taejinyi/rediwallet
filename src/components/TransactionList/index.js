import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import {Button} from "native-base";
import Color from '../../constants/Colors'
import { convertToMoney } from '../../utils'

class TransactionList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      lastTransactionIndex: props.account ? ((Object.keys(props.account.transactions).length) - 1) : undefined,
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.wallets) {
      this.setState({
        lastTransactionIndex: Object.keys(nextProps.account.transactions).length - 1,
      })
    }
  }

  renderTransactionItem = (transaction) => {
    const { navigation, wallet, account } = this.props
    const accountData = transaction.item
    let accountColor, currencyIcon, currencyName, currencyTicker, fxRate

    if (account.currency === "ETH") {
      accountColor = Color.ethereumColor
      currencyIcon = "￦"
      currencyTicker = "ETH"
      currencyName = "Ethereum"
      fxRate = 230500
    } else if (account.currency === "IFUM") {
      accountColor = Color.infleumColor
      currencyIcon = "￦"
      currencyTicker = "IFUM"
      currencyName = "Infleum"
      fxRate = 22
    } else if (account.currency === "KRWT") {
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
    let moneyStr
    const fraction = account.balance - Math.floor(account.balance)
    const strFraction = fraction.toString()
    if (fraction > 0) {
      moneyStr = convertToMoney(Math.floor(account.balance)) + strFraction.substr(1)
    } else {
      moneyStr = convertToMoney(account.balance)
    }

    return (
      <View style={ styles.walletContainer }>
        <TouchableOpacity onPress={ () => {
          navigation.navigate('WalletDetail', { wallet: wallet, account: account, _wallet: this.props._wallet })
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
              <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ fontWeight: 'bold', color: 'white', marginBottom: 8,fontSize: 16 }}>{ currencyIcon + convertToMoney(Math.floor(accountData.balance * fxRate)) }</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'white', fontSize: 14 }}>{ currencyIcon + convertToMoney(fxRate) + " per " + currencyTicker }</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { account, } = this.props
    console.log('account = ', account)

    if(account === undefined || account.transactions === undefined)
      return null

    return (
      <FlatList
        data={ _.values(account.transactions) }
        renderItem={ this.renderTransactionItem }
        contentContainerStyle={{ padding: 15 }}
        keyExtractor={( item, index ) => index.toString() }
      />
    )
  }
}

TransactionList.propTypes = {
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

export default TransactionList
