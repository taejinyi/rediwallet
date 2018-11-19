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

@translate(['wallet'], { wait: true, })
class WalletChangeCurrency extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: false,
      selectedCurrency: undefined
    }
    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })
  }

  async componentDidMount() {
    const { db } = this.props
  }

  renderCurrencyItem = (data) => {
    const { t, i18n, iWallet } = this.props
    const account = data.item
    let checked = false
    if (this.state.selectedCurrency && this.state.selectedCurrency.address === account.address) {
      checked = true
    }
    const decimals = Math.pow(10, account.decimals)
    const balance = numberToString(account.balance / decimals)
    return (


        <TouchableWithoutFeedback onPress={() => {
          this.setState({
            selected: true,
            selectedCurrency: account
          })
          console.log('selectedAccount in renderCurrencyItem', account)
        }}>
        <View style={{ height: 40, width: '100%', borderBottomWidth: 1, flexDirection: "row"}}>
          <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center', paddingLeft: 0 }}>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'black', fontSize: 16 }}>{ account.currency }</Text>
          </View>
          <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center', paddingLeft: 0, paddingRight: 0 }}>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'black', fontSize: 16 }}>{ balance }</Text>
          </View>
          <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center', paddingLeft: 0, paddingRight: 0 }}>
            <CheckBox color='#10b5bc' checked={ checked } />
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

  render() {
    const { t, i18n, iWallet } = this.props

    const { selected, selectedCurrency } = this.state

    return (
      <Container>
        <StyleProvider style={ getTheme(platform) }>
          <Header 
            iosBarStyle='light-content'
            style={{ backgroundColor: '#10b5bc'}}>
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
                { t('selectCurrency',{ lng: i18n.language })}
              </Title>
            </Body>
            <Right>
              {
                selected && (
                  <TouchableOpacity onPress={async () => {
                    const { iWallet } = this.props
                    iWallet.currency = selectedCurrency.currency
                    iWallet.currencyAddress = selectedCurrency.address
                    await this.props.saveWalletInstanceToDB(this.props.db, this.props.iWallet)
                    this.props.navigation.goBack(null)
                  }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>
                      { t('change',{ lng: i18n.language })}
                    </Text>
                  </TouchableOpacity>
                )
              }
            </Right>
          </Header>
        </StyleProvider>

        <View style={{ height: 40, width: '100%', borderBottomColor: '#10b5bc', backgroundColor: '#10b5bc', borderBottomWidth: 1, flexDirection: "row"}}>
          <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center', paddingLeft: 0 }}>
            <Text numberOfLines={1} style={{ color: '#666666', fontSize: 12 }}>Currency</Text>
          </View>
          <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center', paddingLeft: 0, paddingRight: 0 }}>
            <Text numberOfLines={1} style={{ color: '#666666', fontSize: 12 }}>Balance</Text>
          </View>
          <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'flex-end', paddingLeft: 0, paddingRight: 0 }}>
          </View>
        </View>

        <FlatList
          data={_.values(iWallet.accounts)}
          renderItem={ this.renderCurrencyItem }
          contentContainerStyle={{ padding: 10, paddingRight: 0, }}
          keyExtractor={( item, index ) => index.toString() }
          ItemSeparatorComponent={() => (
            <View style={{ marginBottom: 5, marginTop: 5, width: '100%', height: 1, backgroundColor: '#C7C7CC', }} />
          )}
        />
      </Container>
    )
  }
}

WalletChangeCurrency.propTypes = {
  db: PropTypes.object.isRequired,
  iWallet: PropTypes.object.isRequired,
}

export default WalletChangeCurrency
