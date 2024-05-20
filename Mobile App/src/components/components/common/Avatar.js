import React from 'react'
import {StyleSheet} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import FastImage from 'react-native-fast-image'

const Avatar = (props) => {
    const {img, avatarStyle, resizeMode} = props
    return <FastImage style={[styles.image, avatarStyle]} source={img} resizeMode={resizeMode ? resizeMode : 'cover'} />
}

const styles = StyleSheet.create({
    image: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%')
    }
})

export default Avatar
