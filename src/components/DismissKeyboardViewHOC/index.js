import React from 'react'
import { TouchableWithoutFeedback, Keyboard } from 'react-native'

const DismissKeyboardViewHOC = (Component) => {
  return ({ children, ... props }) => (
    <TouchableWithoutFeedback onPress={ Keyboard.dismiss } accessible={ false }>
      <Component { ... props }>
        { children }
      </Component>
    </TouchableWithoutFeedback>
  )
}

export default DismissKeyboardViewHOC
