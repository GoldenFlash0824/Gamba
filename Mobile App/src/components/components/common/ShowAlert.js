import {Alert, BackHandler} from 'react-native'

const ServerError = 'Something went wrong. Please try again later.'

const ShowAlert = ({description = ServerError, type = 'error'}) => {
    if (type == 'exit') {
        Alert.alert('Exit Gamba?', 'Are you sure you want to exit the application?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel'
            },
            {text: 'YES', onPress: () => BackHandler.exitApp()}
        ])
        return true
    } else {
        Alert.alert(type === 'Info' ? 'Info' : type === '' ? '' : type === 'error' ? 'Oops!' : 'Success', description, [{text: 'OK', onPress: () => console.log('OK Pressed')}], {cancelable: true})
    }
}

export default ShowAlert
