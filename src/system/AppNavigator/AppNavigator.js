import React from 'react'
import { Image, Text, TouchableOpacity } from 'react-native'
import { NavigationComponent } from 'react-native-material-bottom-navigation'
import { NavigationActions, HeaderBackButton, StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

import {
  SplashPage,
  LandingPage,
  MnemonicBackupPage,
  LockPage,
  UnlockPage,
  WalletPage,
  AccountDetailPage,
  SettingPage
} from 'rediwallet/src/pages'

import withDB from '../WithDB'
import withLock from '../WithLock'
import withWallet from '../WithWallet'

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
                style={{ tintColor: '#10b5bc', }}
              />
            ),
            activeLabelColor: '#10b5bc',
          },
          Settings: {
            activeIcon: (
              <Image
                source={ require('../../assets/images/settings-selected.png') }
                style={{ tintColor: '#10b5bc', }}
              />
            ),
            activeLabelColor: '#10b5bc',
          },
        },
      },
    },
    swipeEnabled: false,
    activeTintColor: '#10b5bc'
})

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
  AccountDetail: {
    screen: withDB(withWallet(AccountDetailPage)),
    navigationOptions: {
      header: null,
      headerBackTitle: 'Account Detail',
    }
  }
  // QRCodeScan: {
  //   screen: QRCodeScan,
  //   navigationOptions: {
  //     header: null
  //   }
  // }
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
    screen: LandingPage,
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
  }}, {
    initialRouteName: 'Splash',
})

export default AppNavigator
