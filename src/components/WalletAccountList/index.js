import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import {Button} from "native-base";

class WalletAccountList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      lastWalletIndex: props.wallet ? ((Object.keys(props.wallet).length) - 1) : undefined,
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.wallet) {
      this.setState({
        lastWalletIndex: Object.keys(nextProps.wallet).length - 1,
      })
    }
  }

  onWalletClicked = (cardIndex) => {
  }

  renderAccountItem = (account) => {
    const { navigation } = this.props
    console.log(account)

    const {
      address,
      nonce,
    } = account.item


    return (
      <View style={ styles.walletContainer }>
        <TouchableOpacity onPress={ () => {
          navigation.navigate('AccountDetail', { address: address })
        }}>
          <Text style={{ fontWeight: 'bold', color: '#10b5bc' }}>{ nonce.toString() + ": " + address }</Text>
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
        data={ _.values(wallet) }
        renderItem={ this.renderAccountItem }
        contentContainerStyle={{ padding: 15 }}
        keyExtractor={( item, index ) => index.toString() }
      />
    )
  }
}

WalletAccountList.propTypes = {
  wallet: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
  navigation: PropTypes.object,
}

const styles = StyleSheet.create({
  walletContainer: {
    width: '100%',
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
