import React, {useEffect, useState} from 'react'
import {Platform, StyleSheet, Text, TouchableOpacity, View, ScrollView, Pressable} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import axios from 'axios'
import {useSelector} from 'react-redux'
import moment from 'moment'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import ActiveButton from '../../../components/components/common/ActiveButton'
import DisableButton from '../../../components/components/common/DisableButton'
import InputWithLabels from '../../../components/components/common/InputWithLabels'
import Loader from '../../../components/components/common/Spinner'
import MultipleSelectPicker from '../../../components/components/common/MultipleSelectPicker'
import ToggelButton from '../../../components/components/common/ToggleButton'
import PickerDate from '../../../components/components/common/PickerDate'
import {separatorHeight, getHeaders} from '../../../utils/helpers'
import ValidateInput from '../../../utils/ValidateInput'
import ShowAlert from '../../../components/components/common/ShowAlert'
import SmallPicker from '../../../components/components/common/SmallPicker'

const TradeInfo = (props) => {
    const {userData} = useSelector((state) => state.user)
    const {chemicalData} = useSelector((state) => state.user)

    const [loading, setLoading] = useState(false)
    const [distance, setDistance] = useState('')

    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [daysOrWeeks, setDaysOrWeeks] = useState('Days')
    const [numbers, setNumbers] = useState('1')

    const [quantity, setQuantity] = useState('1')
    const [isOrganic, setIsOrganic] = useState(false)

    const [focusQuantity, setFocusQuantity] = useState(false)
    const [focusNumbers, setFocusNumbers] = useState(false)
    const [focusdescription, setFocusDescription] = useState(false)
    const [focusDistance, setFocusDistance] = useState(false)

    const [descriptionError, setDescriptionError] = useState(false)
    const [numbersError, setNumbersError] = useState(false)
    const [distnaceError, setDistanceError] = useState(false)
    const [quantityError, setQuantityError] = useState(false)
    const [chemcalIdError, setChemcalIdError] = useState(false)

    const [errorTextDescription, setErrorTextDescription] = useState(null)
    const [errorTextDistance, setErrorTextDistance] = useState(null)
    const [errorTextStartDate, setErroTextStartDate] = useState(null)
    const [errorTextEndDate, setErroTextEndDate] = useState(null)
    const [errorTextQuantity, setErrorTextQuantity] = useState(null)
    const [errorTextNumbers, setErrorTextNumbers] = useState(null)

    const [pickerVisibleWeight, setPickerVisibleWeight] = useState(false)

    const [isPickUp, setIsPickUp] = useState(false)
    const [isDelivery, setIsDelivery] = useState(false)

    const [open, setOpen] = useState(false)
    const [openTo, setOpenTo] = useState(false)

    const [openChemicals, setOpenChemicals] = useState(false)
    const [chemicalsValue, setChemicalsValue] = useState([])
    const [chemicalsList, setChemicalsList] = useState(chemicalData)
    useEffect(() => {
        const func = async () => {
            if (props.productDataCB) {
                await updateStatesHandler(props)
            }
        }
        func()
    }, [])
    const updateStatesHandler = async (prop) => {
        let _addedChemical = []
        setNumbers(props.productDataCB.allow_to_0rder_advance ? props.productDataCB.allow_to_0rder_advance?.toString() : '1')
        setDaysOrWeeks(props.productDataCB.allow_to_0rder ? props.productDataCB.allow_to_0rder : 'Days')
        setStartDate(props.productDataCB.available_from ? new Date(props.productDataCB.available_from) : new Date())
        setEndDate(props.productDataCB.available_to ? new Date(props.productDataCB.available_to) : new Date())
        setQuantity(props.productDataCB.quantity ? props.productDataCB.quantity.toString() : '1')
        setIsPickUp(props.productDataCB.is_pickUp ? props.productDataCB.is_pickUp : false)
        setIsDelivery(props.productDataCB.is_delivery ? props.productDataCB.is_delivery : false)
        setIsOrganic(props.productDataCB.is_organic == null ? false : props.productDataCB.is_organic)
        setDescription(props.productDataCB.caption ? props.productDataCB.caption : '')
        setDistance(props.productDataCB.distance ? props.productDataCB.distance : '')
        if (props.productDataCB.chemical_data) {
            for (i = 0; i < props.productDataCB.chemical_data.length; i++) {
                props.productDataCB.chemical_data[i].chemical_data_detail
                _addedChemical.push(props.productDataCB.chemical_data[i].chemical_data_detail.title)
            }
            setChemicalsValue(_addedChemical)
        }
    }
    const submitDescription = () => {
        const error = ValidateInput('description', description)
        setErrorTextDescription(error ? error : null)
        setDescriptionError(error ? true : false)
        setFocusDescription(false)
    }

    const submitDistance = () => {
        if (distance == 0) {
            setErrorTextDistance('Required')
            setDistanceError(true)
            setFocusDistance(false)
        } else {
            const error = ValidateInput('distance', distance)
            setErrorTextDistance(error ? error : null)
            setDistanceError(error ? true : false)
            setFocusDistance(false)
        }
    }

    const submitQuantity = () => {
        if (quantity == 0) {
            setErrorTextQuantity('Quantity is required')
            setQuantityError(true)
            setFocusQuantity(false)
        } else {
            const error = ValidateInput('quantity', quantity)
            setErrorTextQuantity(error ? error : null)
            setQuantityError(error ? true : false)
            setFocusQuantity(false)
        }
    }

    const submitNumbers = () => {
        if (numbers == 0) {
            setErrorTextNumbers('Required')
            setNumbersError(true)
            setFocusNumbers(false)
        } else {
            const error = ValidateInput('numbers', numbers)
            setErrorTextNumbers(error ? error : null)
            setNumbersError(error ? true : false)
            setFocusNumbers(false)
        }
    }
    const onChangeNumbers = (text) => {
        let reg = new RegExp(`^[0-9]{1,45}$`)
        if (text.length > 0) {
            if (reg.test(text)) {
                setNumbers(text)
            }
        } else {
            setNumbers(text)
        }
    }
    const onChangeDistance = (text) => {
        let reg = new RegExp(`^[0-9]{1,45}$`)
        if (text.length > 0) {
            if (reg.test(text)) {
                setDistance(text.trimStart())
            }
        } else {
            setDistance(text.trimStart())
        }
    }
    const toggleDatePicker = (type) => {
        setOpen(true)
    }

    const onChangeQuantity = (text) => {
        let reg = new RegExp(`^[0-9]{1,45}$`)
        if (text.length > 0) {
            if (reg.test(text)) {
                setQuantity(text)
            }
        } else {
            setQuantity(text)
        }
    }

    const organicHandler = (newIsOn) => {
        setIsOrganic(newIsOn)
        // checkIsValidRequest(daysOrWeeks, numbers, endDate, startDate, quantity, isOrganic, chemicalsValue, description)

        {
            newIsOn ? ShowAlert({type: 'Info', description: "You've selected organic, normally organic products are offered without chemical sprayed, if it is organic please uncheck the chemical"}) : null
        }
    }
    const changeStartDHandler = (d) => {
        if (endDate == '') {
            setStartDate(d)
            setOpen(false)
        } else {
            const _dS = moment(d).format('MM-DD-YYYY')
            const _dE = moment(endDate).format('MM-DD-YYYY')
            const _timeS = moment(d).format('hh:mm A')
            const _timeE = moment(endDate).format('hh:mm A')
            if (_dE >= _dS && (_dE > _dS ? true : _timeS < _timeE)) {
                setStartDate(d)
                setOpen(false)
                setErroTextStartDate(null)
                setErroTextEndDate(null)
            } else {
                setStartDate(d)
                setOpen(false)
                setErroTextStartDate('Start date should be smaller')
                setIsValidRequest(false)
            }
        }
    }

    const toggleDatePickerTo = (type) => {
        setOpenTo(true)
    }
    const changeEndDHandler = (d) => {
        const _dS = moment(startDate).format('MM-DD-YYYY')
        const _dE = moment(d).format('MM-DD-YYYY')
        const _timeS = moment(startDate).format('hh:mm A')
        const _timeE = moment(d).format('hh:mm A')
        if (_dE >= _dS && (_dE > _dS ? true : _timeS < _timeE)) {
            setEndDate(d)
            setOpenTo(false)
            setErroTextEndDate(null)
            setErroTextStartDate(null)
        } else {
            setEndDate(d)
            setOpenTo(false)
            setErroTextEndDate('End date should be greater')
            setIsValidRequest(false)
        }
    }

    const resetAllFocus = () => {
        setFocusDistance(false)
        setFocusDescription(false)
        setFocusQuantity(false)
        setFocusNumbers(false)
    }

    const checkIsValidRequest = (_numbers, __endDate, _startDate, quantity, _isOrganic, _chemicalsValue, description) => {
        const _dS = moment(_startDate).format('MM-DD-YYYY')
        const _dE = moment(__endDate).format('MM-DD-YYYY')
        if (_numbers != '' && _numbers != 0 && (_dE == _dS ? true : _dE >= _dS) && (props.productDataCB?.is_donation || props.productDataCB?.is_trade ? true : !ValidateInput('quantity', quantity)) && (!_isOrganic ? _chemicalsValue.length > 0 : true) && !ValidateInput('description', description) && (isDelivery ? !ValidateInput('distance', distance) : true)) {
            setIsValidRequest(true)
            setErrorTextQuantity(null)
            setQuantityError(false)
            setFocusQuantity(false)
            setErrorTextDescription(null)
            setDescriptionError(false)
            setFocusDescription(false)
            return true
        } else {
            _numbers == '' ? (setErrorTextNumbers('Required'), setNumbersError(true), setFocusNumbers(false)) : (setErrorTextNumbers(null), setNumbersError(false), setFocusNumbers(false))
            quantity == '' ? (props.productDataCB?.is_donation || props.productDataCB?.is_trade ? (setErrorTextQuantity('Quantity is required'), setQuantityError(true), setFocusQuantity(false)) : (setErrorTextQuantity(null), setQuantityError(false), setFocusQuantity(false))) : (setErrorTextQuantity(null), setQuantityError(false), setFocusQuantity(false))
            description == '' ? (setErrorTextDescription('Description is required'), setDescriptionError(true), setFocusDescription(false)) : (setErrorTextDescription(null), setDescriptionError(false), setFocusDescription(false))
            !_isOrganic && _chemicalsValue.length < 1 ? setChemcalIdError(true) : setChemcalIdError(false)
            isDelivery && distance == '' ? (setErrorTextDistance('Required'), setDistanceError(true), setFocusDistance(false)) : (setErrorTextDistance(null), setDistanceError(false), setFocusDistance(false))
            return false
        }
    }

    const allStateResetHandler = () => {
        resetAllFocus()
        setIsValidRequest(false)
        setDescriptionError(false)
        setQuantityError(false)
        setAllowCustomerError(false)
        setErrorTextDescription(null)
    }

    const postHandler = async () => {
        const headers = getHeaders(userData.auth_token)
        let url = props.productDataCB?.id ? `user/product/update_product/${props.productDataCB.id}` : 'user/product/add_new_product'
        const result = checkIsValidRequest(numbers, endDate, startDate, quantity, isOrganic, chemicalsValue, description)
        const matchingIds = chemicalData.reduce((ids, item) => {
            if (chemicalsValue.includes(item.value)) {
                ids.push(item.id)
            }
            return ids
        }, [])
        const goodsData = {
            is_donation: props.productDataCB?.is_donation,
            allow_per_person: props.productDataCB?.is_allowPerson != '' ? props.productDataCB?.is_allowPerson : 1,
            is_trade: props.productDataCB?.is_trade,
            trade_with: props.productDataCB?.trade_with,
            images: props.productDataCB?.images,
            category_id: props.productDataCB?.category_id,
            name: props.productDataCB?.name,
            unit: props.productDataCB?.unit,
            price: props.productDataCB?.price,
            discount: props.productDataCB?.discount,
            available_from: startDate,
            available_to: endDate,
            is_delivery: isDelivery,
            is_pickup: isPickUp,
            distance: distance,
            quantity: props.productDataCB?.is_donation || props.productDataCB?.is_trade ? 0 : quantity,
            is_organic: isOrganic,
            chemical_id: matchingIds,
            caption: description,
            allow_to_0rder: props.productDataCB?.is_donation ? null : daysOrWeeks,
            allow_to_0rder_advance: props.productDataCB?.is_donation ? 1 : numbers,
            none: false
        }
        if (result) {
            // console.log('reult', goodsData)
            setLoading(true)
            try {
                await axios
                    .post(url, goodsData, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            setLoading(false)
                            ShowAlert({type: 'success', description: response.data.message})
                            setTimeout(() => {
                                props.onCloseCB()
                            }, 200)
                        } else {
                            setLoading(false)
                            ShowAlert({type: 'error', description: response.data.message})
                        }
                    })
                    .catch((error) => {
                        setLoading(false)
                        ShowAlert({type: 'error', description: error.message})
                    })
            } catch (e) {
                setLoading(false)
                ShowAlert({type: 'error', description: e.message})
            }
        } else {
            // console.log('else', goodsData)
        }
    }

    const hoursSelectionHandler = (item) => {
        setPickerVisibleWeight(false)
        setDaysOrWeeks(item.name)
    }

    const hoursVisibleHandler = () => {
        setPickerVisibleWeight(!pickerVisibleWeight)
    }

    const infoHandler = () => {
        ShowAlert({type: 'Info', description: 'Set this up if you allow customers to order your products day(s) or week(s) in advance; otherwise, leave it alone.'})
    }

    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                <View style={styles.backgroundContainer}>
                    {props.productDataCB?.is_donation ? (
                        false
                    ) : (
                        <>
                            <View style={styles.containerAllow}>
                                <Text style={styles.remember}>
                                    {'Allow to order in advance'}
                                    <Pressable style={styles.pressAble} onPress={infoHandler}>
                                        <Text style={styles.remember}>{'[!]'}</Text>
                                    </Pressable>
                                </Text>
                            </View>

                            <View style={styles.checkHourDays}>
                                <InputWithLabels
                                    style={styles.inputViewPrice}
                                    textError={styles.errorText}
                                    showLabelCB={false}
                                    value={numbers}
                                    placeholder="Allow to order"
                                    keyboardType={'decimal-pad'}
                                    secure={false}
                                    isError={numbersError}
                                    onBlur={submitNumbers}
                                    isFocus={focusNumbers}
                                    onFocus={() => {
                                        resetAllFocus()
                                        setFocusNumbers(true)
                                    }}
                                    errorText={errorTextNumbers}
                                    onChangeText={(text) => onChangeNumbers(text)}
                                />

                                <SmallPicker
                                    data={[
                                        {name: 'Days', id: 0},
                                        {name: 'Weeks', id: 1}
                                    ]}
                                    titleTextStyle={styles.titleTextStyleC}
                                    visible={pickerVisibleWeight}
                                    onPress={hoursVisibleHandler}
                                    pickerHandler={hoursSelectionHandler}
                                    selectedItem={daysOrWeeks}
                                    style={styles.selectedAllow}
                                    styleDropDown={styles.dropDownS}
                                    listContainerStyle={styles.listContainerStyleH}
                                />
                            </View>
                        </>
                    )}

                    <View style={styles.textProducts}>
                        <Text style={styles.remember}>{'Product(s) Available'}</Text>
                    </View>

                    <View style={styles.fromPickerConatiner}>
                        <Text style={styles.remember}>{'From'}</Text>
                        <PickerDate
                            onPress={toggleDatePicker}
                            open={open}
                            modeDate={true}
                            mode={'date'}
                            minimumDate={new Date()}
                            selectedDate={startDate}
                            handleDateChange={changeStartDHandler}
                            style={styles.pickerDateStyle}
                            styleErrorText={styles.pickerStyleErrorText}
                            stylePicker={styles.stylePickerD}
                            onCancel={() => {
                                setOpen(false)
                            }}
                            errorText={errorTextStartDate}
                        />
                    </View>

                    <View style={styles.fromPickerConatiner}>
                        <Text style={styles.remember}>{'Ends to'}</Text>
                        <PickerDate
                            onPress={toggleDatePickerTo}
                            style={styles.pickerDateStyle}
                            stylePicker={styles.stylePickerD}
                            styleErrorText={styles.pickerStyleErrorText}
                            minimumDate={new Date()}
                            open={openTo}
                            modeDate={true}
                            mode={'date'}
                            selectedDate={endDate}
                            handleDateChange={changeEndDHandler}
                            onCancel={() => {
                                setOpenTo(false)
                            }}
                            errorText={errorTextEndDate}
                        />
                    </View>

                    <View style={styles.deliveryContainer}>
                        <View style={styles.rememberContainerPickUp}>
                            <TouchableOpacity onPress={() => setIsPickUp(!isPickUp)} activeOpacity={0.8}>
                                {isPickUp ? <FastImage source={require('../../../assets/icons/screens/checked.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.MainThemeColor} /> : <FastImage source={require('../../../assets/icons/screens/unchecked.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.MainThemeColor} />}
                            </TouchableOpacity>
                            <Text style={styles.remember}>Pick-Up</Text>
                        </View>
                        <View style={styles.checkBoxContainerType}>
                            <View style={styles.rememberContainer}>
                                <TouchableOpacity onPress={() => setIsDelivery(!isDelivery)} activeOpacity={0.8}>
                                    {isDelivery ? <FastImage source={require('../../../assets/icons/screens/checked.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.MainThemeColor} /> : <FastImage source={require('../../../assets/icons/screens/unchecked.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.MainThemeColor} />}
                                </TouchableOpacity>
                                <Text style={styles.remember}>Delivery</Text>
                            </View>
                        </View>
                        {separatorHeight()}
                        {isDelivery && (
                            <InputWithLabels
                                showLabelCB={true}
                                value={distance}
                                placeholder="EDelivery Distance"
                                isError={distnaceError}
                                isFocus={focusDistance}
                                onFocus={() => {
                                    resetAllFocus()
                                    setFocusDistance(true)
                                }}
                                onBlur={submitDistance}
                                errorText={errorTextDistance}
                                onChangeText={(text) => onChangeDistance(text)}
                                style={styles.distanceStyle}
                                editable={isDelivery ? true : false}
                                keyboardType={'decimal-pad'}
                            />
                        )}
                    </View>
                    {isDelivery ? separatorHeight() : false}
                    {separatorHeight()}
                    {/* change here */}
                    {props.productDataCB?.is_donation || props.productDataCB?.is_tradenull ? null : (
                        <View style={styles.qunatityWithPriceC}>
                            <InputWithLabels
                                style={styles.inputViewCQ}
                                textError={styles.errorText}
                                showLabelCB={true}
                                value={quantity}
                                placeholder="Quantity Available"
                                keyboardType={'decimal-pad'}
                                secure={false}
                                isError={quantityError}
                                onBlur={submitQuantity}
                                isFocus={focusQuantity}
                                onFocus={() => {
                                    resetAllFocus()
                                    setFocusQuantity(true)
                                }}
                                errorText={errorTextQuantity}
                                onChangeText={(text) => onChangeQuantity(text)}
                            />
                        </View>
                    )}
                    {/* {console.log('==', chemcalIdError)} */}
                    <ToggelButton text={'Organic'} isOn={isOrganic} handleToggle={organicHandler} />
                    <MultipleSelectPicker open={openChemicals} value={chemicalsValue} items={chemicalsList} setOpen={isOrganic ? () => null : (value) => setOpenChemicals(value)} setValue={setChemicalsValue} setItems={chemicalsList} />
                    {chemcalIdError && chemicalsValue.length < 1 && <Text style={styles.errorTextH}>{'Chemcal is required'}</Text>}
                    {separatorHeight()}
                    {separatorHeight()}
                    <InputWithLabels
                        showLabelCB={true}
                        value={description}
                        placeholder={'Caption (upto 150 words)'}
                        placeholderInner={'Information about your product to help people understand it better'}
                        showPlaceHolder={true}
                        secure={false}
                        isError={descriptionError}
                        onBlur={submitDescription}
                        isFocus={focusdescription}
                        onFocus={() => {
                            resetAllFocus()
                            setFocusDescription(true)
                        }}
                        errorText={errorTextDescription}
                        autoCapitalize="none"
                        onChangeText={(text) => setDescription(text)}
                        multiline={true}
                        maxHeight={130}
                        minHeight={110}
                        style={{textAlignVertical: 'top'}}
                    />
                    {separatorHeight()}
                </View>
            </ScrollView>
            <View style={styles.buttonConatiner}>
                <ActiveButton title={'Next 3/3'} onPress={postHandler} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width: wp('100'),
        flex: 1,
        backgroundColor: Colors.BackgroundColor,
        alignItems: 'center'
    },
    buttonConatiner: {
        marginBottom: Platform.OS == 'android' ? hp('1') : hp('5')
    },
    containerAllow: {
        width: wp('85%')
    },
    textProducts: {
        width: wp('85%')
    },
    pickerStyleErrorText: {
        width: wp('70%')
    },
    pickerDateStyle: {
        width: wp('70%')
    },
    titleTextStyleC: {
        width: wp('14%')
    },
    checkHourDays: {
        width: wp('85%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    stylePickerD: {
        width: wp('55%')
    },
    listContainerStyleH: {
        width: wp('41%')
    },
    dropDownS: {
        width: wp('41%')
    },
    fromPickerConatiner: {
        width: wp('86%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    pressAble: {
        width: wp('6%'),
        alignItems: 'center'
    },

    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,
        marginTop: hp('3%'),
        alignItems: 'center',
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

    selectedAllow: {
        width: wp('41%'),
        height: hp('6.3%'),
        bottom: hp('1.5%')
    },
    inputViewPrice: {
        width: wp('41%'),
        height: hp('6')
    },

    deliveryContainer: {
        width: wp('86%'),
        top: hp('2%')
        // alignItems: 'center'
    },
    checkBoxContainerType: {
        width: wp('85%'),
        flexDirection: 'row'
    },
    scrollBody: {
        paddingBottom: hp('15'),
        alignItems: 'center'
    },
    distanceStyle: {
        width: wp('86%'),
        height: hp('7%')
    },

    rememberImage: {
        width: wp('6%'),
        height: wp('6%')
    },

    title: {
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        color: Colors.Black
    },

    errorText: {
        fontSize: Typography.FONT_SIZE_12
    },
    remember: {
        paddingLeft: wp('1%'),
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_13,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    },
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rememberContainerPickUp: {
        flexDirection: 'row'
    },
    qunatityWithPriceC: {
        width: wp('86%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    inputViewCQ: {
        width: wp('86%'),
        height: hp('6.5')
    },
    inputViewPrice: {
        width: wp('41%'),
        height: hp('6.5')
    },
    errorText: {
        fontSize: Typography.FONT_SIZE_12
    },
    errorTextH: {
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        width: wp('86%'),
        paddingLeft: wp('3%'),
        letterSpacing: 0.2,
        color: Colors.ErrorText
    }
})

export default TradeInfo
