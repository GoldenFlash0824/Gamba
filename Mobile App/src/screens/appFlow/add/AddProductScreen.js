import React, {useEffect, useRef, useState} from 'react'
import {Platform, StyleSheet, Text, TouchableOpacity, View, ScrollView, PermissionsAndroid, useWindowDimensions, KeyboardAvoidingView, Pressable} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import ImagePicker from 'react-native-image-crop-picker'
import axios from 'axios'
import {useSelector} from 'react-redux'
// import moment from 'moment'
import DatePicker from 'react-native-date-picker'
const moment = require('moment-timezone')
import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import ActiveButton from '../../../components/components/common/ActiveButton'
import InputWithLabels from '../../../components/components/common/InputWithLabels'
import Loader from '../../../components/components/common/Spinner'
import Picker from '../../../components/components/common/Picker'
import PickerDate from '../../../components/components/common/PickerDate'
import {separatorHeight, getHeaders} from '../../../utils/helpers'
import ValidateInput from '../../../utils/ValidateInput'
import {IMAGES_BASE_URL} from '../../../services'
import ShowAlert from '../../../components/components/common/ShowAlert'
import GoogleAutoComplete from '../../../components/components/common/GoogleAutoComplete'
import PhotoOptionsBottomSheet from '../../../components/components/common/PhotoOptionsBottomSheet'

const AddProductScreen = ({title, onCloseCB, visible, _editPostData, onPress}) => {
    const {userData} = useSelector((state) => state.user)

    const [updateState, setUpdateState] = useState(false)
    const [loading, setLoading] = useState(false)
    const [category, setCategory] = useState('')
    const [showOtherInput, setShowOtherInput] = useState(false)
    const [privacy, setPrivacy] = useState('Public')
    const [memberLimit, setMemberLimit] = useState('Up to 5 Guests')
    const [memberLimitC, setMemberLimitC] = useState('')

    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState(() => {
        const defaultStartDate = new Date()
        defaultStartDate.setHours(7, 0, 0)
        return defaultStartDate
    })

    const [endDate, setEndDate] = useState(() => {
        const defaultEndDate = new Date()
        defaultEndDate.setHours(19, 0, 0)
        return defaultEndDate
    })

    const [futureDate, setFutureDate] = useState()

    const [imagesData, setImagesData] = useState([])
    const [imagesLength, setImagesLength] = useState(0)

    const [location, setLocation] = useState('')
    const [lat, setLat] = useState('')
    const [lng, setLng] = useState('')
    const [openFutureDate, setOpenFutureDate] = useState(false)
    const [focusCategory, setFocusCategory] = useState(false)
    const [focusdescription, setFocusDescription] = useState(false)
    const [focusMemberLimit, setFocusMemberLimit] = useState(false)
    const [focusmemberLimitC, setFocusMemberLimitC] = useState(false)
    const [errorTextImages, setErrorTextImages] = useState(null)

    const [focusPrice, setFocusPrice] = useState(false)

    const [categoryError, setCategoryError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)

    const [memberLimitCError, setMemberLimitCError] = useState(false)

    const [priceError, setPriceError] = useState(false)

    const [errorTextCategory, setErrorTextCategory] = useState(null)
    const [errorTextDescription, setErrorTextDescription] = useState(null)
    const [errorTextLocation, setErrorTextLocation] = useState(null)
    const [errorTextStartDate, setErroTextStartDate] = useState(null)
    const [errorTextEndDate, setErroTextEndDate] = useState(null)
    const [errorTextmemberLimitC, setErrorTextMemberLimitC] = useState(false)

    const [errorTextPrice, setErrorTextPrice] = useState(null)

    const [pickerVisibleAllow, setPickerVisibleAllow] = useState(false)
    const [pickerVisibleMemberLimit, setPickerVisibleMemberLimit] = useState(false)

    const [isValidRequest, setIsValidRequest] = useState(false)

    const [open, setOpen] = useState(false)
    const [openTo, setOpenTo] = useState(false)
    const [isLocation, setIsLocation] = useState(false)

    const photoOptionsSheetRef = useRef()

    const {height} = useWindowDimensions()

    useEffect(() => {
        const func = async () => {
            if (visible) {
                setImagesLength(title == 'Create Event' ? 1 : 4)
                await updateStatesHandler()
            } else {
                allStateResetHandler()
            }
        }
        func()
    }, [visible])

    const submitCategory = () => {
        const error = ValidateInput(title == 'Create Event' ? 'eventName' : 'postTitle', category)
        setErrorTextCategory(error ? error : null)
        setCategoryError(error ? true : false)
        setFocusCategory(false)
    }
    const submitDescription = () => {
        const error = ValidateInput(title !== 'Share Post' ? 'description' : 'post', description)
        setErrorTextDescription(error ? error : null)
        setDescriptionError(error ? true : false)
        setFocusDescription(false)
        if (!error && !isValidRequest) {
            setFocusPrice(true)
        }
    }

    const submitMemberLimit = () => {
        const error = ValidateInput('memberLimit', memberLimitC)
        setErrorTextMemberLimitC(error ? error : null)
        setMemberLimitCError(error ? true : false)
        setFocusMemberLimitC(false)
        if (!error) {
            setFocusDescription(true)
        }
    }

    const submitPrice = () => {
        const error = ValidateInput('price', price)
        setErrorTextPrice(error ? error : null)
        setPriceError(error ? true : false)
        setFocusPrice(false)
    }

    const toggleDatePicker = () => {
        setOpen(true)
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

    const toggleDatePickerTo = () => {
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
        setFocusMemberLimit(false)
        setFocusCategory(false)
        setFocusDescription(false)
        setFocusPrice(false)
        setFocusMemberLimitC(false)
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
    const changeLimit = (text) => {
        let reg = new RegExp(`^[0-9]{1,45}$`)
        if (text.length > 0) {
            if (reg.test(text)) {
                setMemberLimitC(text)
            }
        } else {
            setMemberLimitC(text)
        }
    }

    const checkIsValidRequest = () => {
        const _dS = moment(startDate).format('MM-DD-YYYY')
        const _dE = moment(endDate).format('MM-DD-YYYY')
        const _timeS = moment(startDate).format('hh:mm A')
        const _timeE = moment(endDate).format('hh:mm A')
        if (title == 'Share Post') {
            if (!ValidateInput('post', description) && !ValidateInput('postTitle', category) && privacy != 'Select' && imagesData.length > 0) {
                setErrorTextCategory(null)
                setCategoryError(false)
                setFocusCategory(false)
                setErrorTextDescription(null)
                setDescriptionError(false)
                setFocusDescription(false)
                return true
            } else {
                imagesData.length < 1 ? setErrorTextImages('Image is required') : setErrorTextImages(null)
                category == '' ? (setErrorTextCategory('Post title is required'), setCategoryError(true), setFocusCategory(false)) : (setErrorTextCategory(null), setCategoryError(false), setFocusCategory(false))
                description == '' ? (setErrorTextDescription('Post detail is required'), setDescriptionError(true), setFocusDescription(false)) : (setErrorTextDescription(null), setDescriptionError(false), setFocusDescription(false))
                return false
            }
        } else {
            if (!ValidateInput('eventName', category) && !ValidateInput('description', description) && !ValidateInput('price', price) && !ValidateInput('location', location) && imagesData.length > 0 && (lat != '') & (lng != '') && _dE >= _dS && (_dE > _dS ? true : _timeS < _timeE) && memberLimit != 'Enter Number' ? true : memberLimitC > 0) {
                setErrorTextMemberLimitC(null)
                setErrorTextDescription(null)
                setMemberLimitCError(false)
                setFocusMemberLimitC(false)
                setFocusCategory(false)
                setFocusDescription(false)
                setFocusPrice(false)
                return true
            } else {
                imagesData.length < 1 ? setErrorTextImages('Image is required') : setErrorTextImages(null)
                category == '' ? (setErrorTextCategory('Event name is required'), setCategoryError(true), setFocusCategory(false)) : (setErrorTextCategory(null), setCategoryError(false), setFocusCategory(false))
                description == '' ? (setErrorTextDescription('Description is required'), setDescriptionError(true), setFocusDescription(false)) : (setErrorTextDescription(null), setDescriptionError(false), setFocusDescription(false))
                price == '' ? (setErrorTextPrice('Price is Required (enter 0 if no fee)'), setPriceError(true), setFocusPrice(false)) : (setErrorTextPrice(null), setPriceError(false), setFocusPrice(false))
                location == '' ? setErrorTextLocation('Location is required') : setErrorTextLocation(null)
                _dE > _dS ? setErroTextEndDate(null) : _dE == _dS && _timeS < _timeE ? setErroTextEndDate(null) : setErroTextEndDate('End date should be greater')
                memberLimitC == '' || memberLimitC == 0 ? (setErrorTextMemberLimitC('Limit should be greater than 0'), setMemberLimitCError(true), setFocusMemberLimitC(false)) : (setErrorTextMemberLimitC(null), setMemberLimitCError(false), setFocusMemberLimitC(false))
                return false
            }
        }
    }

    const allStateResetHandler = () => {
        resetAllFocus()
        setIsValidRequest(false)
        setCategoryError(false)
        setDescriptionError(false)
        setPriceError(false)
        setErrorTextMemberLimitC(false)
        setErrorTextCategory(null)
        setErrorTextDescription(null)
        setErrorTextPrice(null)
    }
    const renderEmptyCell = (type) => {
        return (
            <TouchableOpacity
                style={title == 'Create Event' ? styles.emptyContaoinerEvent : styles.emptyContaoiner}
                activeOpacity={0.8}
                onPress={() => {
                    photoOptionsSheetRef.current.open()
                }}>
                <FastImage source={require('../../../assets/icons/screens/upload.png')} resizeMode="contain" style={styles.icons} />
                <Text style={styles.unSelected}>{'Upload'}</Text>
            </TouchableOpacity>
        )
    }

    const openGallery = async () => {
        title == 'Create Event'
            ? ImagePicker.openPicker({
                  smartAlbums: ['UserLibrary'],
                  mediaType: 'photo',
                  maxFiles: imagesLength - imagesData.length,
                  includeBase64: true,
                  compressImageQuality: 1,
                  width: 420,
                  height: 200,
                  cropping: true,
                  enableRotationGesture: false
              })
                  .then((response) => {
                      response.mime !== 'video/mp4' ? openGalleryCB([response]) : null
                  })
                  .catch((error) => {
                      console.log('camera error', error.message)
                  })
            : ImagePicker.openPicker({
                  smartAlbums: ['UserLibrary'],
                  mediaType: 'photo',
                  compressImageMaxWidth: 650,
                  compressImageMaxHeight: 650,
                  maxFiles: imagesLength - imagesData.length,
                  includeBase64: true,
                  multiple: true,
                  compressImageQuality: 0.8
              })
                  .then((response) => {
                      const img = response.filter((image) => {
                          return image.mime !== 'video/mp4'
                      })
                      openGalleryCB(img)
                  })
                  .catch((error) => {
                      console.log('camera error', error.message)
                  })
    }
    const openGalleryCB = async (images) => {
        let _imagesData = []
        for (let index = 0; index < images.length; index++) {
            let _data = 'data:image/png;base64,' + images[index].data
            _imagesData.push(_data)
        }

        if (imagesData.length + _imagesData.length <= imagesLength) {
            _imagesData = imagesData.concat(_imagesData)

            setImagesData(_imagesData)
        } else {
            ShowAlert({type: 'error', description: `You can select only ${imagesLength} photos`})
        }
    }

    const openCamera = async () => {
        title == 'Create Event'
            ? ImagePicker.openCamera({
                  mediaType: 'photo',
                  includeBase64: true,
                  compressImageQuality: 1,
                  width: 420,
                  height: 200,
                  cropping: true,
                  enableRotationGesture: false
              })
                  .then((image) => {
                      if (imagesData.length < imagesLength) {
                          let _imagesData = []
                          _imagesData.push('data:image/png;base64,' + image.data)
                          _imagesData = imagesData.concat(_imagesData)
                          setImagesData(_imagesData)
                      } else {
                          ShowAlert({type: 'error', description: 'You can select only 4 photos'})
                      }
                  })

                  .catch((error) => {
                      console.log('camera error', error.message)
                  })
            : ImagePicker.openCamera({
                  compressImageMaxWidth: 650,
                  compressImageMaxHeight: 650,
                  mediaType: 'photo',
                  includeBase64: true,
                  compressImageQuality: 0.8
              })
                  .then((image) => {
                      if (imagesData.length < imagesLength) {
                          let _imagesData = []
                          _imagesData.push('data:image/png;base64,' + image.data)
                          _imagesData = imagesData.concat(_imagesData)
                          setImagesData(_imagesData)
                      } else {
                          ShowAlert({type: 'error', description: 'You can select only 4 photos'})
                      }
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

    const updateStatesHandler = async () => {
        let images = []
        for (let i = 0; i < _editPostData?.images?.length; i++) {
            images.push(IMAGES_BASE_URL + _editPostData?.images[i])
        }
        const _futureDate = _editPostData?.future_post_date ? moment(_editPostData.future_post_date, 'MM/DD/YYYY, hh:mm A') : new Date()
        const dateObjectE = new Date(_futureDate)
        setFutureDate(dateObjectE)
        setImagesData(images)
        setDescription(_editPostData?.description ? _editPostData.description : '')
        setCategory(_editPostData?.title ? _editPostData.title : '')
        setPrivacy(_editPostData?.privacy ? _editPostData.privacy : 'Public')
    }

    const postHandler = async () => {
        const result = checkIsValidRequest()

        if (result) {
            const headers = getHeaders(userData.auth_token)
            let savedImages = []
            for (let i = 0; i < imagesData.length; i++) {
                let isExistingImage = imagesData[i].data ? imagesData[i].data.startsWith('http') : imagesData[i].startsWith('http')
                if (isExistingImage) {
                    const url = imagesData[i].data ? imagesData[i].data : imagesData[i]
                    const imageData = url.substring(url.lastIndexOf('/') + 1)
                    savedImages.push(imageData)
                } else {
                    savedImages[i] = imagesData[i]
                }
            }
            if (title === 'Share Post') {
                setLoading(true)
                const data = {
                    title: category,
                    description: description,
                    images: JSON.stringify(savedImages),
                    privacy: privacy,
                    future_post_date: futureDate ? moment(futureDate).format('MM/DD/YYYY') : null
                }
                let url = _editPostData?.id ? `user/posts/update_post/${_editPostData.id}` : 'user/posts/create_post'
                try {
                    await axios
                        .post(url, data, headers)
                        .then(async (response) => {
                            if (response.data.success === true) {
                                setLoading(false)
                                // ShowAlert({type: 'success', description: response.data.message})
                                setTimeout(() => {
                                    onCloseCB()
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
                const resultDate = moment(startDate).format('MM-DD-YYYY hh:mm:ss A') > moment(new Date()).format('MM-DD-YYYY hh:mm:ss A')
                if (resultDate) {
                    setLoading(true)
                    const eventData = {
                        price: price,
                        location: location,
                        // start_date: moment(startDate).format('MM/DD/YY, hh:mm A'),
                        start_date: moment.tz(startDate, `America/New_York`).format(),
                        title: category,
                        // end_date: moment(endDate).format('MM/DD/YY, hh:mm A'),
                        end_date: moment.tz(endDate, `America/New_York`).format(),
                        summary: description,
                        latitude: lat,
                        longitude: lng,
                        image: imagesData[0],
                        is_private: isLocation,
                        privacy: privacy,
                        limit_to: memberLimit,
                        limit_to_number: memberLimit != 'Enter number' ? null : memberLimitC
                    }
                    let url = 'user/event/create_event'
                    try {
                        await axios
                            .post(url, eventData, headers)
                            .then(async (response) => {
                                if (response.data.success === true) {
                                    setLoading(false)
                                    // ShowAlert({type: 'success', description: response.data.message})
                                    setTimeout(() => {
                                        onCloseCB()
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
                    setErroTextStartDate('Start date should be future date')
                }
            }
        }
    }
    const removeImage = async (path, index) => {
        imagesData.splice(index, 1)
        setImagesData(imagesData)
        setUpdateState(!updateState)
    }

    const pickerVisibleHandlerAllow = () => {
        setPickerVisibleAllow(!pickerVisibleAllow)
    }

    const pickerVisibleHandlerMemberLimit = () => {
        setPickerVisibleMemberLimit(!pickerVisibleMemberLimit)
    }

    const pickerSelectionHandlerAllow = (item) => {
        setPickerVisibleAllow(false)
        setPrivacy(item.name)
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

    // const onLocattionSelection = (data, details) => {
    //     console.log('data', data)
    //     setLocation(data?.description)
    //     setLat(details.geometry.location.lat)
    //     setLng(details.geometry.location.lng)
    // }
    const onLocattionSelection = (data, details) => {
        const filteredAddressComponents = details.address_components.filter((component) => !component.types.includes('country'))
        const newFormattedAddress = filteredAddressComponents.map((component) => component.long_name).join(',')
        setLocation(newFormattedAddress)
        setLat(details.geometry.location.lat)
        setLng(details.geometry.location.lng)
    }
    const futureDateHandler = (d) => {
        setFutureDate(d)
        setOpenFutureDate(false)
    }

    const renderImageCell = (path, index) => {
        return (
            <View key={index}>
                <FastImage source={{uri: path.data ? path.data : path}} style={title == 'Create Event' ? {...styles.mapImageEvent, ...{height: undefined, aspectRatio: 16 / 7.6}} : styles.mapImage}>
                    <TouchableOpacity onPress={() => removeImage(path, index)} activeOpacity={0.8}>
                        <View style={styles.crossIconDirection}>
                            <View style={styles.crossIconContainer}>
                                <FastImage source={require('../../../assets/icons/screens/del_image.png')} resizeMode="contain" style={styles.crossIcon} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </FastImage>
            </View>
        )
    }

    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            {separatorHeight()}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={onCloseCB} activeOpacity={0.8} style={styles.leftContainer}>
                    <FastImage source={require('../../../assets/icons/screens/left.png')} style={styles.backIcon} tintColor={Colors.Black} />
                </TouchableOpacity>
                <View onPress={onCloseCB} activeOpacity={0.8} style={styles.midContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                </View>
                <View style={styles.rightContainer}></View>
            </View>

            <View style={height > 1000 ? styles.tabViewC : styles.topContainer}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                        <View>
                            <Text style={styles.remember}>{title == 'Create Event' ? 'Upload Picture' : 'Upload Pictures'}</Text>
                            <View style={styles.mapImages}>
                                {imagesData.map((_imagesData, index) => renderImageCell(_imagesData, index))}

                                {imagesData.length < imagesLength && <View>{renderEmptyCell()}</View>}
                            </View>
                            <Text style={{...styles.countText, ...styles.unSelected}}>{`${imagesData.length} / ${imagesLength}`}</Text>
                            {errorTextImages && imagesData.length < 1 && <Text style={styles.errorTextH}>{errorTextImages}</Text>}
                        </View>
                        <View style={styles.backgroundContainer}>
                            {/* <View style={styles.quantityView}> */}
                            <InputWithLabels
                                showLabelCB={true}
                                value={category}
                                showAstaric
                                placeholder={title == 'Create Event' ? 'Event title' : ' Title'}
                                showPlaceHolder={true}
                                placeholderInner={'Enter title'}
                                secure={false}
                                isError={categoryError}
                                onBlur={submitCategory}
                                isFocus={focusCategory}
                                onFocus={() => {
                                    resetAllFocus()
                                    setFocusCategory(true)
                                }}
                                errorText={errorTextCategory}
                                autoCapitalize="none"
                                onChangeText={(text) => setCategory(text)}
                                style={styles.inputS}
                            />
                            {/* {title != 'Create Event' && (
                                    <Pressable onPress={() => setOpenFutureDate(true)}>
                                        <FastImage source={require('../../../assets/icons/screens/future_post.png')} style={styles.eventImageF} tintColor={Colors.GrayLight} />
                                    </Pressable>
                                )} */}
                            {/* </View> */}
                            {title == 'Create Event' && (
                                <>
                                    <InputWithLabels
                                        textError={styles.errorText}
                                        showLabelCB={true}
                                        value={price}
                                        showAstaric
                                        placeholderInner={'Enter price'}
                                        showPlaceHolder={true}
                                        placeholder="Price"
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
                                        style={styles.inputS}
                                    />
                                </>
                            )}
                            {title == 'Share Post' && (
                                <Picker
                                    data={[
                                        {name: 'Public', id: 1},
                                        {name: 'My Network', id: 2},
                                        {name: 'Only Me', id: 3}
                                    ]}
                                    visible={pickerVisibleAllow}
                                    title={'Privacy'}
                                    showSteric={true}
                                    onPress={pickerVisibleHandlerAllow}
                                    pickerHandler={pickerSelectionHandlerAllow}
                                    selectedItem={privacy}
                                    styleTitle={styles.titleStylePrivacy}
                                />
                            )}
                            {title !== 'Share Post' && (
                                <>
                                    {separatorHeight()}

                                    {title == 'Create Event' && (
                                        <>
                                            <PickerDate
                                                showSteric={true}
                                                fromDate={'Start Date'}
                                                onPress={toggleDatePicker}
                                                open={open}
                                                minimumDate={new Date()}
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
                                                fromDate={'End Date'}
                                                minimumDate={new Date()}
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
                                        </>
                                    )}
                                    {title == 'Create Event' && (
                                        <View style={styles.privacyConatiner}>
                                            <Picker
                                                data={[
                                                    {name: 'Public', id: 1},
                                                    {name: 'My Network', id: 2},
                                                    {name: 'Only Me', id: 3}
                                                ]}
                                                visible={pickerVisibleAllow}
                                                showSteric={true}
                                                title={'Privacy'}
                                                onPress={pickerVisibleHandlerAllow}
                                                pickerHandler={pickerSelectionHandlerAllow}
                                                selectedItem={privacy}
                                            />
                                            {separatorHeight()}
                                            <Picker
                                                data={[
                                                    {name: 'Up to 5 Guests', id: 0},
                                                    {name: 'Up to 10 Guests', id: 1},
                                                    {name: 'Up to 15 Guests', id: 2},
                                                    {name: 'Up to 20 Guests', id: 3},
                                                    {name: 'Enter Number', id: 3}
                                                ]}
                                                title={'Limit To'}
                                                showSteric={true}
                                                visible={pickerVisibleMemberLimit}
                                                onPress={pickerVisibleHandlerMemberLimit}
                                                pickerHandler={onSelectionMemberLimit}
                                                selectedItem={memberLimit}
                                            />
                                            {separatorHeight()}

                                            {showOtherInput && (
                                                <InputWithLabels
                                                    showLabelCB={true}
                                                    value={memberLimitC}
                                                    placeholder="Limit To Number"
                                                    isError={memberLimitCError}
                                                    isFocus={focusmemberLimitC}
                                                    onFocus={() => {
                                                        resetAllFocus()
                                                        setFocusMemberLimitC(true)
                                                    }}
                                                    onBlur={submitMemberLimit}
                                                    errorText={errorTextmemberLimitC}
                                                    keyboardType={'decimal-pad'}
                                                    onChangeText={(text) => changeLimit(text)}
                                                />
                                            )}
                                        </View>
                                    )}
                                </>
                            )}
                            {title == 'Share Post' && separatorHeight()}
                            <>
                                <InputWithLabels
                                    showLabelCB={true}
                                    value={description}
                                    placeholder={title !== 'Share Post' ? 'Event Description' : 'Share'}
                                    secure={false}
                                    placeholderInner={' Write...'}
                                    showPlaceHolder={true}
                                    showAstaric={true}
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
                                    style={styles.styleInputS}
                                />
                            </>
                            {title == 'Create Event' && (
                                <>
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
                                    {errorTextLocation && location == '' && lat == '' && lng == '' && <Text style={styles.errorTextH}>{errorTextLocation}</Text>}
                                    <View style={styles.eventArea}>
                                        <TouchableOpacity onPress={() => setIsLocation(!isLocation)} activeOpacity={0.8}>
                                            {isLocation ? <FastImage source={require('../../../assets/icons/screens/checked.png')} style={styles.eventImage} resizeMode="contain" tintColor={Colors.MainThemeColor} /> : <FastImage source={require('../../../assets/icons/screens/unchecked.png')} style={styles.eventImage} resizeMode="contain" tintColor={Colors.LightGrayColor} />}
                                        </TouchableOpacity>
                                        <Text style={styles.checkEvent}>Display my location publicly</Text>
                                    </View>
                                </>
                            )}
                            {separatorHeight()}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
            <PhotoOptionsBottomSheet setRef={photoOptionsSheetRef} title={'Add Photo'} skipTitle={'cancel'} accessAllowGallery={() => checkPermissions('photo')} accessAllowCamera={() => checkPermissions('camera')} skipButtonCB={() => photoOptionsSheetRef.current.close()} />
            <ActiveButton title={title === 'Share Post' ? (_editPostData?.id ? 'Update' : 'Post') : 'Create'} onPress={postHandler} />
            <DatePicker modal open={openFutureDate} date={futureDate ? futureDate : new Date()} mode={'date'} onConfirm={futureDateHandler} onCancel={() => setOpenFutureDate(false)} minimumDate={new Date()} />
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
    scrollBody: {
        paddingBottom: hp('15'),
        alignItems: 'center'
    },
    dropDown1: {
        width: wp('40%')
    },
    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,
        marginTop: hp('3%'),
        alignItems: 'center',

        paddingVertical: hp('1%')
    },
    privacyConatiner: {},
    quantityView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: wp('92'),
        alignItems: 'center'
    },
    deliveryContainer: {
        width: wp('86%'),
        top: hp('2%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    checkBoxContainerType: {
        width: wp('30%')
    },
    styleInputS: {
        textAlignVertical: 'top',
        width: wp('92'),
        backgroundColor: Colors.White,
        paddingHorizontal: wp('1')
    },

    styleDelivery: {
        width: wp('42%'),
        height: hp('6%')
    },
    headerContainer: {
        marginTop: Platform.OS == 'android' ? hp('0') : hp('6'),
        width: wp('96'),
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center'
    },
    inputS: {width: wp('92'), backgroundColor: Colors.White},
    titleDeliveryStyle: {
        // bottom: Platform.OS == 'android' ? hp('5.1%') : hp('5.2%')
    },
    titleDeliveryStyleBy: {
        // bottom: Platform.OS == 'android' ? hp('4.7%') : hp('4.7%')
    },
    titleStylePrivacy: {
        // bottom: Platform.OS == 'android' ? hp('6.1%') : hp('6.2%')
    },
    memberLimitCStyle: {width: wp('55%'), height: hp('6%')},
    backIcon: {
        width: wp('6%'),
        height: wp('6%')
    },
    leftContainer: {
        width: wp('32')
    },
    textProducts: {
        width: wp('92%'),
        paddingBottom: hp(0.5)
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
        fontSize: Typography.FONT_SIZE_20,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    unSelected: {
        color: Colors.LightGrayColor,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    },
    topContainer: {
        width: wp('100%'),
        height: Platform.OS == 'ios' ? hp('80%') : hp('88%'),
        alignItems: 'center'
    },
    tabViewC: {
        width: wp('100%'),
        height: hp('84%'),
        alignItems: 'center'
    },

    icons: {
        width: wp('10%'),
        height: wp('10%')
    },

    tradeImages: {
        width: wp('92'),
        flexDirection: 'row'
    },
    imagesContainerStyle: {
        width: wp('92'),
        marginTop: wp('17%')
    },
    countText: {
        marginTop: hp('0.3'),
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        color: Colors.Black,
        marginLeft: wp('2')
    },
    emptyContaoiner: {
        width: wp('30%'),
        height: wp('30%'),
        alignItems: 'center',
        backgroundColor: Colors.White,
        borderColor: Colors.MainThemeColor,
        borderWidth: wp('0.2'),
        borderRadius: wp('4'),
        justifyContent: 'center',
        marginLeft: wp('1'),
        marginTop: hp('1%')
    },
    emptyContaoinerEvent: {
        width: wp('92%'),
        height: wp('35%'),
        alignItems: 'center',
        backgroundColor: Colors.White,
        borderColor: Colors.MainThemeColor,
        borderWidth: wp('0.2'),
        borderRadius: wp('4'),
        justifyContent: 'center',
        marginLeft: wp('1'),
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
    eventImageF: {
        width: wp('7%'),
        height: wp('7%')
    },
    checkEvent: {
        paddingLeft: wp('1'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    },
    mapImage: {
        width: wp('30%'),
        height: wp('30%'),
        borderRadius: wp('4'),
        marginTop: hp('1%'),
        marginLeft: wp('1')
    },
    mapImageEvent: {
        width: wp('92%'),
        height: wp('35%'),
        borderRadius: wp('1'),
        marginTop: hp('1%')
    },
    mapImages: {
        width: wp('94'),
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    crossIconContainer: {
        width: wp('6%'),
        height: hp('3%'),
        borderRadius: wp('4%'),
        overflow: 'hidden'
    },
    crossIconDirection: {
        alignItems: 'flex-end',
        top: hp(1),
        right: wp(2)
    },
    crossIcon: {
        width: '100%',
        height: '100%'
    },
    discountContainer: {
        width: wp('86'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: -1
    },
    discount: {
        minWidth: wp('20'),
        minHeight: hp('5'),
        borderRadius: wp('4'),
        backgroundColor: Colors.BorderGrey,
        justifyContent: 'center',
        alignItems: 'center'
    },
    discountS: {
        minWidth: wp('20'),
        minHeight: hp('6'),
        borderRadius: wp('6'),
        backgroundColor: Colors.BorderGrey,
        justifyContent: 'center',
        alignItems: 'center'
    },
    discountText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    discountHeading: {
        width: wp('86'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        zIndex: -1
    },
    discountTextS: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    caontainerQWeight: {
        width: wp('86')
    },

    addMore: {
        width: wp('92'),
        alignItems: 'flex-end',
        marginTop: hp('3%')
    },
    addMoreButton: {
        width: wp('20%'),
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleTextAddMore: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        textDecorationLine: 'underline'
    },
    rememberImage: {
        width: wp('6%'),
        height: wp('6%')
    },
    viewInput: {
        width: wp('30%'),
        height: hp('5')
    },
    containerTrade: {
        backgroundColor: Colors.White,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp('86%'),
        borderBottomColor: Colors.BorderGrey,
        borderBottomWidth: wp(0.3),
        height: hp('6')
    },
    title: {
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        color: Colors.Black
    },
    rightContainer: {
        width: wp('35'),
        alignItems: 'center',
        flexDirection: 'row'
    },
    inputViewC: {
        width: wp('43%'),
        height: hp('6')
    },
    inputViewCQ: {
        width: wp('86%'),
        height: hp('6.5')
    },
    errorText: {
        fontSize: Typography.FONT_SIZE_12
    },
    remember: {
        marginTop: hp('1'),
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Platform.OS == 'android' ? Typography.FONT_SIZE_13 : Typography.FONT_SIZE_15
    },
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center'
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

export default AddProductScreen
