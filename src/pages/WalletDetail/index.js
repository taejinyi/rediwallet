import _ from 'lodash'
import React from 'react'
import { View, Text, TouchableWithoutFeedback, Clipboard } from 'react-native'
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { Button, Container, Content, Footer, FooterTab, Body, Left, List, ListItem, Icon, Separator, Right } from 'native-base'
import { Util, SecureStore } from 'expo'
import { Header } from 'rediwallet/src/components'
import {actions} from "../index";
import connect from "react-redux/es/connect/connect";
import Modal from 'react-native-modal'
import { QRCode } from 'react-native-custom-qr-codes'
import {translate} from "react-i18next";
import Color from '../../constants/Colors'
import { TransactionList } from '../../components'

import { NavigationActions } from 'react-navigation'
import {convertToMoney} from "../../utils";

@translate(['main'], { wait: true })
class WalletDetailPage extends React.Component {
  constructor(props) {
    super(props)

    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })

    this.state = {
      transactions: undefined,
      isLoading: true,
      isSendModalVisible: false,
      isReceiveModalVisible: false,
      targetAddress: undefined,
      amount: 0,
      currency: this.props.navigation.state.params.wallet.currency
    }
  }

  renderQRCodeModalContent = () => {
    const {t, i18n} = this.props
    return (
      <View style={{ backgroundColor: 'white', flex: 0.25, }}>
        <TouchableWithoutFeedback onPress={() => {
          this.setState({
            isQRCodeModalShow: false
          }, () => {
            setTimeout(() => this.debounceNavigate('QRCodeScan'), 400)
          })
        }}>
          <View style={{ flexDirection: 'row', flex: 0.325, padding: 20, alignItems: 'center', }}>
            <Icon name='ios-camera' style={{ color: '#666666', }} />
            <Text style={{ color: '#666666', marginLeft: 8, }}>
              { t('scanQRCode', { lng: i18n.language }) }
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => {
          this.setState({
            isQRCodeModalShow: false,
          }, () => {
            setTimeout(() => {
              this.setState({
                isQRCodeShow: true,
              })
            }, 500)
          })
        }}>
          <View style={{ flexDirection: 'row', flex: 0.325, padding: 20, alignItems: 'center', }}>
            <FontAwesome name='qrcode' style={{ fontSize: 27, color: '#666666', }} />
            <Text style={{ color: '#666666', marginLeft: 10, }}>
              { t('myQRCode', { lng: i18n.language }) }
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => this.setState({ isQRCodeModalShow: false, })}>
          <View style={{ flex: 0.35, padding: 10, borderTopWidth: 1, borderColor: '#eaeaea', justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#666666', }}>
              { t('cancel', { lng: i18n.language }) }
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  showSendPage = () => {
    const account = this.props.navigation.state.params.account
	  const wallet = this.props.navigation.state.params.wallet
	  const _wallet = this.props.navigation.state.params._wallet

    this.debounceNavigate('Send', {
      wallet: wallet,
      account: account,
      _wallet: _wallet
    })
  }
  showReceiveModal = () => {
    this.setState({
      isReceiveModalVisible: true
    })
  }
  copyAddressToClipboard = () => {
    Clipboard.setString(this.props.navigation.state.params.wallet.address)
  }

  getTransactionsFromNetwork = async () => {
    await this.props.navigation.state.params._wallet.getTransactionsFromNetwork(this.props.navigation.state.params.account)


  }


  async componentWillMount() {
    const currency = this.props.navigation.state.params.account.currency
    let currencyIcon, currencyName, headerBackgroundColor, headerTitle
    if (currency) {
      if (currency === "ETH") {
        headerBackgroundColor = Color.ethereumColor
        currencyIcon = "ETH"
        currencyName = "Ethereum"
      } else if (currency === "IFUM") {
        headerBackgroundColor = Color.infleumColor
        currencyIcon = "IFUM"
        currencyName = "Infleum"
      } else if (currency === "KRWT") {
        headerBackgroundColor = Color.krwtColor
        currencyIcon = "￦"
        currencyName = "KRW Tether"
      } else {
        headerBackgroundColor = Color.backgroundColor
        currencyIcon = "?"
        currencyName = "Unknown"
      }
    } else {
      headerBackgroundColor = Color.backgroundColor
      headerTitle = "Loading..."
    }
    this.props.navigation.setParams({
      'headerBackgroundColor': headerBackgroundColor,
      'headerTitle': currencyName
    })
    this.headerBackgroundColor = headerBackgroundColor
    // await this.props.getTransactionsFromDB(db, this.props.navigation.state.params.wallet, this.props.navigation.state.params.account)
    await this.getTransactionsFromNetwork()
  }


  render() {

    const { navigation } = this.props
    const { wallet, account, _wallet } = this.props.navigation.state.params
    const { targetAddress, amount, currency } = this.state
    let accountColor, currencyIcon, currencyName, currencyTicker, fxRate

    if (account.currency === "ETH") {
      accountColor = Color.ethereumColor
      currencyIcon = "￦"
      currencyTicker = "ETH"
      currencyName = "Ethereum"
      fxRate = 230500
    } else if (account.currency === "IFUM") {
      accountColor = Color.infleumColor
      currencyIcon = "￦"
      currencyTicker = "IFUM"
      currencyName = "Infleum"
      fxRate = 22
    } else if (account.currency === "KRWT") {
      accountColor = Color.krwtColor
      currencyIcon = "￦"
      currencyTicker = "KRWT"
      currencyName = "KRW Tether"
      fxRate = 1
    } else {
      currencyIcon = "?"
      currencyTicker = "???"
      currencyName = "Unknown"
      accountColor = "#999999"
      fxRate = 1
    }

    let moneyStr
    const fraction = (account.balance - Math.floor(account.balance))
    const strFraction = fraction.toFixed(8)
    if (fraction > 0) {
      moneyStr = convertToMoney(Math.floor(account.balance)) + strFraction.substr(1)
    } else {
      moneyStr = convertToMoney(account.balance)
    }
    return (
      <View style={{ flex: 1, backgroundColor: '#303140', alignItems: 'center'}}>
        <View style={{ height: 140, width:'100%', backgroundColor: this.headerBackgroundColor, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{ width:'90%', justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderColor: '#aaaaaa' }}>
            <Button
              onPress={this.copyAddressToClipboard}
              transparent
              style={{ width:'100%', justifyContent: 'center', alignItems: 'center', marginTop:0, marginBottom: 0}}
            >
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 12 }}>{ wallet.address }</Text>
            </Button>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'white', fontSize: 14, marginTop: 0 }}>{ currencyIcon + convertToMoney(fxRate) + " per " + currencyTicker }</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'white', fontSize: 18, marginTop: 10 }}>{ currencyTicker + " " + moneyStr }</Text>
            <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 28 }}>{ " ~ " + currencyIcon + convertToMoney(Math.floor(account.balance * fxRate)) }</Text>
          </View>
        </View>
        <Modal
          hideModalContentWhileAnimating={ true }
          useNativeDriver={ true }
          isVisible={ this.state.isSendModalVisible }>
          <View style={{ borderRadius: 8, flex: 0.5, backgroundColor: 'white', }}>
            <TouchableWithoutFeedback onPress={() => this.setState({ isSendModalVisible: false, })}>
              <View>
                <Text style={{ color: '#555555', fontSize: 20, fontWeight: 'bold', }}>X</Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={{ marginTop: 35, justifyContent: 'center', alignItems: 'center', }}>
              <Button
                style={{ marginTop: 200 }}
                onPress={this.scanQRCode}
                transparent>
                <Text style={{ fontWeight: 'bold', color: '#303140' }}>Scan QRCode</Text>
              </Button>
              <Text style={{ color: '#555555', fontSize: 20, fontWeight: 'bold', }}>
                Show to receive
              </Text>
              <Text style={{ color: '#555555', fontSize: 20, fontWeight: 'bold', }}>
                Target: {targetAddress}
                Amount: {amount}
                Currency: {currency}
              </Text>
            </View>
          </View>
        </Modal>
        <Modal
          hideModalContentWhileAnimating={ true }
          useNativeDriver={ true }
          isVisible={ this.state.isReceiveModalVisible }>
          <View style={{ borderRadius: 8, flex: 0.5, backgroundColor: 'white', }}>
            <TouchableWithoutFeedback onPress={() => this.setState({ isReceiveModalVisible: false, })}>
              <View>
                <Text style={{ color: '#555555', fontSize: 20, fontWeight: 'bold', }}>X</Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={{ marginTop: 35, justifyContent: 'center', alignItems: 'center', }}>
              <QRCode
                size={ 240 }
                content={ wallet.address }
                logoSize={ 32 }
                color='black'
                logo={ require('rediwallet/src/assets/images/logo_428x222.png') }
              />
              <Text style={{ color: '#555555', fontSize: 20, fontWeight: 'bold', }}>
                Show to receive
              </Text>
            </View>
          </View>
        </Modal>
        <Content style={{  }}>
          {
            account.transactions ? (
              <View style={ styles.WalletAccountListContainer }>
                <Text>Transactions of {wallet.address}</Text>
                <Text>Scanned Address : {targetAddress}</Text>
                <Text>Sent</Text>

                <TransactionList
                  wallet={ wallet }
                  account={ account }
                  _wallet={ _wallet}
                  navigation={ navigation }
                />
              </View>
            ) : (
              <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
                <MaterialCommunityIcons name='close-circle-outline' style={{ fontSize: 84, color: '#aaaaaa', }} />
                <Text style={{ fontSize: 18, marginTop: 10, color: '#aaaaaa', }}>
                  No transaction yet...
                </Text>
              </View>
            )
          }

        </Content>
        <Footer>
          <FooterTab>
            <Button
              style={{  }}
              onPress={this.showSendPage}
              transparent>
              <Text style={{ fontWeight: 'bold', color: '#303140' }}>Send</Text>
            </Button>
            <Button
              style={{  }}
              onPress={this.showReceiveModal}
              transparent>
              <Text style={{ fontWeight: 'bold', color: '#303140' }}>Receive</Text>
            </Button>
          </FooterTab>
        </Footer>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  getTransactionsFromDB: (db, wallet, account) => dispatch(actions.getTransactionsFromDB(db, wallet, account)),
  getTransactionsFromNetwork: (db, wallet, account) => dispatch(actions.getTransactionsFromNetwork(db, wallet, account)),
})

export default connect(null, mapDispatchToProps)(WalletDetailPage)
