import _ from 'lodash'
import React from 'react'
import {View, Text, TouchableWithoutFeedback, Clipboard, TouchableOpacity} from 'react-native'
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import {
  Button,
  Container,
  Content,
  Footer,
  FooterTab,
  Body,
  Left,
  List,
  ListItem,
  Icon,
  Separator,
  Right,
  StyleProvider, Header, Title
} from 'native-base'
import {actions} from "../index";
import connect from "react-redux/es/connect/connect";
import Modal from 'react-native-modal'
import { QRCode } from 'react-native-custom-qr-codes'
import {translate} from "react-i18next";
import Color from '../../constants/Colors'
import { TransactionList } from '../../components'
import {getHeaderBackgroundColor, getHeaderTitle, numberToString} from "../../utils/crypto";
import {PAGE_STATE, SAVE_PAGE_STATE} from "./actions";
import getTheme from "../../native-base-theme/components";
import platform from "../../native-base-theme/variables/platform";
import {HeaderBackButton, NavigationActions} from "react-navigation";
import i18n from "../../utils/i18n";

@translate(['main'], { wait: true })
class WalletDetailPage extends React.Component {
  constructor(props) {
    super(props)

    this.debounceNavigate = _.debounce(props.navigation.navigate, 1000, { leading: true, trailing: false, })

    this.state = {
      isSendModalVisible: false,
      isReceiveModalVisible: false,
      targetAddress: undefined,
      currentPage: 1,
      amount: 0,
      transactions: _.values(props.transactions).sort(this._compare),
      currency: this.props.navigation.state.params.account.currency
    }
    this.offset = 50

  }

  componentWillReceiveProps(nextProps) {
    const { db, iWallet, pageState, transactions, endReached, recentNotUpdated, refreshing } = nextProps
    const { account } = this.props.navigation.state.params
    // console.log('componentWillReceiveProps', pageState, refreshing, endReached, recentNotUpdated)
    switch(pageState) {
      case PAGE_STATE.STATE_LOADING_FINISH:
        if (refreshing) {
          this.props.savePageState(PAGE_STATE.STATE_LOADING)
          this.props.getTransactionsFromNetwork(iWallet, account, 1, this.offset)
          this.props.saveRefreshing(false)

        } else if (endReached || recentNotUpdated) {
          this.props.savePageState(PAGE_STATE.STATE_LOADING)
          const nextPage = this.state.currentPage + 1
          this.props.getTransactionsFromNetwork(iWallet, account, nextPage, this.offset)
          this.setState({
            currentPage: nextPage
          })
          if (endReached) {
            this.props.saveEndReached(false)
          }
          if (recentNotUpdated) {
            this.props.saveRecentNotUpdated(false)
          }
        }
        break
      case PAGE_STATE.STATE_LOADING_FAILED:
        this.props.savePageState(PAGE_STATE.STATE_LOADING)
        this.props.getTransactionsFromNetwork(iWallet, account, this.state.currentPage, this.offset)
        break
      case PAGE_STATE.STATE_LOADING_COMPLETE:
        if (refreshing) {
          this.props.savePageState(PAGE_STATE.STATE_LOADING)
          this.props.getTransactionsFromNetwork(iWallet, account, 1, this.offset)
          this.props.saveRefreshing(false)
        }
    }
    if(transactions) {
      const txs = _.values(transactions).sort(this._compare)
      this.setState({
        transactions: txs,
        totalTransactions: txs.length
      })
    }
  }

  showSendPage = () => {
    const account = this.props.navigation.state.params.account

    this.debounceNavigate('Send', {
      account: account,
    })
  }
  showReceiveModal = () => {
    this.setState({
      isReceiveModalVisible: true
    })
  }
  copyAddressToClipboard = () => {
    Clipboard.setString(this.props.wallet.address)
  }

  async componentWillMount() {
    const { account } = this.props.navigation.state.params
    const { db, wallet } = this.props.wallet
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
  }

  async componentDidMount() {
      const { db, iWallet } = this.props
      const { account } = this.props.navigation.state.params
    await this.props.getTransactionsFromDB(db, iWallet.rpc.name, account.address)
    this.props.getTransactionsFromNetwork(iWallet, account, 1, this.offset)
  }

  onEndReached = () => {
    if (!this.props.endReached) {
      this.props.saveEndReached(true)
    }
  }

  onRefresh = () => {
    if (!this.props.refreshing) {
      this.props.saveRefreshing(true)
    }
  }

  exit = async () => {
    const { navigation } = this.props
    navigation.dispatch(NavigationActions.back())

    const { t, i18n, iWallet, transactions, db, showProcessingModal, hideProcessingModal } = this.props
    await showProcessingModal(t('savingTransactions',{ lng: i18n.language }))
    const token = this.props.navigation.state.params.account.address
    const network = iWallet.rpc.name
    await this.props.saveTransactionsToDB(db, network, token, transactions)
    await this.props.saveTransactions(undefined)
    setTimeout(async () =>{
      await hideProcessingModal()
      await this.props.navigation.goBack(null)
    }, 1000)


  }

  render() {
    const { navigation, db, wallet, iWallet, t, i18n } = this.props
    const { transactions, totalTransactions } = this.state
    const { account } = this.props.navigation.state.params
    let accountColor, currencyIcon, currencyName, currencyTicker, fxRate

    currencyIcon = iWallet.currency
    if (currencyIcon === "KRWT") {
      currencyIcon = "￦"
    }
    try {
      fxRate = iWallet.fx[account.currency][iWallet.currency]
    } catch(e) {
      fxRate = 1
    }

    if (wallet){
      if (wallet.currency === "ETH") {
        currencyName = "Ethereum"
      } else if (wallet.currency === "IFUM") {
        currencyName = "Infleum"
      } else if (wallet.currency === "KRWT") {
        currencyName = "KRW Tether"
      } else {
        currencyName = "Unknown"
      }
    }
    currencyTicker = account.currency

    if (account.currency === "ETH") {
      accountColor = Color.ethereumColor
      currencyName = "Ethereum"
    } else if (account.currency === "IFUM") {
      accountColor = Color.infleumColor
      currencyName = "Infleum"
    } else if (account.currency === "KRWT") {
      accountColor = Color.krwtColor
      currencyName = "KRW Tether"
    } else {
      currencyName = "Unknown"
      accountColor = "#999999"
    }

    const balance = account.balance / Math.pow(10, account.decimals)

    let moneyStr = numberToString(balance)
    //      <View style={{ flex: 1, backgroundColor: '#303140', alignItems: 'center'}}
    const backgroundColor = navigation.state.params ? getHeaderBackgroundColor(navigation.state.params.account) : "#303140"
    const headerTitle = navigation.state.params ? getHeaderTitle(navigation.state.params.account) : "Unknown"

    return (
      <Container style={{backgroundColor: "#303140"}}>
        <StyleProvider style={ getTheme(platform) }>
          <Header
            iosBarStyle='light-content'
            style={{ backgroundColor: backgroundColor}}>
            <Left>
              <TouchableOpacity onPress={ async () => {
                await this.exit()
              }}>
                <Text style={{ color: 'white', fontSize: 16 }}>
                  { t('wallet',{ lng: i18n.language })}
                </Text>
              </TouchableOpacity>
            </Left>
            <Body style={{ justifyContent: 'center', flexDirection: 'row' }}>
              <Title style={{ color: 'white', }}>
                { headerTitle }
              </Title>
            </Body>
            <Right style={{ justifyContent: 'center', flexDirection: 'row' }}>
            </Right>
          </Header>
        </StyleProvider>
        <View style={{ flex:0.25, width:'100%', backgroundColor: this.headerBackgroundColor, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{ width:'90%', justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderColor: '#aaaaaa' }}>
            <Button
              onPress={this.copyAddressToClipboard}
              transparent
              style={{ width:'100%', justifyContent: 'center', alignItems: 'center', marginTop:0, marginBottom: 0}}
            >
              <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ textAlign: 'center', color: 'white', fontSize: 12 }}>{ wallet.address }</Text>
            </Button>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'white', fontSize: 14, marginTop: 0 }}>{ currencyIcon + " " + numberToString(fxRate) + " per " + currencyTicker }</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ color: 'white', fontSize: 18, marginTop: 10 }}>{ currencyTicker + " " + moneyStr }</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ fontWeight: 'bold', color: 'white', fontSize: 28 }}>{ " ~ " + currencyIcon + " " + numberToString(balance * fxRate) }</Text>
          </View>
        </View>
        <Modal
          hideModalContentWhileAnimating={ true }
          useNativeDriver={ true }
          isVisible={ this.state.isReceiveModalVisible }>
          <View style={{ borderRadius: 15, flex: 0.69, backgroundColor: 'white', }}>
            <TouchableWithoutFeedback onPress={() => this.setState({ isReceiveModalVisible: false, })}>
              <View style={{ padding:20 }}>
                <Text style={{ color: '#303140', fontSize: 20, fontWeight: 'bold', }}>X</Text>
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
              <Text style={{ color: '#303140', fontSize: 20, fontWeight: 'bold', }}>
                { t('showToReceive', { locale: i18n.language }) }
              </Text>
              <Button
                onPress={this.copyAddressToClipboard}
                transparent
                style={{ width:'100%', justifyContent: 'center', alignItems: 'center', marginTop:0, marginBottom: 0}}
              >
                <Text numberOfLines={1} adjustsFontSizeToFit={true} style={{ textAlign: 'center', color: '#303140', fontSize: 12 }}>{ wallet.address }</Text>
              </Button>
            </View>
          </View>
        </Modal>
        <View style={{ width: '100%', flex:0.75, paddingBottom: 40 }}>
          {
            transactions ? (
              <View style={{ width: '100%', height: '100%' }}>
                <View style={{ width: '100%' }}>
                  <View style={{ height: 40, width: '100%', borderBottomColor: '#aaaaaa', borderBottomWidth: 1, flexDirection: "row"}}>
                    <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                      <Text numberOfLines={1} style={{ color: 'white', fontSize: 12 }}>{ totalTransactions }</Text>
                    </View>
                    <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center', paddingLeft: 0 }}>
                      <Text numberOfLines={1} style={{ color: 'white', fontSize: 12 }}>{ t('receiver', { locale: i18n.language }) } / { t('sender', { locale: i18n.language }) }</Text>
                    </View>
                    <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center', paddingLeft: 0, paddingRight: 0 }}>
                      <Text numberOfLines={1} style={{ color: 'white', fontSize: 12 }}>{ t('date', { locale: i18n.language }) } / { t('time', { locale: i18n.language }) }</Text>
                    </View>
                    <View style={{ flex: 0.25, justifyContent: 'center', alignItems: 'center', paddingLeft: 0, paddingRight: 0 }}>
                      <Text numberOfLines={1} style={{ color: 'white', fontSize: 12 }}>{ t('amount', { locale: i18n.language }) }</Text>
                    </View>
                    <View style={{ flex: 0.05, justifyContent: 'center', alignItems: 'flex-end', paddingLeft: 0, paddingRight: 0 }}>
                    </View>
                  </View>
                  <TransactionList
                    wallet={ wallet }
                    account={ account }
                    transactions={ transactions }
                    iWallet={ iWallet}
                    navigation={ navigation }
                    onEndReached={ this.onEndReached }
                    onRefresh={ this.onRefresh }
                    refreshing={ this.props.refreshing }
                  />
                </View>
              </View>
            ) : (
              <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 50 }}>
                <MaterialCommunityIcons name='close-circle-outline' style={{ fontSize: 84, color: '#aaaaaa', }} />
                <Text style={{ fontSize: 18, marginTop: 10, color: '#aaaaaa', }}>
                  { t('noTransactionYet', { locale: i18n.language }) }
                </Text>
              </View>
            )
          }
        </View>
        <Footer>
          <FooterTab>
            <Button
              style={{  }}
              onPress={this.showSendPage}
              transparent>
              <Text style={{ fontWeight: 'bold', color: '#303140' }}>
                { t('send', { locale: i18n.language }) }
              </Text>
            </Button>
            <Button
              style={{  }}
              onPress={this.showReceiveModal}
              transparent>
              <Text style={{ fontWeight: 'bold', color: '#303140' }}>
                { t('receive', { locale: i18n.language }) }
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    )
  }
}

export default WalletDetailPage
