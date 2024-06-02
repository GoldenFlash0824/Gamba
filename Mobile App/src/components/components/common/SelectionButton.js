import React, {useState, useEffect} from 'react'
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const SelectionButton = ({item, iconRight = false, iconLeft, type, callBack, titalStyles, selectedTitalStyle}) => {
    const [isSelect, setIsSelect] = useState(item.isSelected)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setIsSelect(item.isSelected)
    }, [item.isSelected])

    const handleTouch = () => {
        if (callBack) {
            if (isSelect) {
                callBack(item, !isSelect)
                setIsSelect(false)
            } else {
                callBack(item, !isSelect)
                setIsSelect(true)
            }
        } else {
            null
        }
    }

    return (
        <>
            {isSelect ? (
                <TouchableOpacity style={styles.buttonSelected} onPress={handleTouch} activeOpacity={0.8}>
                    {iconLeft && <FastImage source={require('../../../assets/icons/screens/facebook.png')} style={styles.icon} />}
                    <Text style={[styles.selectedText, selectedTitalStyle]}>{item.title == 'None' ? item.title : item.title + '%'}</Text>
                    {iconRight && <FastImage source={require('../../../assets/icons/screens/close.png')} style={styles.icon} tintColor={type == 'Primary' ? Colors.DarkPepper_80 : Colors.White} />}
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.buttonNormal} onPress={handleTouch} activeOpacity={0.8}>
                    {iconLeft && <FastImage source={require('../../../assets/icons/screens/facebook.png')} style={styles.icon} />}
                    <Text style={[styles.normalText, titalStyles]}>{item.title == 'None' ? item.title : item.title + '%'}</Text>
                    {iconRight && <FastImage source={require('../../../assets/icons/screens/close.png')} style={styles.icon} tintColor={type == 'Primary' ? Colors.DarkPepper_80 : Colors.White} />}
                </TouchableOpacity>
            )}
        </>
    )
}

export default SelectionButton

const styles = StyleSheet.create({
    buttonNormal: {
        minWidth: wp('20'),
        minHeight: hp('5'),
        borderRadius: wp('4'),
        backgroundColor: Colors.BorderGrey,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonSelected: {
        minWidth: wp('20'),
        minHeight: hp('5'),
        borderRadius: wp('4'),
        backgroundColor: Colors.MainThemeColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    selectedText: {
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    normalText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    icon: {
        width: wp('5%'),
        height: wp('5%')
    }
})
