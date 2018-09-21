import React from 'react'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { StatusBar, Image, View } from 'react-native'
import { FileSystem, SecureStore, Notifications, Permissions } from 'expo'

import { actions } from 'rediwallet/src/pages'
import { SPLASH_STATE, getInformation } from './actions'

// import * as services from 'src/apis/network'

class SplashPage extends React.Component {
	navigateTo = (_routeName) => {
    const { dispatch } = this.props.navigation

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: _routeName })
      ]
    })

    dispatch(resetAction)
  }

  componentWillReceiveProps(nextProps) {
    const { nav } = nextProps
    const { splashState, mnemonic } = nextProps

    if(mnemonic.length < 5) {
      return this.navigateTo('Landing')
    }
    return this.navigateTo('Main')
  }

	async componentDidMount() {
    const { db, nav, } = this.props
    // TODO: Uncomment it
    // const { update_seq } = await db.info()
    //
    // if(update_seq === 0) {
    //   await Permissions.askAsync(Permissions.NOTIFICATIONS)
    // }

		setTimeout(async () => {
			const mnemonic = await SecureStore.getItemAsync('mnemonic')

			if(mnemonic == null) {
				this.navigateTo('Landing', nav)
			} else {
        const { saveMnemonic, getInformation } = this.props

        saveMnemonic(mnemonic)

        // await this.checkPushTokenExistOrSave(token)
        getInformation(db, mnemonic)
			}
		}, 1000)
	}

	render() {
		return (
      <View style={{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#555555',
      }}>
        <StatusBar barStyle='light-content' />
				<Image style={{ width: 120, height: 30, }} source={ require('rediwallet/src/assets/images/logo.png') } />
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
  splashState: state.splashStateReducer.splashState,
})

const mapDispatchToProps = (dispatch) => ({
  saveMnemonic: (mnemonic) => dispatch(actions.saveMnemonic(mnemonic)),
  getInformation: (db, mnemonic) => dispatch(getInformation(db, mnemonic)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SplashPage)
