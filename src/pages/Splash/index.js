import React from 'react'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { StatusBar, Image, View } from 'react-native'
import { FileSystem, SecureStore, Notifications, Permissions } from 'expo'
import { SPLASH_STATE, getInformation } from './actions'

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

  componentWillReceiveProps(nextProps) {
    const { nav } = nextProps
    const { splashState, wallet } = nextProps

    if(splashState === SPLASH_STATE.STATE_FINISH) {
      return this.navigateTo('Main')
    }
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
      const seed = await SecureStore.getItemAsync('seed')
			if(seed == null) {

				this.navigateTo('Landing', nav)
			} else {
        this.props.getInformation(db)
			}
		}, 1000)
	}

	render() {
		return (
      <View style={{ 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#303140',
      }}>
        <StatusBar barStyle='light-content' />
				<Image style={{ width: 150, height: 150, }} source={ require('rediwallet/src/assets/images/logo_400x400.png') } />
			</View>
		)
	}
}

const mapStateToProps = (state) => ({
  splashState: state.splashStateReducer.splashState,
})

const mapDispatchToProps = (dispatch) => ({
  getInformation: (db) => dispatch(actions.getInformation(db)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SplashPage)
