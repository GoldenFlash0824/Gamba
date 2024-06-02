import React, {useEffect, useRef, useState} from 'react'
import {PermissionsAndroid, Platform, StyleSheet, TouchableOpacity, View, Text} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import axios from 'axios'
import {KeyboardAwareScrollView} from '@codler/react-native-keyboard-aware-scroll-view'
import moment from 'moment'
import {useSelector, useDispatch} from 'react-redux'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import ActiveButton from '../../../components/components/common/ActiveButton'
import Header from '../../../components/components/common/Header'
import ImagePicker from 'react-native-image-crop-picker'
import InputWithLabels from '../../../components/components/common/InputWithLabels'
import Loader from '../../../components/components/common/Spinner'
import PhotoOptionsBottomSheet from '../../../components/components/common/PhotoOptionsBottomSheet'
import ShowAlert from '../../../components/components/common/ShowAlert'
import ValidateInput, {ValidateEmail} from '../../../utils/ValidateInput'
import {IMAGES_BASE_URL} from '../../../services/constants'
import PickerDate from '../../../components/components/common/PickerDate'
import Picker from '../../../components/components/common/Picker'
import GoogleAutoComplete from '../../../components/components/common/GoogleAutoComplete'
import {Chat_Api, Chat_Key} from '../../../services/constants/index'
import {separatorHeight, getHeaders} from '../../../utils/helpers'
import {storeUserData} from '../../../services/store/actions'

const EditProfile = ({navigation}) => {
    const {userData} = useSelector((state) => state.user)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [about, setAbout] = useState('')
    const [location, setLocation] = useState('')
    const [lat, setLat] = useState('')
    const [lng, setLng] = useState('')
    const [pickerVisibleWeight, setPickerVisibleWeight] = useState(false)
    const [birthDate, setBirthDate] = useState(new Date())
    const [_birthDate, _setBirthDate] = useState(false)
    const [gender, setGender] = useState('')

    //states for handling errors
    const [firstNameError, setFirstNameError] = useState(false)
    const [lastNameError, setLastNameError] = useState(false)
    const [phoneError, setPhoneError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [aboutError] = useState(false)

    //states for handling focus
    const [focusFirstName, setFocusFirstName] = useState(false)
    const [focusLastName, setFocusLastName] = useState(false)
    const [focusPhone, setFocusPhone] = useState(false)
    const [focusEmail, setFocusEmail] = useState(false)
    const [focusAbout, setFocusAbout] = useState(false)

    //states for setting error text
    const [errorTextFirstName, setErrorTextFirstName] = useState(null)
    const [errorTextLastName, setErrorTextLastName] = useState(null)
    const [errorTextPhone, setErrorTextPhone] = useState(null)
    const [errorTextEmail, setErrorTextEmail] = useState(null)
    const [errorTextAbout] = useState(null)
    const [errorTextBODate] = useState(null)

    const [isValidRequest] = useState(false)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const dispatch = useDispatch()
    //bottom sheet manange
    const [image, setimage] = useState('')
    const photoOptionsSheetRef = useRef()

    useEffect(() => {
        fun()
    }, [])
    const fun = async () => await profilGetDataApiHandler()
    const submitFirstName = () => {
        const error = ValidateInput('firstName', firstName)
        setErrorTextFirstName(error ? error : null)
        setFirstNameError(error ? true : false)
        setFocusFirstName(false)
        if (!error && !isValidRequest) {
            setFocusLastName(true)
        }
    }

    const submitLastName = () => {
        const error = ValidateInput('lastName', lastName)
        setErrorTextLastName(error ? error : null)
        setLastNameError(error ? true : false)
        setFocusLastName(false)
        if (!error && !isValidRequest) {
            setFocusEmail(true)
        }
    }

    const submitPhone = () => {
        const error = ValidateInput('phone', phone)
        setErrorTextPhone(error ? error : null)
        setPhoneError(error ? true : false)
        setFocusPhone(false)
    }

    const submitEmail = () => {
        const error = ValidateEmail(email)
        setErrorTextEmail(error ? 'Valid email is required' : null)
        setEmailError(error ? true : false)
        setFocusEmail(false)
        if (!error && !isValidRequest) {
            setFocusPhone(true)
        }
    }

    const submitAbout = () => setFocusAbout(false)

    const changeDOBDHandler = (d) => {
        setBirthDate(d)
        _setBirthDate(true)
        setOpen(false)
    }

    const hoursVisibleHandler = () => setPickerVisibleWeight(!pickerVisibleWeight)

    const hoursSelectionHandler = (item) => {
        setPickerVisibleWeight(false)
        setGender(item.name)
    }

    const changeFirstName = (text) => {
        text = text.trimStart()
        setFirstName(text)
    }
    const changeAbout = (text) => {
        text = text.trimStart()
        setAbout(text)
    }
    const changeLastName = (text) => {
        text = text.trimStart()
        setLastName(text)
    }

    const changePhone = (text) => {
        let reg = new RegExp(`^[0-9]{1,45}$`)
        if (text.length > 0) {
            if (reg.test(text)) {
                setPhone(text)
            }
        } else {
            setPhone(text)
        }
    }

    const changeEmail = (text) => {
        text = text.toLowerCase().trim()
        setEmail(text)
    }

    const resetAllFocus = () => {
        setFocusFirstName(false)
        setFocusLastName(false)
        setFocusPhone(false)
        setFocusEmail(false)
    }

    const checkIsValidRequest = () => {
        if (!ValidateInput('firstName', firstName) && !ValidateInput('lastName', lastName) && !ValidateInput('phone', phone)) {
            setErrorTextFirstName(null)
            setFirstNameError(false)
            setFocusFirstName(false)
            setErrorTextLastName(null)
            setLastNameError(false)
            setFocusLastName(false)
            setErrorTextPhone(null)
            setPhoneError(false)
            setFocusPhone(false)
            return true
        } else {
            firstName == '' ? (setErrorTextFirstName('First name is required'), setFirstNameError(true), setFocusFirstName(false)) : (setErrorTextFirstName(null), setFirstNameError(false), setFocusFirstName(false))
            lastName == '' ? (setErrorTextLastName('Last name is required'), setLastNameError(true), setFocusLastName(false)) : (setErrorTextLastName(null), setLastNameError(false), setFocusLastName(false))
            phone == '' || phone.length < 4 ? (setErrorTextPhone('Valid phone number is required'), setPhoneError(true), setFocusPhone(false)) : (setErrorTextPhone(null), setPhoneError(false), setFocusPhone(false))
            return false
        }
    }

    const openGallery = async () => {
        await ImagePicker.openPicker({
            smartAlbums: ['UserLibrary'],
            mediaType: 'photo',
            includeBase64: true,
            multiple: false
        })
            .then((response) => {
                let _data = 'data:image/png;base64,' + response.data
                setimage(_data)
            })
            .catch((error) => {
                console.log('gallery error', error.message)
            })
    }
    const openCamera = () => {
        ImagePicker.openCamera({
            mediaType: 'photo',
            includeBase64: true
        })
            .then((image) => {
                setimage('data:image/png;base64,' + image.data)
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

    const profilGetDataApiHandler = async () => {
        const headers = getHeaders(userData.auth_token)
        try {
            setLoading(true)
            await axios
                .get(`user/user_profile`, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        const formatSDate = response.data.data.dob ? moment(response.data.data.dob, 'M/D/YYYY, hh:mm A') : response.data.data.createdAt ? new Date(response.data.data.createdAt) : new Date()
                        const dateObjectS = new Date(formatSDate)
                        response.data.data.dob ? _setBirthDate(true) : null
                        setFirstName(response.data.data.first_name)
                        setLastName(response.data.data.last_name)
                        setPhone(response.data.data.phone)
                        setEmail(response.data.data.email)
                        setAbout(response.data.data.about ? response.data.data.about : '')
                        response.data.data.image ? setimage(IMAGES_BASE_URL + response.data.data.image) : null
                        setBirthDate(dateObjectS)
                        setGender(response.data.data.gender ? response.data.data.gender : '')
                        setLocation(response.data.data.address ? response.data.data.address : '')
                        setLoading(false)
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
    }

    const updateProfileHandler = async (item) => {
        const result = checkIsValidRequest()
        if (result) {
            const _imageData = image.startsWith('http') ? image.substring(image.lastIndexOf('/') + 1) : image
            setLoading(true)
            const headers = getHeaders(userData.auth_token)
            const data = {
                image: _imageData,
                first_name: firstName,
                last_name: lastName,
                phone: phone,
                dob: _birthDate ? moment(birthDate).format('MM/DD/YYYY') : null,
                gender: gender,
                about: about,
                address: location,
                lat: lat,
                lng: lng,
                email: userData.email
            }
            try {
                await axios
                    .post('user/update', data, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            setLoading(false)
                            dispatch(storeUserData(response.data.data))
                            await upDateChatUser(response.data.data)
                            navigation.goBack()
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
        }
    }
    const upDateChatUser = async (user, accessToken) => {
        const url = `${Chat_Api}api/users/${user.id}a`
        const data = {
            name: user.first_name + ' ' + user.last_name,
            email: user.email,
            picture: IMAGES_BASE_URL + user.image
        }
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${Chat_Key}`
        }
        await axios
            .put(url, data, {headers})
            .then((response) => {
                const updateUse = response.data
                console.log('updateUse:-  ', updateUse)
            })
            .catch((error) => {
                console.log('createdUse Error:', error)
            })
    }

    const closeCB = () => photoOptionsSheetRef.current.close()

    const toggleDatePicker = () => setOpen(true)

    const onLocattionSelection = (data, details) => {
        setLocation(data?.description)
        setLat(details.geometry.location.lat)
        setLng(details.geometry.location.lng)
    }
    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            <Header back={true} backCB={() => navigation.goBack()} title={'Personal Info'} />

            <View style={styles.topContainer}>
                <KeyboardAwareScrollView enableOnAndroid={true} showsVerticalScrollIndicator={false} contentContainerStyle={{alignItems: 'center', flexGrow: 1, keyboardShouldPersistTaps: 'handled'}}>
                    <TouchableOpacity onPress={() => photoOptionsSheetRef.current.open()} style={styles.touchable}>
                        {image && (
                            <View style={styles.pickerS}>
                                <FastImage source={require('../../../assets/icons/screens/image_picker.png')} resizeMode="contain" style={styles.iconStyle} />
                            </View>
                        )}
                        {image ? <FastImage source={{uri: image}} resizeMode="cover" style={styles.logoArea} /> : <FastImage source={require('../../../assets/icons/screens/camera.png')} resizeMode="contain" style={styles.iconStyle} />}
                    </TouchableOpacity>
                    {separatorHeight()}
                    <InputWithLabels
                        showLabelCB={true}
                        value={firstName}
                        placeholder="First name"
                        showPlaceHolder={true}
                        placeholderInner={'Enter your first name'}
                        isError={firstNameError}
                        isFocus={focusFirstName}
                        onFocus={() => {
                            resetAllFocus()
                            setFocusFirstName(true)
                        }}
                        onBlur={() => submitFirstName()}
                        errorText={errorTextFirstName}
                        onChangeText={(text) => changeFirstName(text)}
                        style={styles.inputStyle}
                    />
                    <InputWithLabels
                        showLabelCB={true}
                        value={lastName}
                        placeholder="Last name"
                        showPlaceHolder={true}
                        placeholderInner={'Enter your last name'}
                        isError={lastNameError}
                        isFocus={focusLastName}
                        onFocus={() => {
                            resetAllFocus()
                            setFocusLastName(true)
                        }}
                        onBlur={() => submitLastName()}
                        errorText={errorTextLastName}
                        onChangeText={(text) => changeLastName(text)}
                        style={styles.inputStyle}
                    />
                    <InputWithLabels
                        editable={false}
                        showLabelCB={true}
                        value={email}
                        showPlaceHolder={true}
                        placeholderInner={'Email'}
                        placeholder="Enter email"
                        keyboardType="email-address"
                        secure={false}
                        isError={emailError}
                        onBlur={() => submitEmail()}
                        isFocus={focusEmail}
                        onFocus={() => {
                            resetAllFocus()
                            setFocusEmail(true)
                        }}
                        errorText={errorTextEmail}
                        autoCapitalize="none"
                        onChangeText={(text) => changeEmail(text)}
                        style={styles.inputStyle}
                    />
                    <InputWithLabels
                        showLabelCB={true}
                        value={phone}
                        placeholder="Phone No."
                        showPlaceHolder={true}
                        placeholderInner={'Enter phone number'}
                        keyboardType="number-pad"
                        secure={false}
                        isError={phoneError}
                        onBlur={() => submitPhone()}
                        isFocus={focusPhone}
                        onFocus={() => {
                            resetAllFocus()
                            setFocusPhone(true)
                        }}
                        errorText={errorTextPhone}
                        onChangeText={(text) => changePhone(text)}
                        style={styles.inputStyle}
                    />
                    {separatorHeight()}
                    <PickerDate
                        icon={true}
                        showText={_birthDate}
                        onPress={toggleDatePicker}
                        fromDate={'Date Of Birth'}
                        open={open}
                        modeDate={true}
                        mode={'date'}
                        selectedDate={birthDate}
                        handleDateChange={changeDOBDHandler}
                        style={styles.pickerDateStyle}
                        styleErrorText={styles.pickerStyleErrorText}
                        stylePicker={styles.stylePickerD}
                        onCancel={() => {
                            setOpen(false)
                        }}
                        errorText={errorTextBODate}
                    />
                    {separatorHeight()}
                    <Picker
                        data={[
                            {name: 'Male', id: 0},
                            {name: 'Female', id: 1},
                            {name: 'Transgender', id: 1},
                            {name: 'Other', id: 1}
                        ]}
                        title={'Gender'}
                        titleTextStyle={styles.titleTextStyleC}
                        visible={pickerVisibleWeight}
                        onPress={hoursVisibleHandler}
                        pickerHandler={hoursSelectionHandler}
                        selectedItem={gender}
                        style={styles.selectedAllow}
                        styleDropDown={styles.dropDownS}
                        listContainerStyle={styles.listContainerStyleH}
                    />
                    <View style={styles.textProducts}>
                        <Text style={styles.locationText}>{'Location'}</Text>
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
                        containerStyle={{
                            width: wp(88),
                            alignSelf: 'center'
                        }}
                    />
                    <InputWithLabels
                        showLabelCB={true}
                        value={about}
                        placeholder="About"
                        showPlaceHolder={true}
                        placeholderInner={'Enter about you...'}
                        isError={aboutError}
                        isFocus={focusAbout}
                        onFocus={() => {
                            resetAllFocus()
                            setFocusAbout(true)
                        }}
                        multiline={true}
                        maxHeight={110}
                        minHeight={110}
                        onBlur={() => submitAbout()}
                        errorText={errorTextAbout}
                        onChangeText={(text) => {
                            changeAbout(text)
                        }}
                        style={styles.bioStyle}
                    />
                    {/* {separatorHeight()} */}
                </KeyboardAwareScrollView>
            </View>
            <ActiveButton title={'Save Changes'} onPress={updateProfileHandler} />
            <PhotoOptionsBottomSheet setRef={photoOptionsSheetRef} title={'Add Photo'} skipTitle={'cancel'} accessAllowGallery={() => checkPermissions('photo')} accessAllowCamera={() => checkPermissions('camera')} skipButtonCB={closeCB} />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width: wp('100%'),
        flex: 1,
        backgroundColor: Colors.White,
        alignItems: 'center'
    },
    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'

        // marginTop: hp('2%')
        // backgroundColor: Colors.White,
        // borderRadius: wp('2%'),
        // shadowColor: Colors.Shadow_Color,
        // shadowOffset: {
        //     width: 0,
        //     height: 0
        // },
        // shadowOpacity: 0.1,
        // shadowRadius: 1,
        // elevation: 5,
        // marginBottom: hp('2%')
    },
    pickerConatiner: {
        width: wp('86%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    iconStyle: {
        width: wp('8%'),
        height: wp('8%'),
        alignSelf: 'center'
    },
    pickerS: {
        position: 'absolute',
        width: wp('8%'),
        height: wp('8%'),
        alignSelf: 'flex-end',
        top: hp(10),
        zIndex: 1
    },
    logoArea: {
        width: wp('30%'),
        height: wp('30%'),
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: hp('10%'),
        zIndex: 0
    },
    titleTextStyleC: {
        width: wp('27%')
    },
    selectedAllow: {
        width: wp('88%'),
        height: hp('6%')
    },
    dropDownS: {
        width: wp('88%')
    },
    listContainerStyleH: {
        width: wp('88%')
    },
    pickerDateStyle: {
        width: wp('88%'),
        paddingHorizontal: wp('2')
    },
    pickerStyleErrorText: {
        width: wp('88%')
    },
    stylePickerD: {
        width: wp('70%')
    },
    topContainer: {
        width: wp('100%'),
        alignSelf: 'center',
        marginTop: hp('1%'),
        alignItems: 'center',
        flex: 1
    },
    scrollBody: {
        flex: 1,
        alignItems: 'center'
    },

    buttonContainer: {
        bottom: hp('1%'),
        alignSelf: 'center',
        marginTop: hp('2')
    },
    touchable: {
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.5),
        borderRadius: wp('15%'),
        width: wp('30%'),
        height: wp('30%'),
        justifyContent: 'center',
        alignSelf: 'center',
        zIndex: -1
    },
    loginButton: {
        marginTop: hp('2%')
    },
    inputStyle: {
        width: wp('88%'),
        backgroundColor: Colors.White
    },
    bioStyle: {
        width: wp('88%'),
        textAlignVertical: 'top',
        backgroundColor: Colors.White
        // paddingTop: hp('1')
    },
    textProducts: {
        width: wp('88%'),
        paddingBottom: hp(0.5)
    },
    locationText: {
        marginTop: hp('1'),
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Platform.OS == 'android' ? Typography.FONT_SIZE_13 : Typography.FONT_SIZE_15
    }
})

export default EditProfile
