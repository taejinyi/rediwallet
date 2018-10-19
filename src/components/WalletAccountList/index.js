import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { FlatList, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import {Button} from "native-base";
import { send } from '../../network/web3'
import SimpleStorageContract from '../../network/web3/simpleStorageContract'

class WalletAccountList extends React.Component {
  constructor(props) {
    super(props)
    this.contract = new SimpleStorageContract()
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
  async componentDidMount() {
    await this.contract.start(this.props.wallets['0x7E6c154e8A292046dB86ed162761E5d28F7673da'])
  }
  onWalletClicked = (cardIndex) => {
  }

  renderAccountItem = (wallet) => {
    const { navigation } = this.props

    const walletData = wallet.item

    return (
      <View style={ styles.walletContainer }>
        <TouchableOpacity onPress={ async () => {
          // navigation.navigate('WalletDetail', { wallet: walletData })
          this.contract.send(wallet.item, "0x922EAdCEBf7B0318eC80cd0c51Ef2EF6652b2beA",1)
          // await send(wallet.item,"0x922EAdCEBf7B0318eC80cd0c51Ef2EF6652b2beA",1)
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
