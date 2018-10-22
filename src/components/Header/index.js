import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { Animated, StyleSheet, TouchableOpacity,Text, View } from 'react-native'

class Header extends React.Component {
  constructor() {
    super()

    this.rotateProp = new Animated.Value(0)
    this.refreshButtonRotate = this.rotateProp.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg',]
    })
  }

  rotateRefreshButton = () => {
    Animated.timing(this.rotateProp, {
      useNativeDriver: true,
      toValue: 1,
      duration: 1500,
    }).start(() => {
      const { isRefreshing } = this.props

      if(isRefreshing) {
        this.rotateRefreshButton()
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    const { isRefreshing } = nextProps
    const { isRefreshing: prevIsRefreshing } = this.props

    if(isRefreshing === true && isRefreshing !== prevIsRefreshing) {
      this.rotateRefreshButton()
    } else if(prevIsRefreshing === true && isRefreshing === false) {
      this.rotateProp.setValue(0)
    }
  }

  render() {
    const {
      onAdd,
      onSearch,
      onRefresh,
      backButton,
      headerTitle,
      extraButtons,
      isRefreshing,
      renderContent,
      backgroundColor,
      renderBackButton,
      onBackButtonPress,
      searchPlaceHolder,
    } = this.props


    return (
      <View style={[ styles.headerContainer, { backgroundColor: backgroundColor } ]}>
        {
          backButton || extraButtons ? (
            <View style={{ marginTop: 30, paddingLeft: 15, paddingRight: 15, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', }}>
              { 
                backButton && (
                  <View>
                    { backButton }
                  </View>
                )
              }
              {
                extraButtons ? (
                  <View>
                    { extraButtons }
                  </View>
                ) : (
                  null
                )
              }
            </View>
          ) : (
            null
          )
        }
        {
          renderContent === true && (
            <View style={ styles.actionsWrapper }>
              <View style={ styles.iconsWrapper }>
                {
                  isRefreshing === true ? (
                    <Animated.View style={{ transform: [{ rotate: this.refreshButtonRotate }] }}>
                      <Ionicons name='ios-refresh' size={ 32 } color='rgba(255, 255, 255, 0.6)' />
                    </Animated.View>
                  ) : (
                    <TouchableOpacity onPress={ onRefresh }>
                      <Ionicons name='ios-refresh' size={ 32 } color='rgba(255, 255, 255, 1)' />
                    </TouchableOpacity>
                  )
                }
                <TouchableOpacity onPress={ onAdd }>
                  <Ionicons name='ios-add' size={ 32 } color='white' />
                </TouchableOpacity>
              </View>
            </View>
          )
        }
        <View style={[ styles.titleTextWrapper, renderContent === false ? { flex: 0.85, justifyContent: 'flex-end',  } : null ]}>
          <Text style={ styles.titleText }>{ headerTitle }</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
  },

  actionsWrapper: {
    flex: 0.4,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
  },

  iconsWrapper: {
    width: '30%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  titleTextWrapper: {
    flex: 0.3,
  },

  titleText: {
    fontSize: 24,
    color: 'white',
    marginLeft: '4%',
  },

  searchContainer: {
    flex: 0.3,
    alignItems: 'center',
  }
})

Header.propTypes = {
  onAdd: PropTypes.func,
  onSearch: PropTypes.func,
  onRefresh: PropTypes.func,
  headerTitle: PropTypes.string,
  renderContent: PropTypes.bool,
  backgroundColor: PropTypes.string,
  searchPlaceHolder: PropTypes.element
}

Header.defaultProps = {
  renderContent: true,
  backgroundColor: '#303140',
  renderBackButton: null,
}

export default Header
