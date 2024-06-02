import {Alert, BackHandler, Share} from 'react-native'

const ServerError = 'Something went wrong. Please try again later.'

const ShareButton = ({link = '', fullname = ''}) => {
    const shareLink = `https://www.smartsoftstudios.com/share/${link}`
    const shareMessage = `Connect with ${fullname} on gamba\n${shareLink}`
    // console.log(link, 'link', fullname)
    const onShare = async () => {
        try {
            const result = await Share.share({
                message: shareMessage
            })

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                } else {
                }
            } else if (result.action === Share.dismissedAction) {
            }
        } catch (error) {
            Alert.alert(error.message)
        }
    }
    onShare()
}

export default ShareButton
