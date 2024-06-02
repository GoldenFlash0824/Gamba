import React, {useEffect, useRef, useState} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Platform, PermissionsAndroid} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
import FastImage from 'react-native-fast-image'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import ActiveButton from '../../../components/components/common/ActiveButton'
import DisableButtonDark from '../../../components/components/common/DisableButtonDark'
import InputWithLabels from '../../../components/components/common/InputWithLabels'
import ValidateInput from '../../../utils/ValidateInput'
import SmallPicker from '../../../components/components/common/SmallPicker'
import PhotoOptionsBottomSheet from '../../../components/components/common/PhotoOptionsBottomSheet'
import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const TradeCard = ({item, onDelete, index}) => {
    return (
        <View style={styles.itemConatiner} key={index.toString()}>
            <View style={styles.midWrapper}>
                <Text style={styles.detailText}>{`${item.title ? item.title : item.trade_title} \n${item.quantity ? item.quantity : item.trade_quantity} ${item.unit ? item.unit : item.trade_unit}`}</Text>
            </View>
            <TouchableOpacity style={styles.rightWrapper} onPress={onDelete} activieOpacity={0.8}>
                <FastImage source={require('../../../assets/icons/screens/delete.png')} style={styles.delIcon} tintColor={Colors.TextGray} />
            </TouchableOpacity>
        </View>
    )
}
const TradeSheetInputs = ({onSaveData, tradeDataArray, errorTextTradeD}) => {
    const [tradingData, setTradingData] = useState(tradeDataArray.length > 0 ? tradeDataArray : [])

    const [tradeData, setTradeData] = useState(false)

    const [productWith, setProductWith] = useState('')
    const [quantityTrade, setQuantityTrade] = useState('1')
    const [trade, setTrade] = useState('Kg')

    const [focusProductWith, setFocusProductWith] = useState(false)
    const [productWithError, setProductWithError] = useState(false)
    const [errorTextProductWith, setErrorTextProductWith] = useState(null)

    const [focusQuantityTrade, setFocusQuantityTrade] = useState(false)
    const [quantityErrorTrade, setQuantityErrorTrade] = useState(false)
    const [errorTextQuantityTrade, setErrorTextQuantityTrade] = useState(null)

    const [pickerVisibleTrade, setPickerVisibleTrade] = useState(false)

    const photoOptionsSheetRef = useRef()

    useEffect(() => {
        setTradeData(tradeDataArray)
    }, [tradeDataArray])

    useEffect(() => {
        errorTextTradeD ? (setErrorTextProductWith(ValidateInput('productName', productWith) ? ValidateInput('productName', productWith) : null), setProductWithError(ValidateInput('productName', productWith) ? true : false)) : (setErrorTextProductWith(null), setProductWithError(null))
    }, [errorTextTradeD])
    const submitProductWith = () => {
        const error = ValidateInput('productName', productWith)
        setErrorTextProductWith(error ? error : null)
        setProductWithError(error ? true : false)
        setFocusProductWith(false)
    }

    const submitQuantityTrade = () => {
        if (quantityTrade == 0) {
            setErrorTextQuantityTrade('Min value 1 is required')
            setQuantityErrorTrade(true)
            setFocusQuantityTrade(false)
        } else {
            const error = ValidateInput('quantity', quantityTrade)
            setErrorTextQuantityTrade(error ? error : null)
            setQuantityErrorTrade(error ? true : false)
            setFocusQuantityTrade(false)
        }
    }

    const onChangeQuantityTrade = (text) => {
        let reg = new RegExp(`^[0-9]{1,45}$`)
        if (text.length > 0) {
            if (reg.test(text)) {
                setQuantityTrade(text)
            }
        } else {
            setQuantityTrade(text)
        }
    }

    const tradeVisibleHandler = () => {
        setPickerVisibleTrade(!pickerVisibleTrade)
    }
    const tradeSelectionHandler = (item) => {
        setPickerVisibleTrade(false)
        setTrade(item.name)
    }

    const resetAllFocus = () => {
        setFocusProductWith(false)
        setFocusQuantityTrade(false)
    }
    const onAdd = () => {
        let _tradeData = []

        if (productWith == '') {
            const error = ValidateInput('productName', productWith)
            setErrorTextProductWith(error ? error : null)
            setProductWithError(error ? true : false)
            setFocusProductWith(false)
        } else if (trade != '' && productWith != '' && quantityTrade != '' && quantityTrade != 0) {
            setErrorTextProductWith(null)
            setProductWithError(false)
            setFocusProductWith(false)
            _tradeData.push({trade_title: productWith, trade_quantity: quantityTrade, trade_unit: trade, trade_image: ''})
            setProductWith('')
            setTrade('Kg')
            setQuantityTrade('1')
            setTradingData(tradingData.concat(_tradeData))
            onSaveData(tradingData.concat(_tradeData))
        }
    }

    const removeHandler = (item, index) => {
        tradingData.splice(index, 1)
        setTradingData(tradingData)
        onSaveData(tradingData)
        setTradeData(!tradeData)
    }

    return (
        <View style={styles.container}>
            {/* <View style={styles.headerContainer}>
                <TouchableOpacity activeOpacity={0.8} style={styles.leftContainer}>
                    <FastImage source={require('../../../assets/icons/screens/left.png')} style={styles.backIcon} tintColor={Colors.Black} />
                </TouchableOpacity>
                <View activeOpacity={0.8} style={styles.midContainer}>
                    <Text style={styles.titleText}>{'Trade Screen'}</Text>
                </View>
            </View> */}

            <View style={styles.tradeInputs}>
                {tradingData.length < 3 && (
                    <View style={styles.caontainerTrade}>
                        <InputWithLabels
                            style={styles.quantityInputTrade}
                            textError={styles.errorText}
                            showAstaric={true}
                            showLabelCB={true}
                            value={productWith}
                            showPlaceHolder={true}
                            placeholderC="Trade with"
                            placeholderInner={'Product name'}
                            isError={productWithError}
                            isFocus={focusProductWith}
                            onFocus={() => {
                                resetAllFocus()
                                setFocusProductWith(true)
                            }}
                            onBlur={submitProductWith}
                            errorText={errorTextProductWith}
                            onChangeText={(text) => setProductWith(text.trimStart())}
                        />
                        {/* <View style={{flexDirection: 'row', width: wp('86'), justifyContent: 'space-between'}}> */}
                        <InputWithLabels
                            style={styles.quantityInput}
                            showLabelCB={true}
                            value={quantityTrade}
                            showAstaric={true}
                            textError={styles.errorText}
                            placeholder="Qt"
                            keyboardType={'decimal-pad'}
                            secure={false}
                            isError={quantityErrorTrade}
                            onBlur={submitQuantityTrade}
                            isFocus={focusQuantityTrade}
                            onFocus={() => {
                                resetAllFocus()
                                setFocusQuantityTrade(true)
                            }}
                            errorText={errorTextQuantityTrade}
                            onChangeText={(text) => onChangeQuantityTrade(text)}
                        />
                        {/* <View style={{width: wp('30%')}}> */}
                        <SmallPicker
                            data={[
                                {name: 'Unit', id: 0},
                                {name: 'Kilo', id: 1},
                                {name: 'Pound', id: 3},
                                {name: 'Dozen', id: 4},
                                {name: 'Tray', id: 5}
                            ]}
                            showSteric={true}
                            title={'Sold by'}
                            titleTextStyle={{width: wp('14%'), fontSize: Typography.FONT_SIZE_12}}
                            visible={pickerVisibleTrade}
                            onPress={tradeVisibleHandler}
                            pickerHandler={tradeSelectionHandler}
                            selectedItem={trade}
                            style={{width: wp('30%'), height: hp('6%')}}
                            styleDropDown={{width: wp('30%'), position: 'absolute', marginTop: Platform.OS === 'ios' ? hp('10') : hp(9), zIndex: 100}}
                            listContainerStyle={{width: wp('26%')}}
                        />
                        {/* </View> */}
                    </View>
                )}
                {tradingData.length < 3 && (
                    <TouchableOpacity style={styles.addButton} onPress={() => onAdd()} activeOpacity={0.8}>
                        <Text style={styles.addMore}>{`Add(${tradingData.length}/3)`}</Text>
                    </TouchableOpacity>
                )}
                {tradingData.map((data, index) => {
                    return <TradeCard item={data} index={index} onDelete={() => removeHandler(data, index)} key={index?.toString()} />
                })}
            </View>

            {/* {tradingData.length > 0 ? <ActiveButton title={'Continue'} onPress={onSave} /> : <DisableButtonDark title={'Continue'} />} */}
            <PhotoOptionsBottomSheet setRef={photoOptionsSheetRef} title={'Add Photo'} skipTitle={'cancel'} accessAllowGallery={() => checkPermissions('photo')} accessAllowCamera={() => checkPermissions('camera')} skipButtonCB={() => photoOptionsSheetRef.current.close()} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.White,
        alignItems: 'center'

        // height: hp('10%')
    },
    headerContainer: {
        // marginTop: Platform.OS == 'android' ? hp('0') : hp('4'),
        width: wp('96'),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        height: hp('8')
    },
    addButton: {
        width: wp(85),
        alignItems: 'flex-end',
        zIndex: -1,
        marginTop: hp('.5')
    },

    backIcon: {
        width: wp('6%'),
        height: wp('6%')
    },
    leftContainer: {
        width: wp('32')
    },

    midContainer: {
        minWidth: wp('32'),
        alignItems: 'center'
    },
    rightContainer: {
        width: wp('32'),
        alignItems: 'center'
    },
    titleText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    viewInput: {
        width: wp('86%'),
        height: hp('6')
        // marginVertical: hp(0.5)
    },
    quantityInput: {
        width: wp('15%'),
        height: hp('6'),
        backgroundColor: Colors.White

        // marginVertical: hp(0.5)
    },
    quantityInputTrade: {
        width: wp('40%'),
        height: hp('6'),
        backgroundColor: Colors.White
    },
    errorText: {
        color: Colors.ErrorText,
        fontSize: Typography.FONT_SIZE_9,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    tradeInputs: {
        alignItems: 'center',
        marginTop: hp('1')
        // height: Platform.OS == 'android' ? hp('82') : hp('78')
    },
    caontainerTrade: {
        width: wp('92'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    emptyContaoiner: {
        width: wp('26%'),
        height: hp('15%'),
        alignItems: 'center',
        backgroundColor: Colors.White,
        borderColor: Colors.BorderGrey,
        borderWidth: wp('0.3'),
        borderRadius: wp('2'),
        justifyContent: 'center'
    },
    icons: {
        width: wp('10%'),
        height: wp('10%')
    },
    addMore: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    itemConatiner: {
        width: wp('92'),
        borderWidth: wp(0.3),
        borderRadius: wp('8'),
        borderColor: Colors.BorderGrey,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: hp('1'),
        marginTop: hp('1.5'),
        zIndex: -1,
        backgroundColor: Colors.White
    },
    leftWrapper: {
        width: wp('16'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemImage: {
        width: wp('14'),
        height: wp('15'),
        borderRadius: wp('2')
    },
    midWrapper: {
        width: wp('68'),
        justifyContent: 'flex-start'
    },
    rightWrapper: {
        width: wp('12'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    delIcon: {
        width: wp('6'),
        height: wp('6')
    },
    detailText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    }
})

export default TradeSheetInputs
