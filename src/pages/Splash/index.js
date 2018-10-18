import React from 'react'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { StatusBar, Image, View } from 'react-native'
import { FileSystem, SecureStore, Notifications, Permissions } from 'expo'

import { actions } from 'rediwallet/src/pages'

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

	async componentDidMount() {
    const { db, nav, } = this.props
    // TODO: Uncomment it
    // const { update_seq } = await db.info()
    //
    // if(update_seq === 0) {
    //   await Permissions.askAsync(Permissions.NOTIFICATIONS)
    // }

		setTimeout(async () => {
		  console.log('turned on')
      const seed = await SecureStore.getItemAsync('seed')

			if(seed == null) {
				this.navigateTo('Landing', nav)
			} else {
        this.navigateTo('Main', nav)
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
				<Image style={{ width: 160, height: 30, }} source={ require('rediwallet/src/assets/images/logo_428x222.png') } />
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
  splashState: state.splashStateReducer.splashState,
})

export default connect(mapStateToProps)(SplashPage)
