import _ from 'lodash'
import React from 'react'
import { View, Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Container, Content, Body, Left, List, ListItem, Icon, Separator, Right } from 'native-base'
import { Updates, SecureStore } from 'expo'
import { Header } from 'rediwallet/src/components'
import {actions} from "../index";
import connect from "react-redux/es/connect/connect";
import { NavigationActions } from 'react-navigation'
import {translate} from "react-i18next";
import ethers from "ethers";
import {fromHexString, toHexString} from "../../utils";

@translate(['main'], { wait: true })
class SettingPage extends React.Component {
  constructor(props) {
    super(props)

    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })
  }

  deleteMnemonic = async () => {
    await SecureStore.deleteItemAsync('seed')
    await SecureStore.deleteItemAsync('nonce')
    await this.props.db.destroy()
    await Updates.reload()
    const { dispatch } = this.props

    dispatch(NavigationActions.reset({
      index: 0,
      key: null,
      actions: [ NavigationActions.navigate({ routeName: 'Splash' }) ],
    }))

  }
  backupMnemonic = async () => {
    const hex = await SecureStore.getItemAsync('seed')
    const seed = fromHexString(hex)
    const mnemonic = await ethers.HDNode.entropyToMnemonic(seed)
    this.debounceNavigate('MnemonicBackup', {mnemonic: mnemonic})
  }

  changeCurrency = async () => {
    this.debounceNavigate('WalletChangeCurrency')
  }

  render() {
    const { navigation, t, i18n } = this.props

    return (
      <View style={{ flex: 1, }}>
        <View style={{ flex: 0.3, }}>
          <Header
            headerTitle={t('setting', { locale: i18n.language })}
            renderContent={ false }
          />
        </View>
        <Content style={{ backgroundColor: 'white', }}>
          <ListItem icon last>
            <Left>
              <Icon style={{ color: '#666666', }} name='ios-megaphone' />
            </Left>
            <Body>
              <Text>{t('notice', { locale: i18n.language })}</Text>
            </Body>
            <Right>
              <Icon name='arrow-forward' />
            </Right>
          </ListItem>
          <Separator />
          <ListItem
            onPress={ this.changeCurrency }
            button
            icon>
            <Left>
              <Icon name='ios-contact' style={{ color: '#666666', }} />
            </Left>
            <Body>
              <Text>{t('change_currency', { locale: i18n.language })}</Text>
            </Body>
            <Right>
              <Icon name='arrow-forward' />
            </Right>
          </ListItem>
          <ListItem
            onPress={ this.backupMnemonic }
            button
            icon>
            <Left>
              <Icon name='ios-contact' style={{ color: '#666666', }} />
            </Left>
            <Body>
              <Text>{t('backup_mnemonic', { locale: i18n.language })}</Text>
            </Body>
            <Right>
              <Icon name='arrow-forward' />
            </Right>
          </ListItem>
          <ListItem
            onPress={ this.deleteMnemonic }
            button
            icon>
            <Left>
              <Icon name='ios-contact' style={{ color: '#666666', }} />
            </Left>
            <Body>
              <Text>{t('delete_mnemonic', { locale: i18n.language })}</Text>
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
})

export default connect(null, mapDispatchToProps)(SettingPage)
