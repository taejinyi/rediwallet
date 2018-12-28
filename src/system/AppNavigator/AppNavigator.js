import React from 'react'
import { Image, Text, TouchableOpacity } from 'react-native'
import { NavigationComponent } from 'react-native-material-bottom-navigation'
import { NavigationActions, HeaderBackButton, StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import { getHeaderBackgroundColor, getHeaderTitle } from "../../utils/crypto";
import { MaterialCommunityIcons} from '@expo/vector-icons'

import {
  SplashPage,
  LandingPage,
  PrivateKeyBackupPage,
  MnemonicBackupPage,
  MnemonicBackupVerificationPage,
  ChangePinNumberPage,
  MnemonicImportPage,
  LockPage,
  WalletPage,
  WalletDetailPage,
  SendPage,
  SettingPage,
  QRCodeScan,
  WalletChangeCurrency,
  NetworkSettingPage,
  ChangeNetworkPage,
} from '../../pages'
import i18n from '../../utils/i18n'

import withDB from '../WithDB'
import withLock from '../WithLock'
import withWallet from '../WithWallet'
import withTransactions from '../WithTransactions'
import Color from "../../constants/Colors";
import withLoading from "../WithLoading";
const t = i18n.getFixedT()
const MainTabNavigator = TabNavigator({
  Wallet: {
    screen: withDB(withLock(withWallet(WalletPage))),
    navigationOptions: () => ({
      tabBarLabel: i18n.t('main:wallet', { locale: i18n.language }),
      tabBarIcon: () => (
        <MaterialCommunityIcons size={ 24 } name='wallet' />
      )
    })
  },
  Settings: {
    screen: withDB(withLock(withWallet(SettingPage))),
    navigationOptions: () => ({
      tabBarLabel: i18n.t('main:setting', { locale: i18n.language }),
      tabBarIcon: () => (
        <Image
          source={ require('../../assets/images/settings.png') }
        />
      )
    }),
  }}, {
    header: null,
    animationEnabled: true,
    tabBarComponent: NavigationComponent,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      bottomNavigationOptions: {
        backgroundColor: '#F7F7F7',
        labelColor: '#B3B3B5',
        rippleColor: 'white',
        shifting: false,
        tabs: {
          Wallet: {
            activeIcon: (
              <MaterialCommunityIcons size={ 24 } name='wallet' />
            ),
            activeLabelColor: '#303140',
          },
          Settings: {
            activeIcon: (
              <Image
                source={ require('../../assets/images/settings-selected.png') }
                style={{ tintColor: '#303140', }}
              />
            ),
            activeLabelColor: '#303140',
          },
        },
      },
    },
    swipeEnabled: false,
    activeTintColor: '#303140'
})

const MainNavigator = StackNavigator({
  MainTab: {
    screen: MainTabNavigator,
    navigationOptions: () => ({
      header: null
    })
  },
  Lock: {
    screen: LockPage,
    navigationOptions: () => ({
      header: null,
      headerBackTitle: i18n.t('main:lock', { locale: i18n.language }),
    })
  },
  WalletDetail: {
    screen: withDB(withWallet(withTransactions(WalletDetailPage))),
    navigationOptions: () => ({
      header: null
    })
  },
  QRCodeScan: {
    screen: QRCodeScan,
    navigationOptions: () => ({
      header: null
    })
  },
  Send: {
    screen: withDB(withWallet(withTransactions(SendPage))),
    navigationOptions: ({ navigation }) => ({
      headerTitle: i18n.t('main:transfer', { locale: i18n.language }),
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: navigation.state.params ? getHeaderBackgroundColor(navigation.state.params.account) : "#303140",
        borderBottomWidth: 0,
      },
      headerLeft: (
        <HeaderBackButton
          tintColor='white'
          title={navigation.state.params ? getHeaderTitle(navigation.state.params.account) : i18n.t('main:account', { locale: i18n.language })}
          onPress={() => navigation.goBack(null)} // TODO Alert
        />
      )
    })
  },
  WalletChangeCurrency: {
    screen: withDB(withWallet(WalletChangeCurrency)),
    navigationOptions: () => ({
      header: null,
    })

    // navigationOptions: ({ navigation }) => ({
    //   headerTitle: i18n.t('main:transfer', { locale: i18n.language }),
    //   headerTintColor: 'white',
    //   headerStyle: {
    //     backgroundColor: navigation.state.params ? getHeaderBackgroundColor(navigation.state.params.account) : "#303140",
    //     borderBottomWidth: 0,
    //   },
    //   headerLeft: (
    //     <HeaderBackButton
    //       tintColor='white'
    //       title={navigation.state.params ? getHeaderTitle(navigation.state.params.account) : i18n.t('main:account', { locale: i18n.language })}
    //       onPress={() => navigation.goBack(null)} // TODO Alert
    //     />
    //   )
    // })
  }
})

const MnemonicManagementStackNavigator = StackNavigator({
  MnemonicBackup: {
    screen: withLoading(MnemonicBackupPage),
    navigationOptions: () => ({
      header: null,
      headerBackTitle: i18n.t('main:mnemonic_backup', { locale: i18n.language }),
    })
  }}, {
    headerMode: 'screen',
    headerTintColor: 'white',
    headerStyle: {
      position: 'absolute',
      backgroundColor: 'transparent',
      borderBottomWidth: 0,
      zIndex: 100,
      top: 0,
      left: 0,
      right: 0
    },
    headerTitleStyle: {
      color: 'white'
    },
})

const AppNavigator = StackNavigator({
  Splash: {
    screen: withDB(withLock(SplashPage)),
    navigationOptions: () => ({
      header: null,
    })
  },
  Main: {
    screen: MainNavigator,
    navigationOptions: () => ({
      header: null,
    })
  },
  Landing: {
    screen: withDB(LandingPage),
    navigationOptions: () => ({
      header: null,
      headerBackTitle: t('main:landing', { locale: i18n.language }),
    })
  },
  PrivateKeyBackup: {
    screen: withLoading(withDB(withLock(PrivateKeyBackupPage))),
    navigationOptions: () => ({
      header: null,
      headerBackTitle: i18n.t('main:private_key_backup', { locale: i18n.language }),
    })
  },
  NetworkSetting: {
    screen: withLoading(withDB(withLock(withWallet(NetworkSettingPage)))),
    navigationOptions: () => ({
      header: null,
      headerBackTitle: i18n.t('main:network_setting', { locale: i18n.language }),
    })
  },
  ChangeNetwork: {
    screen: withLoading(withDB(withLock(withWallet(ChangeNetworkPage)))),
    navigationOptions: () => ({
      header: null,
      headerBackTitle: i18n.t('main:network', { locale: i18n.language }),
    })
  },
  MnemonicBackup: {
    screen: withLoading(withDB(withLock(MnemonicBackupPage))),
    navigationOptions: () => ({
      header: null,
      headerBackTitle: i18n.t('main:mnemonic_backup', { locale: i18n.language }),
    })
  },
  MnemonicBackupVerification: {
    screen: withLoading(withDB(withLock(MnemonicBackupVerificationPage))),
    navigationOptions: () => ({
      header: null,
      headerBackTitle: i18n.t('main:mnemonic_backup', { locale: i18n.language }),
    })
  },
  ChangePinNumber: {
    screen: ChangePinNumberPage,
    navigationOptions: () => ({
      header: null,
      headerBackTitle: i18n.t('main:changePinNumber', { locale: i18n.language }),
    })
  },
  MnemonicImport: {
    screen: withLoading(withDB(withLock(MnemonicImportPage))),
    navigationOptions: ({ navigation }) => ({
      headerTitle: i18n.t('main:import', { locale: i18n.language }),
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#303140',
        borderBottomWidth: 0,
      },
      headerLeft: (
        <HeaderBackButton
          tintColor='white'
          title={i18n.t('main:landing', { locale: i18n.language })}  // TODO onPress
          onPress={() => navigation.goBack(null)} // TODO Alert
        />
      )
    })
  }},{
    initialRouteName: 'Splash',
})

export default AppNavigator
