import React from 'react'
import PropTypes from 'prop-types'

class LoadingButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: props.isLoading !== undefined ? props.isLoading : false,
    }

    this.willUnmount = false
  }

  componentWillUnmount() {
    this.willUnmount = true
  }

  componentWillReceiveProps(nextProps) {
    const { isLoading } = nextProps

    if(isLoading !== undefined) {
      this.setState({
        loading: isLoading,
      })
    }
  }

  render() {
    const { loading } = this.state

    if(loading === true) {
      const { Component, loadingView, onPress, ... rest } = this.props

      return (
        <Component disabled={ true } { ... rest } >
          { loadingView }
        </Component>
      )

    } else {
      const { isLoading, Component, children, onPress:originalOnPress, ... rest } = this.props

      return (
        <Component
          ref={ el => this.buttonElement = el }
          onPress={async () => {
            if(isLoading === undefined) {
              this.setState({
                loading: true
              })
            }

            await originalOnPress()

            if(isLoading === undefined && !this.willUnmount) {
              this.setState({
                loading: false
              })
            }
          }}
          { ... rest }
        >
          { children }
        </Component>
      )
    }
  }
}

LoadingButton.propTypes = {
  onPress: PropTypes.func,
  children: PropTypes.element,
  loadingView: PropTypes.element,
  Component: PropTypes.oneOfType([ PropTypes.element, PropTypes.func ]),
}

export default LoadingButton
