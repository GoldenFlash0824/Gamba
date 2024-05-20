import React, {useRef, useState} from 'react'
import {StyleSheet, Text, TouchableOpacity, View, useWindowDimensions, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import RBSheet from 'react-native-raw-bottom-sheet'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import AddSheet from './AddSheet'
import AddSheetSell from './AddSheetSell'
const pickerData = [
    {name: 'Share Post', image: require('../../../assets/icons/screens/share_post.png')},
    {name: 'Sell Goods', image: require('../../../assets/icons/screens/sell_post.png')},
    {name: 'Create Event', image: require('../../../assets/icons/screens/create_event.png')}
]
const AddModal = ({callBack}) => {
    const [_title, setTitle] = useState('Sell Goods')
    const onAddButtonPress = () => sheetRef.current.open()

    const sheetRef = useRef()
    const addSheetRef = useRef()
    const addSheetSellRef = useRef()
    const {height} = useWindowDimensions()
    const closeHandler = () => addSheetRef.current.close()
    const closeHandlerSell = () => addSheetSellRef.current.close()

    const pickerHandler = (item) => {
        sheetRef.current.close()
        setTimeout(() => {
            if (item.name == 'Sell Goods') {
                setTitle(item.name)
                addSheetSellRef.current.open()
            } else {
                setTitle(item.name)
                addSheetRef.current.open()
            }
        }, 200)
    }
    return (
        <>
            <TouchableOpacity onPress={onAddButtonPress} style={height > 1000 ? styles.addView : styles.addViewAndroid}>
                <TouchableOpacity onPress={onAddButtonPress} style={styles.addViewI}>
                    <FastImage source={require('../../../assets/icons/screens/add.png')} resizeMode="contain" style={{width: wp('7%'), height: wp('7%'), zIndex: 2}} tintColor={Colors.White} />
                </TouchableOpacity>
            </TouchableOpacity>
            <RBSheet
                animationType={'slide'}
                ref={sheetRef}
                height={hp('35%')}
                closeOnDragDown={true}
                closeOnPressMask={true}
                closeDuration={100}
                openDuration={100}
                customStyles={{
                    mask: {
                        backgroundColor: Colors.DarkPepper_80
                    },
                    draggableIcon: {
                        backgroundColor: Colors.GrayLight
                    },
                    container: {
                        backgroundColor: Colors.White
                    }
                }}>
                <>
                    <TouchableOpacity style={styles.bottomView} activeOpacity={0.8} onPress={callBack}>
                        <View style={styles.dropDownList}>
                            {pickerData?.map((item, ind) => {
                                return (
                                    <TouchableOpacity style={[styles.listContainer, {marginTop: ind === 0 ? hp('0') : hp('1')}]} key={ind} onPress={() => pickerHandler(item)} activeOpacity={0.8}>
                                        <FastImage source={item.image} resizeMode="contain" style={styles.leftIcon} tintColor={Colors.Black} />
                                        <Text style={styles.listText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.skipButton} onPress={closeHandler} activeOpacity={0.8}>
                            <Text style={styles.skipText}>{'Cancel'}</Text>
                        </TouchableOpacity> */}
                </>
            </RBSheet>
            <AddSheet setRef={addSheetRef} onCloseCB={closeHandler} title={_title} editPostData={null} />
            <AddSheetSell setRef={addSheetSellRef} onCloseCB={closeHandlerSell} title={_title} editPostData={null} />
        </>
    )
}

const styles = StyleSheet.create({
    addView: {
        width: wp('14'),
        height: wp('14%'),
        backgroundColor: Colors.RedColor,
        alignItems: 'center',
        borderRadius: wp('7'),
        justifyContent: 'center',
        bottom: hp('1.2')
    },
    addViewAndroid: {
        width: wp('14'),
        height: wp('14%'),
        backgroundColor: Colors.RedColor,
        alignItems: 'center',
        borderRadius: wp('7'),
        justifyContent: 'center',
        bottom: hp('1.2')
    },
    addViewI: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    bottomView: {
        backgroundColor: Colors.White
    },
    dropDownList: {
        width: wp('92%'),
        marginTop: Platform.OS == 'android' ? hp('5') : hp('3'),
        alignItems: 'center',
        alignSelf: 'center'
    },
    listContainer: {
        height: hp('6'),
        width: wp('86%'),
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.5),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: wp('8')
    },
    leftIcon: {
        width: wp('5%'),
        height: wp('5%')
    },
    listText: {
        paddingLeft: wp('2'),
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13
    },
    description: {
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        marginBottom: hp('0%'),
        paddingLeft: wp('4%'),
        color: Colors.Black
    },
    text: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    imgSelectContainer: {
        flexDirection: 'row',
        width: wp('100%'),
        height: hp('20%'),
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    imageSelector: {
        width: wp('45%'),
        height: hp('15%'),
        paddingVertical: hp('2%'),
        borderRadius: wp('2%'),
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: Colors.LightCream_10,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    iconStyle: {
        width: wp('8%'),
        height: wp('8%')
    },
    skipButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('1%'),
        height: hp('5%')
    },
    skipText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    }
})

export default AddModal
