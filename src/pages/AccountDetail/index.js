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

class AccountDetailPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // transactions: undefined,
      // isLoading: false,
    }
  }


  componentWillMount() {
    // const { address } = this.props.navigation.state.params
    // const { db, mnemonic, getWalletDetail } = this.props
  }

  render() {
    const { navigation } = this.props
    const { address } = this.props.navigation.state.params
    return (
      <View style={{ flex: 1, }}>
        <View style={{ flex: 0.3, }}>
          <Header
            headerTitle='Wallet'
            renderContent={ false }
          />
        </View>
        <Content style={{ backgroundColor: 'white', }}>
          <Text>{address}</Text>
        </Content>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  // saveMnemonic: (mnemonic) => dispatch(actions.saveMnemonic(mnemonic)),
})

export default connect(null, mapDispatchToProps)(AccountDetailPage)
