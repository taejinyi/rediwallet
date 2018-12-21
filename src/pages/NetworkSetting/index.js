import _ from 'lodash'
import React from 'react'
import {View, Text, Alert, StatusBar, TouchableOpacity} from 'react-native'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { Container, Content, Body, Left, List, ListItem, Icon, Separator, Right } from 'native-base'
import { Updates, SecureStore } from 'expo'
import { Header } from 'rediwallet/src/components'
import {actions} from "../index";
import connect from "react-redux/es/connect/connect";
import { NavigationActions } from 'react-navigation'
import {translate} from "react-i18next";
import ethers from "ethers";
import {fromHexString, numberToString, toHexString} from "../../utils";
import {getMnemonic} from "../../system/Wallet";

@translate(['main'], { wait: true })
class NetworkSettingPage extends React.Component {
  constructor(props) {
    super(props)

    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })
  }

  changeNetwork = async () => {
    this.debounceNavigate('ChangeNetwork')
  }

  refreshWallet = async () => {
    try {
      //TODO: avoid refreshWallet when other stuff going on
      // if (this.props.navigation.state.routeName === "Wallet") {
        const { db, iWallet } = this.props
        await this.props.getWalletFromNetwork(iWallet)
      // }
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const { navigation, t, i18n, iWallet } = this.props
    const gasPrice = iWallet.gasPrice ? numberToString(iWallet.gasPrice / Math.pow(10, 9)) + " gwei " : t('loading', { locale: i18n.language })
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#303140',
      }}>
        {/*<StatusBar barStyle='light-content' />*/}
        <View style={{ paddingTop: 15, paddingLeft: 15, paddingRight: 15, flex: 0.1, width: "100%", justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', }}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack(null)}>
            <Feather name='x' style={{ fontSize: 32, color: 'white', }} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.2, }}>
          <Header
            headerTitle={t('network_setting', { locale: i18n.language })}
            renderContent={ false }
          />
        </View>
        <Content style={{ backgroundColor: 'white', }}>
          <ListItem
            onPress={ this.refreshWallet }
            button
            icon>
            <Left>
              <Icon style={{ color: '#666666', }} name='ios-megaphone' />
            </Left>
            <Body>
              <Text>{t('refreshWallet', { locale: i18n.language })}</Text>
            </Body>
            <Right>
              <Icon name='arrow-forward' />
            </Right>
          </ListItem>
          <ListItem
            onPress={ this.changeNetwork }
            button
            icon>
            <Left>
              <Icon style={{ color: '#666666', }} name='ios-megaphone' />
            </Left>
            <Body>
              <Text>{t('network', { locale: i18n.language })}</Text>
            </Body>
            <Right>
              <Text>{t(iWallet.rpc.name, { locale: i18n.language })}</Text>
              <Icon name='arrow-forward' />
            </Right>
          </ListItem>
          <ListItem icon last>
            <Left>
              <Icon style={{ color: '#666666', }} name='ios-megaphone' />
            </Left>
            <Body>
              <Text>{t('gas_price', { locale: i18n.language })}</Text>
            </Body>
            <Right>
              <Text>{gasPrice}</Text>
            </Right>
          </ListItem>
        </Content>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(null, mapDispatchToProps)(NetworkSettingPage)
