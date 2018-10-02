import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { FlatList, Text, View, StyleSheet, VirtualizedList } from 'react-native'

class WalletsList extends React.Component {
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

  renderWalletItem = (wallet) => {
    const { navigation } = this.props

    const {
      slug,
      address,
      balance,
      ... rest,
    } = wallet.item


    return (
      <View style={ styles.walletContainer }>
        <Wallet
          isReal={ true }
          slug={ slug }
          address={ address }
          balance={ balance }

          navigation={ navigation }
          { ... rest }
        />
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
        renderItem={ this.renderWalletItem() }
        contentContainerStyle={{ padding: 15 }}
        keyExtractor={( item, index ) => index.toString() }
      />
    )
  }
}

WalletsList.propTypes = {
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

export default WalletsList
