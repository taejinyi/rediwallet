import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import {Button} from "native-base";

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

  renderAccountItem = (wallet) => {
    const { navigation } = this.props

    const walletData = wallet.item

    return (
      <View style={ styles.walletContainer }>
        <TouchableOpacity onPress={ () => {
          navigation.navigate('WalletDetail', { wallet: wallet })
        }}>
          <Text style={{ fontWeight: 'bold', color: '#10b5bc' }}>{ walletData.nonce.toString() + ": " + walletData.address }</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { wallets, } = this.props

    if(wallets === null)
      return null

    return (
      <FlatList
        data={ _.values(wallets) }
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
