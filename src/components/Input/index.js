import React from 'react'
import PropTypes from 'prop-types'
import { 
  Platform, 
	StyleSheet,
	TextInput,
	View
} from 'react-native'

class Input extends React.Component {
	constructor() {
		super()

		this.state = {
			focus: false,
		}

		this.textValue = ''
	}

	render() {
		const { 
			onChangeText, 
			containerStyle,
			underlineColor, 
			underlineHoverColor,
			placeHolder,
			textStyle,
			... rest,
		} = this.props
		const { focus } = this.state

		const textInputStyle = {
			... Platform.select({
				ios: {
					borderBottomWidth: 1.4,
					borderColor: focus === true ? underlineHoverColor : underlineColor,
				}
			}),
			... textStyle,
			width: '100%',
			padding: 5,
		}

		const _containerStyle = {
      ... Platform.select({
        ios: {
          marginTop: '5%',
        },
      }),
			... containerStyle
		}

		return (
			<View style={ _containerStyle }>
				{
					focus === false && !this.textValue.length ? (
						<View style={ styles.placeHolderContainer }>
							{ placeHolder }
						</View>
					) : null
				}
        <TextInput
          style={ textInputStyle }
          onBlur={ () => this.setState({ focus: false }) }
          onFocus={ () => this.setState({ focus: true }) }
          underlineColorAndroid={ underlineColor }
          onChangeText={(r) => {
            this.textValue = r
            if(onChangeText) onChangeText(r)
          }}
          { ... rest }
        />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	inputContainer: {
		flex: 1,
		width: '100%'
	},

	placeHolderContainer: {
		position: 'absolute',
		left: '2%',
	}
})

Input.propTypes = {
	onChangeText: PropTypes.func,
	textStyle: PropTypes.object,
	containerStyle: PropTypes.object,
	underlineColor: PropTypes.string,
	underlineHoverColor: PropTypes.string,
	placeHolder: PropTypes.element,
}

export default Input
