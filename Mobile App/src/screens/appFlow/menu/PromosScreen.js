import React, {useRef, useState} from 'react'
import {ScrollView, StyleSheet, View, FlatList, Text, TouchableOpacity, TextInput} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Header from '../../../components/components/common/Header'
import ActiveButton from '../../../components/components/common/ActiveButton'
import InputWithLabels from '../../../components/components/common/InputWithLabels'
import {getHeaders, separatorWidth, separatorHeight} from '../../../utils/helpers'
import ValidateInput from '../../../utils/ValidateInput'

const PromosScreen = ({navigation}) => {
    const [productName, setProductName] = useState('')
    const [focusProductName, setFocusProductName] = useState(false)
    const [productNameError, setProductNameError] = useState(false)
    const [errorTextProductName, setErrorTextProductName] = useState(null)

    const submitProductName = () => {
        const error = ValidateInput('productName', productName)
        setErrorTextProductName(error ? error : null)
        setProductNameError(error ? true : false)
        setFocusProductName(false)
        // checkIsValidRequest( productName)
        // if (!error && !isValidRequest) {
        //     setFocusPrice(true)
        // }
    }

    const resetAllFocus = () => {
        setFocusProductName(false)
    }

    return (
        <View style={styles.body}>
            <Header
                back={true}
                backCB={() => {
                    navigation.goBack()
                }}
            />
            {/* <View style={styles.promosView}>
                <Text style={styles.promosText}> 10% discount on selected seller.</Text>
            </View> */}

            <View style={styles.imageContainer}>
                <FastImage source={require('../../../assets/icons/screens/sticker.png')} resizeMode="cover" style={styles.promoImage} />
            </View>
            <View style={styles.promoContainer}>
                <Text style={styles.title}> You do not have coupons</Text>
                <Text style={styles.titleView}> Go hunt for vouchers at laundary Voucher right away</Text>
                <View style={styles.buttonContainer}>
                    <InputWithLabels
                        style={styles.inputViewPrice}
                        showLabelCB={false}
                        value={productName}
                        placeholder="Product Name"
                        placeholderInner={'Enter the Voucher'}
                        showPlaceHolder={true}
                        isError={productNameError}
                        isFocus={focusProductName}
                        onFocus={() => {
                            resetAllFocus()
                            setFocusProductName(true)
                        }}
                        onBlur={submitProductName}
                        errorText={errorTextProductName}
                        onChangeText={(text) => setProductName(text.trimStart())}
                    />
                    {separatorHeight()}
                    <ActiveButton title="Submit" style={{width: wp('80%')}} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.BackgroundColor,
        width: wp('100%'),
        height: hp('100%')
    },
    imageContainer: {
        width: wp('90%'),
        alignItems: 'center',
        alignSelf: 'center'
    },
    promoImage: {
        width: wp('67%'),
        height: hp('27%'),
        marginTop: hp('8%')
    },
    inputViewPrice: {
        width: wp('80%'),
        height: hp('6.5')
    },
    title: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    buttonContainer: {
        alignSelf: 'center',
        padding: wp('3%')
    },
    titleView: {
        width: wp('58%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        textAlign: 'center',
        marginTop: hp('1%')
    },
    promoContainer: {
        width: wp('90%'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: hp('5%'),
        backgroundColor: Colors.White,
        borderRadius: wp('2%'),
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
    promosView: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    promosText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontWeight: Typography.FONT_FAMILY_REGULAR,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    }
})

export default PromosScreen
