import React, {useState, useEffect} from 'react'
import {Modal, StyleSheet, View, Pressable} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import ActiveButton from './ActiveButton'

const SuccessModal = ({u_id, visible, callBack, descriptionDataCB}) => {
    const [modalVisible, setModalVisible] = useState(visible)

    useEffect(() => {
        setModalVisible(visible)
    }, [visible])
    const closeModal = () => {
        setModalVisible(!modalVisible)
        callBack()
    }

    return (
        <Modal
            animationType="slide"
            animated={true}
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible)
            }}>
            <View style={styles.bottomView}>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <FastImage source={require('../../../assets/icons/screens/oder.png')} style={styles.checkIcon} resizeMode="cover" />
                    </View>
                    <Pressable onPress={() => closeModal()} style={styles.viewIcon}>
                        <FastImage source={require('../../../assets/icons/screens/cross.png')} style={styles.crosIcon} resizeMode="cover" />
                    </Pressable>
                    <ActiveButton title={'Go to Home'} onPress={() => closeModal()} style={styles.button} textStyle={styles.buttonText} />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    bottomView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: wp('100%'),
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    viewIcon: {
        right: wp('2'),
        marginTop: hp('1%'),
        position: 'absolute',
        zIndex: 1
    },
    crosIcon: {
        width: wp('10%'),
        height: wp('10%')
    },
    viewCancel: {
        width: wp('7%'),
        height: wp('7%'),
        borderRadius: wp('3.5')
    },
    container: {
        backgroundColor: Colors.White,
        width: wp('92%'),
        borderRadius: wp('2%'),
        alignItems: 'center',
        paddingBottom: hp('2')
    },
    modalView: {
        backgroundColor: Colors.LightCream_40,
        width: wp('92%'),
        borderRadius: wp('2%')
    },
    imageContainer: {
        width: wp('92%'),
        height: hp('30%'),
        borderTopLeftRadius: wp('2%'),
        borderTopRightRadius: wp('2%'),
        backgroundColor: 'white'
    },
    checkIcon: {
        width: '100%',
        height: '100%',
        borderTopLeftRadius: wp('2%'),
        borderTopRightRadius: wp('2%')
    },
    headingText: {
        paddingTop: hp('2%'),
        color: Colors.White,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        alignSelf: 'center',
        textAlign: 'center'
    },
    subHeading: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        alignSelf: 'center',
        textAlign: 'center',
        marginVertical: hp('1%'),
        width: wp('86%')
    },
    wrapper: {
        flexDirection: 'row',
        width: wp('86%'),
        height: hp('7%'),
        borderWidth: 1.5,
        backgroundColor: Colors.LightCream_60,
        borderColor: Colors.LightCream_60,
        justifyContent: 'space-around',
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: hp('1%')
    },
    okText: {
        width: wp('74%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },

    rightIcon: {
        width: wp('7%'),
        height: wp('7%')
    },
    button: {
        backgroundColor: Colors.White,
        borderColor: Colors.BorderGrey,
        width: wp('40%'),
        alignSelf: 'center',
        marginTop: hp('1%'),
        shadowOpacity: 0,
        borderWidth: wp('0.3')
    },
    buttonText: {
        color: Colors.HTextColor,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    }
})
export default SuccessModal
