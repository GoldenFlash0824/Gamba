import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native'
import FastImage from 'react-native-fast-image'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import {IMAGES_BASE_URL} from '../../../services'

const CommunityList = ({item, onProfile}) => {
    return (
        <View style={styles.listContainer}>
            {item ? (
                <>
                    <TouchableOpacity activeOpacity={0.8} onPress={onProfile} style={[styles.imagNameContainer]}>
                        <FastImage source={{uri: item?.image ? IMAGES_BASE_URL + item.image : IMAGES_BASE_URL + item?.first_name[0]?.toLowerCase() + '.png'}} resizeMode="cover" style={styles.imageContainer} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} onPress={onProfile}>
                        <Text style={styles.nameUser} numberOfLines={2}>
                            {item?.first_name + '\n' + item?.last_name}
                        </Text>
                    </TouchableOpacity>
                </>
            ) : null}
        </View>
    )
}

const styles = StyleSheet.create({
    listContainer: {
        width: wp('18%'),
        marginLeft: wp('1'),
        alignItems: 'center'
    },
    onlineOption: {
        width: wp('2.4%'),
        height: hp('1.1%'),
        borderRadius: hp('5%'),
        backgroundColor: Colors.MainThemeColor,
        position: 'absolute',
        right: wp('3%'),
        zIndex: 1
    },
    imagNameContainer: {
        height: wp('12%'),
        width: Platform.OS == 'android' ? wp('12%') : wp('12%'),
        borderRadius: hp('6%'),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.LightCream_10
    },
    imageContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },

    nameUser: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        textAlign: 'left'
    }
})

export default CommunityList
