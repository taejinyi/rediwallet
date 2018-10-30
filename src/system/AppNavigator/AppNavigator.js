import React from 'react'
import { Image, Text, TouchableOpacity } from 'react-native'
import { NavigationComponent } from 'react-native-material-bottom-navigation'
import { NavigationActions, HeaderBackButton, StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

import {
  SplashPage,
  LandingPage,
  MnemonicBackupPage,
  MnemonicImportPage,
  LockPage,
  UnlockPage,
  WalletPage,
  WalletDetailPage,
  SendPage,
  SettingPage,
  QRCodeScan
} from '../../pages'

import withDB from '../WithDB'
import withLock from '../WithLock'
import withWallet from '../WithWallet'
import withTransactions from '../WithTransactions'
import Color from "../../constants/Colors";

const MainTabNavigator = TabNavigator({
  Wallet: {
    screen: withDB(withLock(withWallet(WalletPage))),
    navigationOptions: {
      tabBarLabel: '지갑',
      tabBarIcon: () => (
        <Image
          source={ require('../../assets/images/wallet.png') }
        />
      )
    }
  },
  Settings: {
    screen: withDB(withLock(SettingPage)),
    navigationOptions: {
      tabBarLabel: '설정',
      tabBarIcon: () => (
        <Image
          source={ require('../../assets/images/settings.png') }
        />
      )
    },
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
              <Image
                source={ require('../../assets/images/wallet-selected.png') }
                style={{ tintColor: '#303140', }}
              />
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

const getHeaderTitle = (account) => {
  let currencyName
  if (account.currency) {
    if (account.currency === "ETH") {
      currencyName = "Ethereum"
    } else if (account.currency === "IFUM") {
      currencyName = "Infleum"
    } else if (account.currency === "KRWT") {
      currencyName = "KRW Tether"
    } else {
      currencyName = "Unknown"
    }
  } else {
    currencyName = "Loading..."
  }
  return currencyName
}

const getHeaderBackgroundColor = (account) => {
  let headerBackgroundColor
  if (account.currency) {
    if (account.currency === "ETH") {
      headerBackgroundColor = Color.ethereumColor
    } else if (account.currency === "IFUM") {
      headerBackgroundColor = Color.infleumColor
    } else if (account.currency === "KRWT") {
      headerBackgroundColor = Color.krwtColor
    } else {
      headerBackgroundColor = Color.backgroundColor
    }
  } else {
    headerBackgroundColor = Color.backgroundColor
  }
  return headerBackgroundColor
}

const MainNavigator = StackNavigator({
  MainTab: {
    screen: MainTabNavigator,
    navigationOptions: {
      header: null
    }
  },
  Lock: {
    screen: LockPage,
    navigationOptions: {
      header: null,
      headerBackTitle: 'Lock',
    }
  },
  WalletDetail: {
    screen: withDB(withWallet(withTransactions(WalletDetailPage))),
    navigationOptions: ({ navigation }) => ({
      headerTitle: navigation.state.params ? getHeaderTitle(navigation.state.params.account) : "Loading...",
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: navigation.state.params ? getHeaderBackgroundColor(navigation.state.params.account) : "#303140",
        borderBottomWidth: 0,
      },
      headerLeft: (
        <HeaderBackButton
          tintColor='white'
          title='Wallet'  // TODO onPress
          onPress={() => navigation.goBack(null)} // TODO Alert
        />
      )
    })
  },
  QRCodeScan: {
    screen: QRCodeScan,
    navigationOptions: {
      header: null
    }
  },
  Send: {
    screen: withDB(withWallet(SendPage)),
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Send',
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#303140',
        borderBottomWidth: 0,
      },
      headerLeft: (
        <HeaderBackButton
          tintColor='white'
          title='Wallet Detail'  // TODO onPress
          onPress={() => navigation.goBack(null)} // TODO Alert
        />
      )
    })

  },
})

const MnemonicManagementStackNavigator = StackNavigator({
  MnemonicBackup: {
    screen: MnemonicBackupPage,
    navigationOptions: {
      header: null,
      headerBackTitle: 'Mnemonic Backup',
    }
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
    navigationOptions: {
      header: null,
    }
  },
  Main: {
    screen: MainNavigator,
    navigationOptions: {
      header: null,
    }
  },
  Landing: {
    screen: withDB(LandingPage),
    navigationOptions: {
      header: null,
      headerBackTitle: 'Landing',
    }
  },
  MnemonicBackup: {
    screen: withDB(withLock(MnemonicBackupPage)),
    navigationOptions: {
      header: null,
      headerBackTitle: 'Mnemonic Backup',
    }
  },
  MnemonicImport: {
    screen: withDB(withLock(MnemonicImportPage)),
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Import',
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#303140',
        borderBottomWidth: 0,
      },
      headerLeft: (
        <HeaderBackButton
          tintColor='white'
          title='Landing'  // TODO onPress
          onPress={() => navigation.goBack(null)} // TODO Alert
        />
      )
    })
  }},{
    initialRouteName: 'Splash',
})

export default AppNavigator
