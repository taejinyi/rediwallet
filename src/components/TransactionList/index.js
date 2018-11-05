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
      lastTransactionIndex: props.transactions ? ((Object.keys(props.transactions).length) - 1) : undefined,
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.transactions) {
      this.setState({
        lastTransactionIndex: Object.keys(nextProps.transactions).length - 1,
      })
    }
  }

  renderTransactionItem = (transactionData) => {
    const { navigation, wallet, account } = this.props
    const transaction = transactionData.item
    const currencyTicker = account.currency
    let type, typeIcon, counterAddress, statusIcon

    const address = wallet.address.toLowerCase()

    if (transaction.from === address) {
      if (transaction.to) {
        type = 'send'
        typeIcon = require('../../assets/images/icon_send.png')
        counterAddress = transaction.to
      } else {
        type = 'contract'
        typeIcon = require('../../assets/images/icon_send.png')
        counterAddress = transaction.contractAddress
      }
    } else if (transaction.to === address) {
      type = 'receive'
      typeIcon = require('../../assets/images/icon_receive.png')
      counterAddress = transaction.from
    } else {
      type = 'unknown'
      typeIcon = require('../../assets/images/transfer.png')
      counterAddress = transaction.from
    }
    const date = new Date(parseInt(transaction.timeStamp, 10) * 1000);
    // Hours part from the timestamp
    const month = "0" + date.getMonth();
    const day = "0" + date.getDate();
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();
    const formattedDate = date.getFullYear() + "." + month.substr(-2) + "." + day.substr(-2)
    const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    const amount = transaction.value / account.decimals
    let moneyStr
    const fraction = amount - Math.floor(amount)
    const strFraction = fraction.toFixed(5)
    if (fraction > 0) {
      moneyStr = convertToMoney(Math.floor(amount)) + strFraction.substr(1)
    } else {
      moneyStr = convertToMoney(amount)
    }

    const confirmations = parseInt(transaction.confirmations)
    if (confirmations > 0) {
      statusIcon = require('../../assets/images/icon_confirm.png')
    } else {
      statusIcon = require('../../assets/images/icon_pending.png')
    }
  /**
   {
  "blockHash": "0x99fa10ae0a464b8a0c1a7a3267da0a7afe914203baa15ecaa9937fbe08379f5e",
  "blockNumber": "9134239",
  "confirmations": "82603",
  "contractAddress": "",
  "cumulativeGasUsed": "27008",
  "from": "0x18effda3d2f0ef936dbbad3dc85daf2ba6540c81",
  "gas": "4004580",
  "gasPrice": "100000000000",
  "gasUsed": "27008",
  "hash": "0xd99d524a5c25d62feb9df87b699faaf894c578835b10f3303af1cb03fd2a60c3",
  "input": "0xfdacd5760000000000000000000000000000000000000000000000000000000000000002",
  "isError": "0",
  "nonce": "9",
  "timeStamp": "1540046912",
  "to": "0xe257ec05fcd6392d46e9361e8690bf30168a1f7b",
  "transactionIndex": "0",
  "txreceipt_status": "",
  "value": "0",
}


 {
  "blockHash": "0xde6251cb45e9338bf68403bcc1ad57b024dbb1c7bd395f59e47904c287604222",
  "blockNumber": "9136339",
  "confirmations": "80503",
  "contractAddress": "0xf337f6821b18b2eb24c44d74f3fa91128ead23f4",
  "cumulativeGasUsed": "72569",
  "from": "0x18effda3d2f0ef936dbbad3dc85daf2ba6540c81",
  "gas": "51569",
  "gasPrice": "1000000000",
  "gasUsed": "51569",
  "hash": "0x7ea614e05ec06ebe9f362fcbd6b53e5eb245921cf030c40d13a72d9f312cdb3d",
  "input": "0xa9059cbb0000000000000000000000006746e623921a635053fa0dbf4b323b0bf18f6dab0000000000000000000000000000000000000000000000000000000000000032",
  "nonce": "15",
  "timeStamp": "1540065884",
  "to": "0x6746e623921a635053fa0dbf4b323b0bf18f6dab",
  "tokenDecimal": "4",
  "tokenName": "Infleum",
  "tokenSymbol": "IFUM",
  "transactionIndex": "1",
  "value": "50",
}
   */

    return (
      <View style={{ width: '100%' }}>
        <TouchableOpacity onPress={ () => {
          // navigation.navigate('TransactionDetail', { wallet: wallet, account: account, _wallet: this.props._wallet })
        }}>
          <View style={{ height: 60, width: '100%', borderBottomColor: '#aaaaaa', borderBottomWidth: 1, flexDirection: "row"}}>
            <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ paddingLeft: 4, height: '100%', justifyContent: 'center' }}>
                <Image style={{ height: 30, width: 30}} source={ typeIcon } />
              </View>
            </View>
            <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center', paddingLeft: 0 }}>
              <Text numberOfLines={2} style={{ color: 'white', fontSize: 12 }}>{ counterAddress }</Text>
            </View>
            <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center', paddingLeft: 0 }}>
              <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'white', fontSize: 12 }}>{ formattedDate }</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'white', fontSize: 12 }}>{ formattedTime }</Text>
            </View>
            <View style={{ flex: 0.25, justifyContent: 'center', alignItems: 'center' }}>
              <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'white', fontSize: 14 }}>{ moneyStr }</Text>
              <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'white', fontSize: 14 }}>{ currencyTicker }</Text>
            </View>
            <View style={{ flex: 0.05, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ paddingRight: 4, height: '100%', width: '100%', justifyContent: 'center', alignItems: 'flex-end' }}>
                <Image style={{ height: 15, width: 15, alignItems: 'flex-end'}} source={ statusIcon } />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { transactions } = this.props

    if(transactions === undefined)
      return null

    return (
      <View style={{ width: '100%' }}>
        <View style={{ height: 40, width: '100%', borderBottomColor: '#aaaaaa', borderBottomWidth: 1, flexDirection: "row"}}>
          <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
          </View>
          <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center', paddingLeft: 0 }}>
            <Text numberOfLines={1} style={{ color: 'white', fontSize: 12 }}>Receiver / Sender</Text>
          </View>
          <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center', paddingLeft: 0, paddingRight: 0 }}>
            <Text numberOfLines={1} style={{ color: 'white', fontSize: 12 }}>Date / Time</Text>
          </View>
          <View style={{ flex: 0.25, justifyContent: 'center', alignItems: 'center', paddingLeft: 0, paddingRight: 0 }}>
            <Text numberOfLines={1} style={{ color: 'white', fontSize: 12 }}>Amount</Text>
          </View>
          <View style={{ flex: 0.05, justifyContent: 'center', alignItems: 'flex-end', paddingLeft: 0, paddingRight: 0 }}>
          </View>
        </View>
        <FlatList
          data={ _.values(transactions) }
          renderItem={ this.renderTransactionItem }
          contentContainerStyle={{ padding: 15 }}
          keyExtractor={( item, index ) => index.toString() }
        />
      </View>
    )
  }
}

TransactionList.propTypes = {
  transactions: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
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
