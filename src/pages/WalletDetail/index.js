import _ from 'lodash'
import React from 'react'
import { View, Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Container, Content, Body, Left, List, ListItem, Icon, Separator, Right } from 'native-base'
import { Util, SecureStore } from 'expo'
import { Header } from 'rediwallet/src/components'
import {actions} from "../index";
import connect from "react-redux/es/connect/connect";
import { NavigationActions } from 'react-navigation'

class WalletDetailPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      transactions: undefined,
      isLoading: true,
    }
  }


  componentWillMount() {
    // console.log(infleumContract.abi)
    // const { address } = this.props.navigation.state.params
    // const { db, SAVE_SEED, getWalletDetail } = this.props

  }

  render() {

    const { navigation } = this.props
    const { account } = this.props.navigation.state.params
    console.log("WalletDetailPage")
    console.log(account)

    return (
      <View style={{ flex: 1, }}>
        <View style={{ flex: 0.3, }}>
          <Header
            headerTitle='Wallet'
            renderContent={ false }
          />
        </View>
        <Content style={{ backgroundColor: 'white', }}>
          <Text>Transactions of {account.address}</Text>
          <Text>Received</Text>
          <Text>Sent</Text>
        </Content>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  // saveSeed: (seed) => dispatch(actions.saveSeed(seed)),
})

export default connect(null, mapDispatchToProps)(WalletDetailPage)
