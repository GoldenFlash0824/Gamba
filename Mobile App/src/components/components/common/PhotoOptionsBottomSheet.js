import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import RBSheet from 'react-native-raw-bottom-sheet'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const PhotoOptionsBottomSheet = ({setRef, title, description, continueTitle, skipTitle, accessAllowCamera, accessAllowGallery, skipButtonCB, isActive = true, isOpen, onClose, closed, AddEventCreate = false, callBack, pickerCB, data}) => {
    return (
        <RBSheet
            animationType={'slide'}
            ref={setRef}
            height={hp('40%')}
            closeOnDragDown={true}
            closeOnPressMask={true}
            closeDuration={100}
            openDuration={100}
            customStyles={{
                mask: {
                    backgroundColor: Colors.DarkPepper_80
                },
                draggableIcon: {
                    backgroundColor: Colors.DarkPepper_80
                },
                container: {
                    backgroundColor: Colors.White
                }
            }}>
            <>
                {AddEventCreate ? (
                    <>
                        <TouchableOpacity style={styles.bottomView} activeOpacity={0.8} onPress={callBack}>
                            <View style={styles.dropDownList}>
                                {data.map((item, ind) => {
                                    return (
                                        <TouchableOpacity style={styles.listContainer} key={ind} onPress={() => pickerCB(item)} activeOpacity={0.8}>
                                            <FastImage source={item.image} resizeMode="contain" style={styles.leftIcon} tintColor={Colors.HTextColor} />
                                            <Text style={styles.listText}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.skipButton} onPress={() => skipButtonCB()} activeOpacity={0.8}>
                            <Text style={styles.skipText}>{skipTitle}</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <View>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.description}>{description}</Text>
                        </View>
                        <View style={styles.imgSelectContainer}>
                            <TouchableOpacity onPress={() => accessAllowCamera()} activeOpacity={0.8}>
                                <View style={styles.imageSelector}>
                                    <FastImage source={require('../../../assets/icons/screens/camera.png')} tintColor={Colors.DarkPepper_60} resizeMode="contain" style={styles.iconStyle} />
                                    <Text style={styles.text}>Take Photo</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.imageSelector} onPress={() => accessAllowGallery()} activeOpacity={0.8}>
                                <FastImage source={require('../../../assets/icons/screens/gallery.png')} tintColor={Colors.DarkPepper_60} resizeMode="contain" style={styles.iconStyle} />
                                <Text style={styles.text}>From Library</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.skipButton} onPress={() => skipButtonCB()} activeOpacity={0.8}>
                            <Text style={styles.skipText}>{skipTitle}</Text>
                        </TouchableOpacity>
                    </>
                )}
            </>
        </RBSheet>
    )
}

const styles = StyleSheet.create({
    title: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        alignSelf: 'center'
    },
    bottomView: {
        backgroundColor: Colors.White
    },
    dropDownList: {
        width: wp('92%'),
        marginTop: Platform.OS == 'android' ? hp('5') : hp('3'),
        backgroundColor: Colors.White,
        paddingHorizontal: wp('2'),
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    listContainer: {
        height: hp('7'),
        width: wp('86%'),
        backgroundColor: Colors.White,

        borderBottomWidth: wp('0.2'),
        borderBottomColor: Colors.BorderGrey,
        alignItems: 'center',
        flexDirection: 'row'
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
        color: Colors.Description
    },
    text: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13
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

export default PhotoOptionsBottomSheet
