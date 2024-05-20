import React, {useEffect, useRef, useState} from 'react'
import {Platform, StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, PermissionsAndroid} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-crop-picker'
import axios from 'axios'
import {useSelector} from 'react-redux'
// import moment from 'moment'
const moment = require('moment-timezone')
import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import ActiveButton from '../../../components/components/common/ActiveButton'
import InputWithLabels from '../../../components/components/common/InputWithLabels'
import Loader from '../../../components/components/common/Spinner'
import Header from '../../../components/components/common/Header'
import MainHeader from '../../../components/components/common/MainHeader'
import PickerDate from '../../../components/components/common/PickerDate'
import Picker from '../../../components/components/common/Picker'
import {separatorHeight, getHeaders} from '../../../utils/helpers'
import ValidateInput from '../../../utils/ValidateInput'
import ShowAlert from '../../../components/components/common/ShowAlert'
import PhotoOptionsBottomSheet from '../../../components/components/common/PhotoOptionsBottomSheet'
import GoogleAutoComplete from '../../../components/components/common/GoogleAutoComplete'
import {IMAGES_BASE_URL} from '../../../services/constants'

const AddEventScreen = ({route, navigation}) => {
    const eventData = route.params
    const {userData} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)
    const [eventName, setEventName] = useState('')

    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [_startDate, _setStartDate] = useState('')
    const [_endDate, _setEndDate] = useState(new Date())
    const [imagesData, setImagesData] = useState('')
    const [location, setLocation] = useState('')
    const [lat, setLat] = useState('')
    const [lng, setLng] = useState('')

    const [focusEventName, setFocusEventName] = useState(false)
    const [focusdescription, setFocusDescription] = useState(false)
    const [focusPrice, setFocusPrice] = useState(false)
    const [focusmemberLimitC, setFocusMemberLimitC] = useState(false)
    const [showOtherInput, setShowOtherInput] = useState(false)

    const [eventNameError, setEventNameError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)
    const [priceError, setPriceError] = useState(false)
    const [memberLimitCError, setMemberLimitCError] = useState(false)

    const [errorTextEventName, setErrorTextEventName] = useState(null)
    const [errorTextDescription, setErrorTextDescription] = useState(null)
    const [errorTextPrice, setErrorTextPrice] = useState(null)
    const [errorTextLocation, setErrorTextLocation] = useState(null)
    const [errorTextStartDate, setErroTextStartDate] = useState(null)
    const [errorTextEndDate, setErroTextEndDate] = useState(null)
    const [errorTextmemberLimitC, setErrorTextMemberLimitC] = useState(null)

    const [isValidRequest, setIsValidRequest] = useState(false)
    const [pickerVisibleAllow, setPickerVisibleAllow] = useState(false)
    const [privacy, setPrivacy] = useState('Public')
    const [pickerVisibleMemberLimit, setPickerVisibleMemberLimit] = useState(false)
    const [memberLimit, setMemberLimit] = useState('Up to 5 Guests')
    const [memberLimitC, setMemberLimitC] = useState('')

    const [open, setOpen] = useState(false)
    const [openTo, setOpenTo] = useState(false)
    const [isLocation, setIsLocation] = useState(false)

    const photoOptionsSheetRef = useRef()
    useEffect(() => {
        if (eventData) {
            const formatSDate = moment(eventData.item.start_date)
            const dateObjectS = new Date(formatSDate)
            const formatEDate = moment(eventData.item.end_date)
            const dateObjectE = new Date(formatEDate)
            setEventName(eventData.item.title)
            setPrice(eventData.item.price.toString())
            setDescription(eventData.item.summary)
            setStartDate(dateObjectS)
            setEndDate(dateObjectE)
            _setEndDate(dateObjectE)
            setLocation(eventData.item.location)
            setLat(eventData.item.latitude)
            setLng(eventData.item.longitude)
            setImagesData(IMAGES_BASE_URL + eventData.item.image)
            setIsLocation(eventData.item.is_private)
            setPrivacy(eventData.item.privacy)
            setMemberLimit(eventData.item.limit_to)
            setMemberLimitC(eventData.item.limit_to_number ? eventData.item.limit_to_number : '')
        }
    }, [])
    const submitEventName = () => {
        const error = ValidateInput('eventName', eventName)
        setErrorTextEventName(error ? error : null)
        setEventNameError(error ? true : false)
        setFocusEventName(false)
        if (!error && !isValidRequest) {
            setFocusDescription(true)
        }
    }
    const submitDescription = () => {
        const error = ValidateInput('description', description)
        setErrorTextDescription(error ? error : null)
        setDescriptionError(error ? true : false)
        setFocusDescription(false)
        if (!error && !isValidRequest) {
            setFocusPrice(true)
        }
    }

    const submitPrice = () => {
        const error = ValidateInput('price', price)
        setErrorTextPrice(error ? error : null)
        setPriceError(error ? true : false)
        setFocusPrice(false)
    }

    const toggleDatePicker = (type) => {
        setOpen(true)
    }

    const pickerVisibleHandlerAllow = () => {
        setPickerVisibleAllow(!pickerVisibleAllow)
    }

    const pickerSelectionHandlerAllow = (item) => {
        setPickerVisibleAllow(false)
        setPrivacy(item.name)
    }
    const pickerVisibleHandlerMemberLimit = () => {
        setPickerVisibleMemberLimit(!pickerVisibleMemberLimit)
    }

    const onSelectionMemberLimit = (item) => {
        setPickerVisibleMemberLimit(false)
        if (item.name === 'Enter Number') {
            setMemberLimit(item.name)
            setShowOtherInput(true)
        } else {
            setMemberLimit(item.name)
            setShowOtherInput(false)
        }
    }

    const submitMemberLimit = () => {
        const error = ValidateInput('memberLimit', memberLimitC)

        setErrorTextMemberLimitC(error ? error : null)
        setMemberLimitCError(error ? true : false)
        setFocusMemberLimitC(false)
        if (!error && !isValidRequest) {
            setFocusDescription(true)
        }
    }
    const changeStartDHandler = (d) => {
        if (_endDate == '') {
            setStartDate(d)
            setOpen(false)
        } else {
            const _dS = moment(d).format('MM-DD-YYYY')
            const _dE = moment(_endDate).format('MM-DD-YYYY')
            const _timeS = moment(d).format('hh:mm A')
            const _timeE = moment(_endDate).format('hh:mm A')

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
            _setEndDate(d)
            setOpenTo(false)
            setErroTextEndDate(null)
            setErroTextStartDate(null)
        } else {
            setEndDate(d)
            _setEndDate(d)
            setOpenTo(false)
            setErroTextEndDate('End date should be greater')
            setIsValidRequest(false)
        }
    }

    const resetAllFocus = () => {
        setFocusEventName(false)
        setFocusDescription(false)
        setFocusPrice(false)
    }

    const onChangePrice = (text) => {
        let reg = new RegExp(`^[.0-9]{1,45}$`)
        if (text.length > 0) {
            if (reg.test(text)) {
                setPrice(text)
            }
        } else {
            setPrice(text)
        }
    }

    const checkIsValidRequest = () => {
        const _dS = moment(startDate).format('MM-DD-YYYY')
        const _dE = moment(endDate).format('MM-DD-YYYY')
        const _timeS = moment(startDate).format('hh:mm A')
        const _timeE = moment(endDate).format('hh:mm A')
        if (!ValidateInput('eventName', eventName) && !ValidateInput('description', description) && !ValidateInput('price', price) && !ValidateInput('location', location) && imagesData != '' && lat != '' && lng != '' && _dE >= _dS && (_dE > _dS ? true : _timeS < _timeE) && memberLimit != 'Enter Number' ? true : memberLimitC > 0) {
            setErrorTextDescription(null)
            setDescriptionError(false)
            setFocusDescription(false)
            setErrorTextPrice(null)
            setPriceError(false)
            setFocusPrice(false)
            setErrorTextEventName(null)
            setEventNameError(false)
            setFocusEventName(false)
            return true
        } else {
            eventName == '' ? (setErrorTextEventName('Event name is required'), setEventNameError(true), setFocusEventName(false)) : (setErrorTextEventName(null), setEventNameError(false), setFocusEventName(false))
            price == '' ? (setErrorTextPrice('Price is Required (enter 0 if no fee)'), setPriceError(true), setFocusPrice(false)) : (setErrorTextPrice(null), setPriceError(false), setFocusPrice(false))
            _dE > _dS ? setErroTextEndDate(null) : _dE == _dS && _timeS < _timeE ? setErroTextEndDate(null) : setErroTextEndDate('End date should be greater')
            memberLimitC == '' || memberLimitC == 0 ? (setErrorTextMemberLimitC('Limit should be greater than 0'), setMemberLimitCError(true), setFocusMemberLimitC(false)) : (setErrorTextMemberLimitC(null), setMemberLimitCError(false), setFocusMemberLimitC(false))
            description == '' ? (setErrorTextDescription('Description is required'), setDescriptionError(true), setFocusDescription(false)) : (setErrorTextDescription(null), setDescriptionError(false), setFocusDescription(false))
            location == '' ? setErrorTextLocation('Location is required') : setErrorTextLocation(null)
            return false
        }
    }

    const renderEmptyCell = (type) => {
        return (
            <TouchableOpacity
                style={styles.emptyContaoiner}
                activeOpacity={0.8}
                onPress={() => {
                    photoOptionsSheetRef.current.open()
                }}>
                <FastImage source={require('../../../assets/icons/screens/camera.png')} resizeMode="contain" style={styles.icons} />
            </TouchableOpacity>
        )
    }

    const openGallery = async () => {
        ImagePicker.openPicker({
            smartAlbums: ['UserLibrary'],
            mediaType: 'photo',
            multiple: false,
            includeBase64: true,
            compressImageQuality: 1,
            width: 420,
            height: 200,
            cropping: true,
            enableRotationGesture: false
        })
            .then((response) => {
                let _data = 'data:image/png;base64,' + response.data
                setImagesData(_data)
            })
            .catch((error) => {
                console.log('gallery error', error.message)
            })
    }

    const openCamera = async () => {
        ImagePicker.openCamera({
            mediaType: 'photo',
            includeBase64: true,
            compressImageQuality: 1,
            width: 420,
            height: 200,
            cropping: true,
            enableRotationGesture: false
        })
            .then((image) => {
                setImagesData('data:image/png;base64,' + image.data)
            })
            .catch((error) => {
                console.log('camera error', error.message)
            })
    }
    const checkPermissions = async (type) => {
        permissionType = type
        if (Platform.OS === 'ios') {
            if (type === 'camera') {
                photoOptionsSheetRef.current.close()
                setTimeout(() => {
                    openCamera()
                }, 200)
            } else {
                photoOptionsSheetRef.current.close()
                setTimeout(() => {
                    openGallery()
                }, 200)
            }
        } else if (Platform.OS === 'android') {
            if (type === 'camera') {
                const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
                if (result === 'granted') {
                    photoOptionsSheetRef.current.close()
                    setTimeout(() => {
                        openCamera()
                    }, 200)
                } else {
                    photoOptionsSheetRef.current.close()
                    console.log('Camera permission denied')
                }
            } else {
                if (Platform.OS === 'android' && Platform.constants['Release'] >= 13) {
                    photoOptionsSheetRef.current.close()
                    setTimeout(() => {
                        openGallery()
                    }, 200)
                } else {
                    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)
                    if (result === 'granted') {
                        photoOptionsSheetRef.current.close()
                        setTimeout(() => {
                            openGallery()
                        }, 200)
                    } else {
                        photoOptionsSheetRef.current.close()
                        console.log('Gallery permission denied')
                    }
                }
            }
        }
    }

    const createHandler = async () => {
        const result = checkIsValidRequest()
        if (result) {
            setLoading(true)
            const _imageData = imagesData.startsWith('http') ? imagesData.substring(imagesData.lastIndexOf('/') + 1) : imagesData

            const headers = getHeaders(userData.auth_token)
            const data = {
                price: price,
                location: location,
                // start_date: moment(startDate).format('MM/DD/YY, hh:mm A'),
                // end_date: moment(endDate).format('MM/DD/YY, hh:mm A'),
                start_date: moment.tz(startDate, `America/New_York`).format(),
                end_date: moment.tz(endDate, `America/New_York`).format(),
                title: eventName,
                summary: description,
                latitude: lat,
                longitude: lng,
                image: _imageData,
                is_private: isLocation,
                privacy: privacy != 'Select' ? privacy : '',
                limit_to: memberLimit,
                limit_to_number: memberLimit != 'enter your number' ? null : memberLimitC
            }

            try {
                eventData
                    ? await axios
                          .put(`user/event/update_event/${eventData.item.id}`, data, headers)
                          .then(async (response) => {
                              if (response.data.success === true) {
                                  setLoading(false)
                                  navigation.goBack()
                                  //   ShowAlert({type: 'success', description: response.data.message})
                              } else {
                                  setLoading(false)
                                  ShowAlert({type: 'error', description: response.data.message})
                              }
                          })
                          .catch((error) => {
                              setLoading(false)
                              ShowAlert({type: 'error', description: error.message})
                          })
                    : await axios
                          .post('user/event/create_event', data, headers)
                          .then(async (response) => {
                              if (response.data.success === true) {
                                  setLoading(false)
                                  navigation.goBack()
                                  ShowAlert({type: 'success', description: response.data.message})
                              } else {
                                  setLoading(false)
                                  //   ShowAlert({type: 'error', description: response.data.message})
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
        }
    }
    const onLocattionSelection = (data, details) => {
        setLocation(data?.description)
        setLat(details.geometry.location.lat)
        setLng(details.geometry.location.lng)
    }

    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            <Header back={true} backCB={() => navigation.goBack()} title={'Update Event'} />
            <View style={styles.topContainer}>
                <ScrollView contentContainerStyle={{paddingBottom: hp('15'), marginTop: hp('1')}} showsVerticalScrollIndicator={false}>
                    <View style={styles.mapImages}>
                        {imagesData ? (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => {
                                    photoOptionsSheetRef.current.open()
                                }}>
                                <FastImage source={{uri: imagesData}} resizeMode="contain" style={[styles.mapImage, {height: undefined, aspectRatio: 16 / 7.6}]} />
                            </TouchableOpacity>
                        ) : (
                            <>{renderEmptyCell()}</>
                        )}
                    </View>
                    <Text style={{...styles.countText}}>{`${imagesData == '' ? 0 : 1} of 1 Images`}</Text>
                    {separatorHeight()}
                    <View style={styles.backgroundContainer}>
                        <InputWithLabels
                            showLabelCB={true}
                            value={eventName}
                            placeholderC={'Event title'}
                            showAstaric
                            showPlaceHolder={true}
                            placeholderInner={'Enter title'}
                            secure={false}
                            isError={eventNameError}
                            onBlur={submitEventName}
                            isFocus={focusEventName}
                            onFocus={() => {
                                resetAllFocus()
                                setFocusEventName(true)
                            }}
                            errorText={errorTextEventName}
                            autoCapitalize="none"
                            onChangeText={(text) => setEventName(text)}
                            style={styles.inPutStyle}
                        />
                        <InputWithLabels
                            showLabelCB={true}
                            value={price}
                            placeholder="Price"
                            showAstaric
                            placeholderInner={'Enter price'}
                            showPlaceHolder={true}
                            keyboardType={'decimal-pad'}
                            secure={false}
                            isError={priceError}
                            onBlur={submitPrice}
                            isFocus={focusPrice}
                            onFocus={() => {
                                resetAllFocus()
                                setFocusPrice(true)
                            }}
                            errorText={errorTextPrice}
                            onChangeText={(text) => onChangePrice(text)}
                            style={styles.inPutStyle}
                        />
                        <PickerDate
                            showSteric={true}
                            minimumDate={new Date()}
                            fromDate={'Start date'}
                            onPress={toggleDatePicker}
                            open={open}
                            selectedDate={startDate}
                            handleDateChange={changeStartDHandler}
                            onCancel={() => {
                                setOpen(false)
                            }}
                            errorText={errorTextStartDate}
                        />
                        {separatorHeight()}
                        <PickerDate
                            showSteric={true}
                            minimumDate={new Date()}
                            fromDate={'End date'}
                            onPress={toggleDatePickerTo}
                            open={openTo}
                            selectedDate={endDate}
                            handleDateChange={changeEndDHandler}
                            onCancel={() => {
                                setOpenTo(false)
                            }}
                            errorText={errorTextEndDate}
                        />
                        {separatorHeight()}
                        <Picker
                            showSteric
                            data={[
                                {name: 'Public', id: 1},
                                {name: 'My Network', id: 2},
                                {name: 'Only Me', id: 3}
                            ]}
                            visible={pickerVisibleAllow}
                            title={'Privacy'}
                            onPress={pickerVisibleHandlerAllow}
                            pickerHandler={pickerSelectionHandlerAllow}
                            selectedItem={privacy}
                            styleTitle={styles.titleStylePrivacy}
                        />
                        {separatorHeight()}

                        <Picker
                            showSteric
                            data={[
                                {name: 'Up to 5 Guests', id: 0},
                                {name: 'Up to 10 Guests', id: 1},
                                {name: 'Up to 15 Guests', id: 2},
                                {name: 'Up to 20 Guests', id: 3},
                                {name: 'Enter Number', id: 3}
                            ]}
                            title={'Limit to'}
                            visible={pickerVisibleMemberLimit}
                            onPress={pickerVisibleHandlerMemberLimit}
                            pickerHandler={onSelectionMemberLimit}
                            selectedItem={memberLimit}
                        />
                        {separatorHeight()}
                        {showOtherInput && (
                            <InputWithLabels
                                showSteric
                                showLabelCB={true}
                                value={memberLimitC}
                                showAstaric
                                placeholderInner={'Enter no.'}
                                showPlaceHolder={true}
                                placeholderC="Limit To Number"
                                isError={memberLimitCError}
                                isFocus={focusmemberLimitC}
                                onFocus={() => {
                                    resetAllFocus()
                                    setFocusMemberLimitC(true)
                                }}
                                onBlur={submitMemberLimit}
                                errorText={errorTextmemberLimitC}
                                onChangeText={(text) => setMemberLimitC(text.trimStart())}
                            />
                        )}

                        <InputWithLabels
                            showLabelCB={true}
                            value={description}
                            showAstaric
                            placeholderC={'Event Description'}
                            secure={false}
                            placeholderInner={' Write...'}
                            showPlaceHolder={true}
                            isError={descriptionError}
                            onBlur={submitDescription}
                            isFocus={focusdescription}
                            onFocus={() => {
                                resetAllFocus()
                                setFocusDescription(true)
                            }}
                            errorText={errorTextDescription}
                            autoCapitalize="none"
                            onChangeText={(text) => {
                                setDescription(text)
                            }}
                            multiline={true}
                            maxHeight={130}
                            minHeight={130}
                            style={{textAlignVertical: 'top', width: wp('92'), backgroundColor: Colors.White}}
                        />

                        <View style={styles.textProducts}>
                            <Text style={styles.remember}>
                                {'Event Location'}
                                <Text style={[styles.remember, {color: Colors.ErrorBorder}]}>{'*'}</Text>
                            </Text>
                        </View>
                        <GoogleAutoComplete
                            placeholder="Location"
                            fetchDetails={true}
                            query={{
                                key: 'AIzaSyCyeed677ICVk7ZvQARsvHpE0P5Mjgx52Q',
                                language: 'en'
                            }}
                            onPress={onLocattionSelection}
                            textInputProps={{
                                placeholderTextColor: '#96989b',
                                color: Colors.DarkPepper_80,
                                value: location,
                                onChangeText: (text) => setLocation(text),
                                returnKeyType: 'search',
                                onBlur: () => null
                            }}
                        />
                        <Text style={styles.errorTextIcon}>{errorTextLocation}</Text>
                        <View style={styles.eventArea}>
                            <TouchableOpacity onPress={() => setIsLocation(!isLocation)} activeOpacity={0.8}>
                                {isLocation ? <FastImage source={require('../../../assets/icons/screens/checked.png')} style={styles.eventImage} resizeMode="contain" tintColor={Colors.MainThemeColor} /> : <FastImage source={require('../../../assets/icons/screens/unchecked.png')} style={styles.eventImage} resizeMode="contain" tintColor={Colors.MainThemeColor} />}
                            </TouchableOpacity>
                            <Text style={styles.checkEvent}>Display my location publicly</Text>
                        </View>
                    </View>
                </ScrollView>
                <ActiveButton title={eventData ? 'Update' : 'Create'} onPress={() => createHandler()} />
            </View>
            <PhotoOptionsBottomSheet setRef={photoOptionsSheetRef} title={'Add Photo'} skipTitle={'cancel'} accessAllowGallery={() => checkPermissions('photo')} accessAllowCamera={() => checkPermissions('camera')} skipButtonCB={() => photoOptionsSheetRef.current.close()} />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width: wp('100'),
        flex: 1,
        backgroundColor: Colors.White,
        alignItems: 'center'
    },
    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.White
    },

    topContainer: {
        width: wp('100%'),
        flex: 1,
        alignItems: 'center'
    },
    icons: {
        width: wp('10%'),
        height: wp('10%')
    },
    countText: {
        marginTop: hp('0.3'),
        color: Colors.LightGrayColor,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    },

    emptyContaoiner: {
        width: wp('92%'),
        height: wp('35%'),
        alignItems: 'center',
        backgroundColor: Colors.White,
        borderColor: Colors.BorderGrey,
        borderWidth: wp('0.3'),
        borderRadius: wp('2'),
        justifyContent: 'center',
        marginTop: hp('1%')
    },
    eventArea: {
        marginTop: hp('1'),
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('92%'),
        alignSelf: 'center'
    },
    eventImage: {
        width: wp('6%'),
        height: wp('6%')
    },
    checkEvent: {
        paddingLeft: wp('1'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    mapImage: {
        width: wp('92%'),
        height: wp('35%'),
        borderRadius: wp('2'),
        marginTop: hp('1%')
    },
    mapImages: {
        width: wp('92'),
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: hp('1%')
    },
    inPutStyle: {
        width: wp('92'),
        backgroundColor: Colors.White
    },
    textProducts: {
        width: wp('92%'),
        paddingBottom: hp(0.5)
    },
    remember: {
        marginTop: hp('1'),
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Platform.OS == 'android' ? Typography.FONT_SIZE_13 : Typography.FONT_SIZE_15
    },
    errorTextIcon: {
        fontSize: Typography.FONT_SIZE_13,
        width: wp('92%'),
        paddingLeft: wp('3%'),
        letterSpacing: 0.2,
        color: Colors.ErrorText,
        marginRight: 0,
        marginTop: wp('0.5%'),
        marginBottom: wp('0.5%'),
        fontFamily: Typography.FONT_FAMILY_REGULAR
    }
})

export default AddEventScreen
