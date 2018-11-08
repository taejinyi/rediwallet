import React from 'react'
import PropTypes from 'prop-types'
import { Container, Content, } from 'native-base'
import { Keyboard, View, Text, TextInput } from 'react-native'

class PinNumberInputs extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      inputStatus: new Array(props.numberOfInputs),
      focusInput: undefined,
    }

    this.state.inputStatus.fill(false)
    this.state.inputStatus[0] = true

    this.inputElements = new Array(props.numberOfInputs)
    this.inputElementValues = new Array(props.numberOfInputs)
    this.inputElements.fill(undefined)
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.inputElements !== null) {
        this.inputElements[0].focus()
      }
    }, 1000)
  }

  clearAllInputs = () => {
    const { inputStatus } = this.state
    inputStatus.fill(false)

    inputStatus[0] = true

    this.setState({
      inputStats: inputStatus,
    }, () => {
      this.inputElements.forEach(input => input.clear())
      setTimeout(() => this.inputElements[0].focus(), 300)
    })
  }

  _onKeyPress = ({ nativeEvent }, index) => {
    const { key } = nativeEvent
    const { inputStatus } = this.state
    const totalInputs = this.inputElements.length
    if(key === 'Backspace' &&
      index >= 1 &&
      index <= this.inputElements.length - 1) {
      const { inputStatus } = this.state

      inputStatus[index] = false
      inputStatus[index - 1] = true

      this.setState({
        inputStatus: inputStatus,
      }, () => {
        this.inputElements[index - 1].clear()
        this.inputElements[index - 1].focus()
      })
    } else if(key !== 'Backspace' && index < totalInputs - 1) {
      inputStatus[index] = false
      inputStatus[index + 1] = true

      this.inputElementValues[index] = key

      this.setState({
        inputStatus: inputStatus,
      }, () => {
        if(this.inputElementValues[index]) {
          this.inputElements[index + 1].focus()
        }
      })
    } else if(key !== 'Backspace' && index >= totalInputs - 1) {
      Keyboard.dismiss()
      const { onTextFilled } = this.props

      this.inputElementValues[index] = key
      const code = this.inputElementValues.join('')

      if(onTextFilled) {
        onTextFilled(code)
      }
    }
  }

  render() {
    const { numberOfInputs } = this.props
    const { inputStatus, focusInput, } = this.state

    return (
      <View style={{ width: '100%', flex: 1, justifyContent: 'space-around', flexDirection: 'row', }}>
        {
          this.inputElements.map((dummy, index) => {
            return (
              <TextInput
                secureTextEntry={ true }
                key={ index }
                maxLength={ 1 }
                keyboardType='numeric'
                editable={ inputStatus[index] }
                ref={ el => this.inputElements[index] = el } 
                onFocus={() => this.setState({ focusInput: index })}
                onKeyPress={(e) => this._onKeyPress(e, index) }
                style={[ this.props.inputStyle, { borderColor: index === focusInput ? this.props.focusTextBorderColor : this.props.normalTextBorderColor }]} 
              />
            )
          })
        }
      </View>
    )
  }
}

PinNumberInputs.defaultProps ={
  numberOfInputs: 4,
  inputStyle: {
    width: 40,
    fontSize: 28,
    color: '#666666',
    fontWeight: 'bold',
    textAlign: 'center',
    borderBottomWidth: 2,
  },
  focusTextBorderColor: 'white',
  normalTextBorderColor: 'white',
}

PinNumberInputs.propTypes = {
  onTextFilled: PropTypes.func,
  inputStyle: PropTypes.object.isRequired,
  numberOfInputs: PropTypes.number.isRequired,
  focusTextBorderColor: PropTypes.string,
  normalTextBorderColor: PropTypes.string,
}

export default PinNumberInputs
