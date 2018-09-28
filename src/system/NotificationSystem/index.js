import React from 'react'
import PropTypes from 'prop-types'
import { Animated, View, Text, PanResponder } from 'react-native'

class NotificationSystem extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notificationContent: null,
      showMoreContentIndicator: false,
      showMoreContent: false,
    }
    
    this.containerHeight = new Animated.Value(0)
    this.innerContainerOpacity = this.containerHeight.interpolate({
      inputRange: [0, props.height],
      outputRange: [0, 1],
    })

    this.dismissTimer = null
  }

  _clearTimeout = (timer) => {
    if(timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  doDismiss = () => {
    Animated.timing(this.containerHeight, {
      toValue: 0,
      duration: 150,
    }).start(() => {
      this.setState({
        notificationContent: null
      })
    })
  }

  setDismiss = (dismissTime) => {
    let _dismissTime = dismissTime == undefined ? 5 : dismissTime
    this.dismissTimer = setTimeout(this.doDismiss, dismissTime * 1000)
  }

  initNotification = () => {
    this.setState({
      notificationContent: null,
      showMoreContentIndicator: false,
      showMoreContent: false,
    })
  }

  addNotification = (notificationContent) => {
    this.initNotification()

    const { moreHeight } = this.props
    const { autoDismiss, moreContent, ... restOfContent } = notificationContent

    if(moreContent) {
      this.panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderRelease: (evt, { dy }) => {
          const { height, moreHeight } = this.props

          if(dy < 0 && height / 2 < Math.abs(dy)) { // 내려 버리면
            this._clearTimeout(this.dismissTimer)
            this.doDismiss()
          } else if(dy > 0 && ((moreHeight - height) / 2) < dy) { // 위로 올려버리면
            this.setDismiss(autoDismiss)
            Animated.timing(this.containerHeight, {
              toValue: moreHeight,
              duration: 100,
            }).start(() => {
              this.setState({
                showMoreContent: true
              })
            })
          } else { // 그외에 경우에는 원래 위치로 돌아가야 됨.
            this.setDismiss(autoDismiss)
            Animated.timing(this.containerHeight, {
              toValue: height,
              duration: 100,
            }).start()
          }
        },
      })

    } else {
      this.panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderRelease: (evt, { dy }) => {
          const { height, moreHeight } = this.props

          if(dy < 0 && height / 2 < Math.abs(dy)) { // 내려 버리면
            this._clearTimeout(this.dismissTimer)
            this.doDismiss()
          }
        }
      })
    }

    this.setState({
      notificationContent: {
        moreContent: moreContent,
        ... restOfContent
      },
      showMoreContentIndicator: true,
    }, () => {
      const { height } = this.props

      Animated.timing(this.containerHeight, {
        toValue: height,
        duration: 700,
      }).start(() => this.setDismiss(autoDismiss))
    })
  }

  editNotification = () => {
    return null
  }

  clearNotification = () => {
    this.setState({
      notificationContent: null
    })
  }

  render() {
    const { showMoreContent, showMoreContentIndicator, notificationContent } = this.state

    if(notificationContent === null) return null

    const { moreContent } = notificationContent

    return (
      <Animated.View style={{ zIndex: 1000, paddingBottom: 5, position: 'absolute', width: '100%', height: this.containerHeight, flex: 1, backgroundColor: '#6341d3', }}>
        <Animated.View style={{ flex: 1, opacity: this.innerContainerOpacity, justifyContent: 'space-around', alignItems: 'center', padding: 10, paddingLeft: 15, paddingRight: 15, marginTop: 15, flexDirection: 'row', }}>
          <View style={{ flex: 0.9, }}>
            <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 5, }}>{ notificationContent.title }</Text>
            <Text style={{ color: 'white', }}>{ notificationContent.message }</Text>
          </View>
          <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', flex: 0.1 }}>
            { notificationContent.icon }
          </View>
        </Animated.View>
        {
          showMoreContentIndicator === true && showMoreContent === false ? (
            <Animated.View style={{ position: 'absolute', bottom: 0, justifyContent: 'center', width: '100%', height: 13, opacity: this.innerContainerOpacity, alignItems: 'center', }} { ... this.panResponder.panHandlers }>
              <View style={{ width: 50, height: 5, borderRadius: 10, backgroundColor: 'rgba(255, 255, 255, 0.3)', }} />
            </Animated.View>
          ) : (
            null
          )
        }
        {
          showMoreContent === true ? (
            <View style={{ width: '100%', }}>
              { moreContent }
            </View>
          ) : (
            null
          )
        }
      </Animated.View>
    )
  }
}

NotificationSystem.propTypes = {
  height: PropTypes.number,
  moreHeight: PropTypes.number,
}

NotificationSystem.defaultProps = {
  height: 100,
  moreHeight: 150,
}

export default NotificationSystem
