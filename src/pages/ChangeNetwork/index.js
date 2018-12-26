import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Ionicons } from '@expo/vector-icons'
import { NavigationActions } from 'react-navigation'
import { RippleLoader } from 'react-native-indicator'
import { Body, Container, Left, Title, Right, StyleProvider, Header, CheckBox } from 'native-base'
import { FlatList, Animated, TouchableWithoutFeedback, TouchableOpacity, View, ScrollView, Text } from 'react-native'

import platform from '../../native-base-theme/variables/platform'
import getTheme from '../../native-base-theme/components'

import {translate} from "react-i18next";
import {numberToString} from "../../utils/crypto";

@translate(['main'], { wait: true, })
class ChangeNetworkPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedNetwork: props.iWallet.rpc
    }
    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })
  }

  async componentDidMount() {
    const { db } = this.props
  }

  renderNetworkItem = (data) => {
    const { t, i18n, iWallet } = this.props
    const rpc = data.item
    let checked = false
    if (this.state.selectedNetwork && this.state.selectedNetwork.name === rpc.name) {
      checked = true
    }
    return (
        <TouchableWithoutFeedback onPress={() => {
          this.setState({
            selectedNetwork: rpc
          })
        }}>
        <View style={{ height: 40, width: '100%', flexDirection: "row"}}>
          <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center', paddingLeft: 0 }}>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'black', fontSize: 16 }}>{ rpc.name }</Text>
          </View>
          <View style={{ flex: 0.6, justifyContent: 'center', alignItems: 'center', paddingLeft: 0, paddingRight: 0 }}>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'black', fontSize: 16 }}>{ rpc.url }</Text>
          </View>
          <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center', paddingLeft: 0, paddingRight: 0 }}>
            <CheckBox disabled={true} color='#303140' checked={ checked } />
          </View>
        </View>
      </TouchableWithoutFeedback>

      // <TouchableOpacity onPress={() => {
      // }}>
      //   <Text style={{ color: 'white', fontSize: 16 }}>
      //     { t('change',{ lng: i18n.language })}
      //   </Text>
      // </TouchableOpacity>
    )
  }
  changeNetwork = async () => {
    const { t, i18n, iWallet, db, showProcessingModal, hideProcessingModal } = this.props
    await showProcessingModal(t('changingNetwork',{ lng: i18n.language }))
    iWallet.rpc = this.state.selectedNetwork
    await iWallet.reload()
    await iWallet.fetchWalletFromNetwork()
    await this.props.saveWalletInstanceToDB(this.props.db, this.props.iWallet)
    await hideProcessingModal()
    this.props.navigation.goBack(null)
  }
  render() {
    const { t, i18n, iWallet } = this.props

    const { selectedNetwork } = this.state

    return (
      <Container>
        <StyleProvider style={ getTheme(platform) }>
          <Header 
            iosBarStyle='light-content'
            style={{ backgroundColor: '#303140'}}>
            <Left>
              <TouchableOpacity onPress={() => {
                const { navigation } = this.props
                navigation.dispatch(NavigationActions.back())
              }}>
                <Text style={{ color: 'white', fontSize: 16 }}>
                  { t('cancel',{ lng: i18n.language })}
                </Text>
              </TouchableOpacity>
            </Left>
            <Body style={{ justifyContent: 'center', flexDirection: 'row' }}>
              <Title style={{ color: 'white', }}>
                { t('selectNetwork',{ lng: i18n.language })}
              </Title>
            </Body>
            <Right>
              {
                selectedNetwork.name !== iWallet.rpc.name && (
                  <TouchableOpacity onPress={async () => this.changeNetwork()}>
                    <Text style={{ color: 'white', fontSize: 16 }}>
                      { t('change',{ lng: i18n.language })}
                    </Text>
                  </TouchableOpacity>
                )
              }
            </Right>
          </Header>
        </StyleProvider>

        <View style={{ height: 40, width: '100%', borderBottomColor: '#303140', backgroundColor: '#303140', borderBottomWidth: 1, flexDirection: "row"}}>
          <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center', paddingLeft: 0 }}>
            <Text numberOfLines={1} style={{ color: '#C7C7CC', fontSize: 12 }}>{ t('network',{ lng: i18n.language })}</Text>
          </View>
          <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center', paddingLeft: 0, paddingRight: 0 }}>
            <Text numberOfLines={1} style={{ color: '#C7C7CC', fontSize: 12 }}>{ t('rpcUrl',{ lng: i18n.language })}</Text>
          </View>
          <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'flex-end', paddingLeft: 0, paddingRight: 0 }}>
          </View>
        </View>

        <FlatList
          data={_.values(iWallet.rpcList)}
          renderItem={ this.renderNetworkItem }
          contentContainerStyle={{ padding: 10, paddingRight: 0, }}
          keyExtractor={( item, index ) => index.toString() }
          ItemSeparatorComponent={() => (
            <View style={{ marginBottom: 5, marginTop: 5, width: '100%', height: 1, backgroundColor: '#303140', }} />
          )}
        />
      </Container>
    )
  }
}

ChangeNetworkPage.propTypes = {
  db: PropTypes.object.isRequired,
  iWallet: PropTypes.object.isRequired,
}

export default ChangeNetworkPage
