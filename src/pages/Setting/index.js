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

class SettingPage extends React.Component {
  constructor(props) {
    super(props)

    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })
  }

  deleteMnemonic = async () => {
    await SecureStore.deleteItemAsync('mnemonic')
    await this.props.db.destroy()
    this.props.saveMnemonic(undefined)
    await Util.reload()
    const { dispatch } = this.props

    dispatch(NavigationActions.reset({
      index: 0,
      key: null,
      actions: [ NavigationActions.navigate({ routeName: 'Splash' }) ],
    }))

  }

  render() {
    const { navigation } = this.props

    return (
      <View style={{ flex: 1, }}>
        <View style={{ flex: 0.3, }}>
          <Header
            headerTitle='설정'
            renderContent={ false }
          />
        </View>
        <Content style={{ backgroundColor: 'white', }}>
          <ListItem icon last>
            <Left>
              <Icon style={{ color: '#666666', }} name='ios-megaphone' />
            </Left>
            <Body>
              <Text>공지사항</Text>
            </Body>
            <Right>
              <Icon name='arrow-forward' />
            </Right>
          </ListItem>
          <Separator />
          <ListItem
            onPress={ this.deleteMnemonic }
            button
            icon>
            <Left>
              <Icon name='ios-contact' style={{ color: '#666666', }} />
            </Left>
            <Body>
              <Text>Delete Mnemonic</Text>
            </Body>
            <Right>
              <Icon name='arrow-forward' />
            </Right>
          </ListItem>
        </Content>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  saveMnemonic: (mnemonic) => dispatch(actions.saveMnemonic(mnemonic)),
})

export default connect(null, mapDispatchToProps)(SettingPage)
