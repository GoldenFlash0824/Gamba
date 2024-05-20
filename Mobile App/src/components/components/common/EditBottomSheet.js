import React from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import RBSheet from 'react-native-raw-bottom-sheet'
import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import {separatorHeight} from '../../../utils/helpers'

import ActiveButton from '../../../components/components/common/ActiveButton'

import FastImage from 'react-native-fast-image'

const EditBottomSheet = ({setRef, share, hide, seeImage, skipButtonCB, onCloseCB, back = false, height, deleteEventCB, editCB, editSheet = false, tradeCard = false, saveData = false, report, reportThis = false, hideShow = false, shareShow = false, reportCB, organic = false, deleteEvent = false, editEvent = false}) => {
    const onSave = () => {}
    return (
        <RBSheet
            ref={setRef}
            closeOnDragDown={tradeCard ? false : true}
            closeOnPressMask={true}
            closeDuration={100}
            openDuration={100}
            height={height}
            onClose={onCloseCB}
            customStyles={{
                draggableIcon: {
                    backgroundColor: Colors.GrayLight
                },
                container: {
                    backgroundColor: Colors.White
                }
            }}>
            <View style={styles.body}>
                {editSheet ? (
                    <>
                        <View style={styles.edit}>
                            {shareShow ? (
                                <>
                                    <TouchableOpacity style={styles.shareView} activeOpacity={0.8} onPress={editCB}>
                                        <FastImage source={require('../../../assets/icons/screens/share_feed.png')} resizeMode="contain" style={styles.leftIcon} tintColor={Colors.Black} />
                                        <Text style={styles.share}>{share}</Text>
                                    </TouchableOpacity>
                                </>
                            ) : null}

                            {hideShow ? (
                                <>
                                    <TouchableOpacity style={styles.shareView} onPress={deleteEventCB} activeOpacity={0.8}>
                                        {deleteEvent ? <FastImage source={require('../../../assets/icons/screens/delete.png')} resizeMode="contain" style={styles.leftIcon} tintColor={Colors.Black} /> : <FastImage source={require('../../../assets/icons/screens/invisible.png')} resizeMode="contain" style={styles.leftIcon} tintColor={Colors.Black} />}
                                        <Text style={styles.share}>{hide}</Text>
                                    </TouchableOpacity>
                                </>
                            ) : null}

                            {reportThis ? (
                                <>
                                    <TouchableOpacity style={styles.shareView} onPress={reportCB} activeOpacity={0.8}>
                                        {editEvent ? <FastImage source={require('../../../assets/icons/screens/edit1.png')} resizeMode="contain" style={styles.leftIcon} tintColor={Colors.Black} /> : <FastImage source={require('../../../assets/icons/screens/info.png')} resizeMode="contain" style={styles.leftIcon} tintColor={Colors.Black} />}
                                        <Text style={styles.share}>{report}</Text>
                                    </TouchableOpacity>
                                </>
                            ) : null}
                            {back ? (
                                <>
                                    <TouchableOpacity style={styles.shareView}>
                                        <Text style={styles.share}>{seeImage}</Text>
                                    </TouchableOpacity>
                                </>
                            ) : null}
                        </View>
                    </>
                ) : null}

                {saveData ? (
                    <>
                        {separatorHeight()}
                        <View style={styles.buttonTrade}>
                            <ActiveButton title="Trade Save Data" onPress={skipButtonCB} />
                        </View>
                    </>
                ) : null}
                {organic ? (
                    <>
                        {separatorHeight()}
                        <View style={{alignItems: 'center'}}>
                            <ActiveButton title="Save" onPress={onSave} />
                        </View>
                    </>
                ) : null}
            </View>
        </RBSheet>
    )
}

const styles = StyleSheet.create({
    body: {
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: Colors.White,
        alignItems: 'center'
    },
    heightContainerButon: {
        width: wp('100%'),
        height: Platform.OS == 'android' ? hp('85') : hp('80')
    },
    bodyOr: {
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: Colors.BackgroundColor
    },
    leftIcon: {
        width: wp('5%'),
        height: wp('5%')
    },
    crossIcon: {
        width: wp('4%'),
        height: hp('4%')
    },
    shareView: {
        width: wp('86%'),
        height: hp('6%'),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.5),
        borderRadius: wp('8'),
        marginTop: hp('1')

        // borderWidth: 1
        // borderWidth: 1
    },
    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,
        marginTop: hp('3%'),
        alignItems: 'center',
        borderRadius: wp('2%'),
        marginTop: hp('10%'),
        shadowColor: Colors.Shadow_Color,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 5,
        paddingVertical: hp('1%')
    },
    share: {
        paddingLeft: wp('3'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    },
    edit: {
        alignItems: 'center',
        paddingTop: hp('1')
    },
    skipButton: {
        width: wp('86%'),
        alignItems: 'flex-end'
    },
    skipText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    }
})

export default EditBottomSheet
