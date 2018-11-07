import _ from 'lodash'
import React from 'react'
import { View, Text, TouchableWithoutFeedback, Clipboard } from 'react-native'
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { Button, Container, Content, Footer, FooterTab, Body, Left, List, ListItem, Icon, Separator, Right } from 'native-base'
import {actions} from "../index";
import connect from "react-redux/es/connect/connect";
import Modal from 'react-native-modal'
import { QRCode } from 'react-native-custom-qr-codes'
import {translate} from "react-i18next";
import Color from '../../constants/Colors'
import { TransactionList } from '../../components'
import {convertToMoney} from "../../utils";

@translate(['main'], { wait: true })
class WalletDetailPage extends React.Component {
  constructor(props) {
    super(props)

    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })

    this.state = {
      isLoading: true,
      isSendModalVisible: false,
      isReceiveModalVisible: false,
      targetAddress: undefined,
      amount: 0,
      currency: this.props.navigation.state.params.wallet.currency
    }
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

  async componentWillMount() {
    const { wallet, account } = this.props.navigation.state.params
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
    const { db } = this.props
    await this.props.getTransactionsFromDB(db, wallet, account)
  }
  async componentDidMount() {
    const { db, transactions } = this.props
    const { wallet, account } = this.props.navigation.state.params
    await this.props.getTransactionsFromServer(db, wallet, account)
    this._interval = setInterval( () => {
      this.refreshAccount()
    }, 30000);

  }

  async componentWillUnmount() {
    clearInterval(this._interval);
  }

  refreshAccount = () => {
    const { wallet, account, _wallet } = this.props.navigation.state.params
    this.props.getTransactionsFromServer(this.props.db, wallet, account)
  }


  render() {
    const { navigation, transactions } = this.props
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
                logoSize={ 40 }
                color='black'
                logo={ require('rediwallet/src/assets/images/logo_400x400.png') }
              />
              <Text style={{ color: '#555555', fontSize: 20, fontWeight: 'bold', }}>
                Show to receive
              </Text>
            </View>
          </View>
        </Modal>
        <Content style={{ width: '100%', height: '100%' }}>
          {
            transactions ? (
              <View style={{ width: '100%', height: '100%' }}>
                <TransactionList
                  wallet={ wallet }
                  account={ account }
                  transactions={ transactions }
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
  getTransactionsFromServer: (db, wallet, account) => dispatch(actions.getTransactionsFromServer(db, wallet, account)),
  getNextTransactionsFromServer: (db, wallet, account, offset, count) => dispatch(actions.getNextTransactionsOnlyState(db, wallet, account, offset, count)),
})

export default connect(null, mapDispatchToProps)(WalletDetailPage)
