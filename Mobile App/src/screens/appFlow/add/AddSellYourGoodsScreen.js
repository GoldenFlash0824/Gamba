import React, {useEffect, useRef, useState} from 'react'
import {Platform, StyleSheet, Text, TouchableOpacity, View, ScrollView, Alert, PermissionsAndroid, Pressable} from 'react-native'
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
import Picker from '../../../components/components/common/Picker'
import ToggelButton from '../../../components/components/common/ToggleButton'
import {separatorHeight, getHeaders} from '../../../utils/helpers'
import ValidateInput from '../../../utils/ValidateInput'
import ShowAlert from '../../../components/components/common/ShowAlert'
import PhotoOptionsBottomSheet from '../../../components/components/common/PhotoOptionsBottomSheet'
import {IMAGES_BASE_URL} from '../../../services'
import SmallInputWithLabels from '../../../components/components/common/SmallInputWithLabels'
import SmallPicker from '../../../components/components/common/SmallPicker'
import TradeSheetInputs from '../../../components/components/common/TradeSheetInputs'
import MultipleSelectPicker from '../../../components/components/common/MultipleSelectPicker'
import PickerDate from '../../../components/components/common/PickerDate'

const AddSellYourGoodsScreen = (props) => {
    // const {categoryData} = useSelector((state) => state.user)
    const {userData} = useSelector((state) => state.user)

    const [index, setIndex] = useState(true)
    const [basicSelected, setBasicSelected] = useState(true)
    const [donationSelected, setDonationSelected] = useState(false)
    const [tradeSelected, setTradeSelected] = useState(false)
    const [productData, setProductData] = useState({})
    const [unlimitedDate, setUnlimitedDate] = useState(false)
    const photoOptionsSheetRef = useRef()
    const [updateState, setUpdateState] = useState(false)

    const [weight, setWeight] = useState('Unit')
    const [allowPerson, setAllowPerson] = useState('')
    const [productType, setProductType] = useState('Sell')

    const [imagesData, setImagesData] = useState([])
    const [tradeData, setTradeData] = useState([])
    const imagesLength = 2
    const [focusAllowPerson, setFocusAllowPerson] = useState(false)
    const [allowPersonError, setAllowPersonError] = useState(false)

    const [errorTextAllowPerson, setErrorTextAllowPerson] = useState(null)
    const [errorTextImages, setErrorTextImages] = useState(null)
    const [errorTextTrade, setErrorTextTrade] = useState(null)

    const [pickerVisibleWeight, setPickerVisibleWeight] = useState(false)
    const [productTypeVisible, setProductTypeVisiblet] = useState(false)

    const [isValidRequest, setIsValidRequest] = useState(false)

    const [isDonation, setIsDonation] = useState(false)
    const [isSell, setIsSell] = useState(true)
    const [isTrade, setIsTrade] = useState(false)

    //Donation
    const [category, setCategory] = useState('')
    const [categoryError, setCategoryError] = useState(false)
    const [showOtherInput, setShowOtherInput] = useState(false)
    const [productName, setProductName] = useState('')
    const [addProduct, setAddProduct] = useState('')
    const [productId, setProductId] = useState('')

    const [price, setPrice] = useState('')
    const [discount, setDiscount] = useState('0')

    const [focusProductName, setFocusProductName] = useState(false)
    const [focusAddProduct, setFocusAddProduct] = useState(false)
    const [focusPrice, setFocusPrice] = useState(false)
    const [focusDiscount, setFocusDiscount] = useState(false)

    const [priceError, setPriceError] = useState(false)
    const [productNameError, setProductNameError] = useState(false)
    const [addProductError, setAddProductError] = useState(false)
    const [discountError, setDiscountError] = useState(false)

    const [basicComplete, setBasicComplete] = useState(false)
    const [productInfoC, setProductInfoC] = useState(false)
    const [complete, setComplete] = useState(false)

    const [errorTextDiscount, setErrorTextDiscount] = useState(null)
    const [errorTextProductName, setErrorTextProductName] = useState(null)
    const [errorTextAddProduct, setErrorTextAddProduct] = useState(null)
    const [errorTextPrice, setErrorTextPrice] = useState(null)

    const [pickerVisible, setPickerVisible] = useState(false)

    //Trade
    const {chemicalData} = useSelector((state) => state.user)

    const [loading, setLoading] = useState(false)
    const [distance, setDistance] = useState('')

    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [daysOrWeeks, setDaysOrWeeks] = useState('Hour(s)')
    const [numbers, setNumbers] = useState('0')

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

    const [isPickUp, setIsPickUp] = useState(false)
    const [isDelivery, setIsDelivery] = useState(false)
    const [isNone, setIsNone] = useState(false)

    const [open, setOpen] = useState(false)
    const [openTo, setOpenTo] = useState(false)

    const [openChemicals, setOpenChemicals] = useState(false)
    const [chemicalsValue, setChemicalsValue] = useState([])
    const [chemicalsList, setChemicalsList] = useState(chemicalData)
    const [categoryData, setCategoryData] = useState([])

    useEffect(() => {
        if (props.visible) {
            props._editProductData ? updateData(props._editProductData) : null
            setIndex(false)
        }
        getCategories()
    }, [props.visible])

    const updateData = (editData) => {
        let images = []
        let _addedChemical = []
        if (editData.id) {
            for (let i = 0; i < editData.images?.length; i++) {
                images.push(IMAGES_BASE_URL + editData.images[i])
            }

            setUnlimitedDate(editData.isUnlimitted)
            setImagesData(images)
            setProductType(editData.is_trade ? 'Trade' : editData.is_donation ? 'Giveaway' : 'Sell')
            setTradeData(editData.trade_with ? editData.trade_with : editData.trade?.length > 0 ? editData.trade[0].title : [])
            setIsDonation(editData.is_donation)
            setIsTrade(editData.is_trade)
            setIsSell(!editData.is_trade && !editData.is_donation)
            setWeight(editData.unit)
            setAllowPerson(editData.allow_per_person ? editData.allow_per_person.toString() : '')
            for (let i = 0; i < categoryData.length; i++) {
                if (categoryData[i].id == editData.category_id) {
                    setCategory(categoryData[i].name)
                    setProductId(categoryData[i].id)
                }
            }
            setProductName(editData.name ? editData.name : '')
            setPrice(editData.is_trade ? '0' : editData.price ? editData.price.toString() : '')
            setDiscount(editData.discount ? editData.discount.toString() : '0')
            setNumbers(editData.allow_to_0rder_advance ? editData.allow_to_0rder_advance?.toString() : '1')
            setDaysOrWeeks(editData.allow_to_0rder ? editData.allow_to_0rder : 'Hour(s)')
            const formatSDate = editData.available_from ? moment(editData.available_from, 'MM/DD/YYYY') : new Date()

            const dateObjectS = new Date(formatSDate)
            const formatEDate = editData.available_to ? moment(editData.available_to, 'MM/DD/YYYY') : new Date()

            const dateObjectE = new Date(formatEDate)
            setStartDate(dateObjectS)
            setEndDate(dateObjectE)
            setQuantity(editData.quantity ? editData.quantity.toString() : '1')
            setIsPickUp(editData.is_pickUp ? editData.is_pickUp : false)
            setIsDelivery(editData.is_delivery ? editData.is_delivery : false)
            setIsOrganic(editData.is_organic == null ? false : editData.is_organic)
            setDescription(editData.caption ? editData.caption : '')
            setDistance(editData.distance ? editData.distance : '')
            if (editData.chemical_data) {
                for (i = 0; i < editData.chemical_data.length; i++) {
                    editData.chemical_data[i].chemical_data_detail
                    _addedChemical.push(editData.chemical_data[i].chemical_data_detail.title)
                }
                setChemicalsValue(_addedChemical)
            }
        }
    }

    const onBasicPress = () => {
        setBasicSelected(true), setDonationSelected(false), setTradeSelected(false)
    }
    const onDonationPress = () => {
        basicSelected ? onPressNextB('Donation') : (setDonationSelected(true), setBasicSelected(false), setTradeSelected(false))
    }
    const onTradePress = () => {
        basicSelected ? onPressNextB('Trade') : donationSelected ? onPressNextD() : (setTradeSelected(true), setBasicSelected(false), setDonationSelected(false))
    }

    //Basic

    const weightVisibleHandler = () => {
        setPickerVisibleWeight(!pickerVisibleWeight)
    }
    const productTypeVH = () => {
        setProductTypeVisiblet(!productTypeVisible)
    }
    const weightSelectionHandler = (item) => {
        setPickerVisibleWeight(false)
        setWeight(item.name)
    }

    const onSelectProductType = (item) => {
        setProductTypeVisiblet(false)
        setProductType(item.name)
        setErrorTextAllowPerson(null)
        setAllowPersonError(false)
        setErrorTextTrade(null)
        item.name == 'Sell' ? (setIsSell(true), setIsDonation(false), setIsTrade(false)) : item.name == 'Trade' ? (setIsSell(false), setIsDonation(false), setIsTrade(true)) : (setIsDonation(true), setIsSell(false), setIsTrade(false))
    }

    const handleToggleTrade = (newIsOn) => {
        setIsTrade(newIsOn)
        setIsDonation(false)
        setIsSell(false)
    }

    const tradeDataCB = (data) => {
        setTradeData(data)
        setErrorTextTrade(null)
    }

    const checkIsValidRequestB = (allowPerson, imagesData, _weight, _isDonation) => {
        if (imagesData.length > 0 && _weight != '') {
            setErrorTextTrade(null)
            return true
        } else {
            imagesData.length < 1 ? setErrorTextImages('Image is required') : setErrorTextImages(null)
            return false
        }
    }
    const removeImage = async (path, index) => {
        imagesData.splice(index, 1)
        setImagesData(imagesData)
        setUpdateState(!updateState)
    }
    const submitAllowPerson = () => {
        setErrorTextAllowPerson(null)
        setAllowPersonError(false)
        setFocusAllowPerson(false)
    }

    const onChangeAllowPerson = (text) => {
        let reg = new RegExp(`^[0-9]{1,45}$`)
        if (text.length > 0) {
            if (reg.test(text)) {
                setAllowPerson(text)
            }
        } else {
            setAllowPerson(text)
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
                <FastImage source={require('../../../assets/icons/screens/upload.png')} resizeMode="contain" style={styles.icons} />
                <Text style={styles.unSelected}>{'Upload'}</Text>
            </TouchableOpacity>
        )
    }

    const openGallery = async () => {
        ImagePicker.openPicker({
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
        ImagePicker.openCamera({
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
                    ShowAlert({type: 'error', description: `You can select only ${imagesLength} photos`})
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

    const onPressNextB = (type) => {
        const result = checkIsValidRequestB(allowPerson, imagesData, weight, isDonation)
        setBasicComplete(result)
        if (result) {
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
            if (productData?.id) {
                productData.is_Sell = isSell
                productData.is_donation = isDonation
                productData.is_allowPerson = allowPerson
                productData.images = savedImages
                productData.unit = weight
            } else {
                productData.is_Sell = isSell
                productData.is_donation = isDonation
                productData.is_allowPerson = allowPerson
                productData.images = JSON.stringify(savedImages)
                productData.unit = weight
                type == 'Donation' ? (setDonationSelected(true), setBasicSelected(false), setTradeSelected(false)) : onPressNextD()
            }
        }
    }

    //Donation
    const submitProductName = () => {
        const error = ValidateInput('productName', productName)
        setErrorTextProductName(error ? error : null)
        setProductNameError(error ? true : false)
        setFocusProductName(false)
        if (!error) {
            setFocusPrice(false)
        }
    }

    const submitPrice = () => {
        const error = ValidateInput('price', price)
        setErrorTextPrice(error ? error : null)
        setPriceError(error ? true : false)
        setFocusPrice(false)
        if (!error && !isValidRequest) {
            setFocusDiscount(false)
        }
    }

    const submitDiscount = () => {
        const error = ValidateInput('discount', discount)
        setErrorTextDiscount(error ? error : null)
        setDiscountError(error ? true : false)
        setFocusDiscount(false)
    }
    const submitAddProduct = () => {
        const error = ValidateInput('addProduct', addProduct)
        setErrorTextAddProduct(error ? error : null)
        setAddProductError(error ? true : false)
        setFocusAddProduct(false)
    }

    const resetAllFocus = () => {
        setFocusProductName(false)
        setFocusAddProduct(false)
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

    const onChangeDiscount = (text) => {
        let reg = new RegExp(`^[.0-9]{1,45}$`)
        if (text.length > 0 && reg.test(text)) {
            let numericValue = parseFloat(text)
            if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
                setDiscount(numericValue.toString())
            }
        } else {
            setDiscount(text)
        }
    }

    const checkIsValidRequestD = (category, productName, price, discount) => {
        if (category != '' && !ValidateInput('productName', productName) && (isTrade || isDonation ? true : price == '' || price == 0 ? false : !ValidateInput('price', price)) && !ValidateInput('discount', discount) && (isTrade ? tradeData.length > 0 : true)) {
            setIsValidRequest(true)
            setErrorTextProductName(null)
            setProductNameError(false)
            setFocusProductName(false)
            setCategoryError(false)
            setErrorTextPrice(null)
            setPriceError(false)
            setFocusPrice(false)
            return true
        } else {
            price == '' || price == 0 ? (productData?.is_donation || productData?.is_trade ? (setErrorTextPrice(null), setPriceError(false), setFocusPrice(false)) : (setErrorTextPrice('Price is required'), setPriceError(true), setFocusPrice(false))) : (setErrorTextPrice(null), setPriceError(false), setFocusPrice(false))
            category == '' ? setCategoryError(true) : setCategoryError(false)
            productName == '' ? (setErrorTextProductName('Product name is required'), setProductNameError(true), setFocusProductName(false)) : (setErrorTextProductName(null), setProductNameError(false), setFocusProductName(false))
            isTrade ? (tradeData.length < 1 ? setErrorTextTrade(true) : setErrorTextTrade(null)) : setErrorTextTrade(null)
            return false
        }
    }

    const pickerVisibleHandler = () => {
        setPickerVisible(!pickerVisible)
    }

    const pickerSelectionHandler = (item) => {
        setPickerVisible(false)
        if (item.name === 'Other') {
            setCategory(item.name)
            setShowOtherInput(true)
        } else {
            setCategory(item.name)
            setShowOtherInput(false)
        }
        setCategoryError(false)
        setProductId(item.id)
    }
    const onPressNextD = () => {
        const result = checkIsValidRequestD(category, productName, price, discount)
        setProductInfoC(result)
        if (result) {
            if (productData.id) {
                productData.is_Sell = productData?.is_Sell
                productData.is_allowPerson = productData?.is_allowPerson
                productData.is_donation = productData?.is_donation
                productData.is_trade = productData?.is_trade
                productData.trade_with = productData?.trade_with
                productData.images = productData?.images
                productData.unit = productData?.unit
                productData.category_id = productId
                productData.name = productName
                productData.price = price
                productData.discount = discount
            } else {
                productData.category_id = productId
                productData.name = productName
                productData.price = price
                productData.discount = discount
                setTradeSelected(true)
                setBasicSelected(false)
                setDonationSelected(false)
            }
        } else {
            setTradeSelected(false)
            setBasicSelected(false)
            setDonationSelected(true)
        }
    }

    //Trade

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
        const error = ValidateInput('numbers', numbers)
        setErrorTextNumbers(error ? error : null)
        setNumbersError(error ? true : false)
        setFocusNumbers(false)
    }
    // const onChangeNumbers = (text) => {
    //     let reg = new RegExp(`^[0-9]{1,45}$`)
    //     if (text.length > 0) {
    //         if (reg.test(text)) {
    //             setNumbers(text)
    //         }
    //     } else {
    //         setNumbers(text)
    //     }
    // }

    const onChangeNumbers = (text) => {
        let reg

        if (daysOrWeeks === 'Hour(s)') {
            reg = /^(0?[0-9]|1[0-9]|2[0-3])$/
        } else {
            reg = /^(?:[1-9]|10)$/
        }

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

        {
            newIsOn ? ShowAlert({type: 'Info', description: 'If you choose to go organic but continue to use sprays on your crop, please mention this in the description of your product'}) : null
        }
    }
    const changeStartDHandler = (d) => {
        if (endDate == '') {
            setStartDate(d)
            setOpen(false)
        } else {
            const _dS = new Date(d)
            const _dE = new Date(endDate)
            if (!unlimitedDate ? _dE >= _dS : true) {
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
        const _dS = new Date(startDate)
        const _dE = new Date(d)

        if (_dE >= _dS) {
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

    const checkIsValidRequestT = (_numbers, __endDate, _startDate, quantity, _isOrganic, _chemicalsValue, description) => {
        const _dS = new Date(_startDate)
        const _dE = new Date(__endDate)
        const _dSS = moment(_startDate).format('MM-DD-YYYY')
        const _dEE = moment(__endDate).format('MM-DD-YYYY')
        if (_numbers != '' && (unlimitedDate ? true : _dE == _dS ? true : _dE >= _dS) && !ValidateInput('description', description) && (isDelivery ? !ValidateInput('distance', distance) : true)) {
            setIsValidRequest(true)
            setErroTextStartDate(null)
            setErroTextEndDate(null)
            setErrorTextDescription(null)
            setDescriptionError(false)
            setFocusDescription(false)
            setErrorTextTrade(true)
            setErrorTextTrade(null)
            setErrorTextDistance(null)
            setDistanceError(false)
            setFocusDistance(false)
            return true
        } else {
            _numbers == '' ? (setErrorTextNumbers('Required'), setNumbersError(true), setFocusNumbers(false)) : (setErrorTextNumbers(null), setNumbersError(false), setFocusNumbers(false))
            quantity == '' ? (productData?.is_donation || productData?.is_trade ? (setErrorTextQuantity('Quantity is required'), setQuantityError(true), setFocusQuantity(false)) : (setErrorTextQuantity(null), setQuantityError(false), setFocusQuantity(false))) : (setErrorTextQuantity(null), setQuantityError(false), setFocusQuantity(false))
            description == '' ? (setErrorTextDescription('Description is required'), setDescriptionError(true), setFocusDescription(false)) : (setErrorTextDescription(null), setDescriptionError(false), setFocusDescription(false))
            _dSS !== _dEE && _dS >= _dE && !unlimitedDate ? (setErroTextStartDate('Start date should be smallered'), setErroTextEndDate('End date should be greater')) : (setErroTextStartDate(null), setErroTextEndDate(null))

            // !_isOrganic && _chemicalsValue.length < 1 ? setChemcalIdError(true) : setChemcalIdError(false)
            isDelivery && distance == '' ? (setErrorTextDistance('Required'), setDistanceError(true), setFocusDistance(false)) : (setErrorTextDistance(null), setDistanceError(false), setFocusDistance(false))
            return false
        }
    }
    const postHandler = async () => {
        const headers = getHeaders(userData.auth_token)
        let url = props._editProductData?.id ? `user/product/update_product/${props._editProductData?.id}` : 'user/product/add_new_product'
        const result = checkIsValidRequestT(numbers, endDate, startDate, quantity, isOrganic, chemicalsValue, description)
        setComplete(result)
        const matchingIds = chemicalData.reduce((ids, item) => {
            if (chemicalsValue.includes(item.value)) {
                ids.push(item.id)
            }
            return ids
        }, [])
        const goodsData = {
            is_donation: isDonation,
            allow_per_person: productData?.is_allowPerson != '' ? productData?.is_allowPerson : 1,
            is_trade: isTrade,
            trade_with: tradeData,
            images: productData?.images,
            category_id: productData?.category_id,
            name: productData?.name,
            unit: productData?.unit,
            price: price,
            discount: discount ? discount : 0,
            // available_from: moment(startDate).format('MM/DD/YY'),
            // available_to: moment(endDate).format('MM/DD/YY'),
            available_from: props._editProductData?.id ? moment(startDate).format('MM/DD/YY') : moment.tz(startDate, 'America/New_York').format(),
            available_to: props._editProductData?.id ? moment(endDate).format('MM/DD/YY') : moment.tz(endDate, 'America/New_York').format(),
            is_delivery: isDelivery,
            is_pickUp: isPickUp,
            distance: distance,
            quantity: isDonation || isTrade ? 0 : quantity,
            is_organic: isOrganic,
            chemical_id: matchingIds,
            caption: description,
            allow_to_0rder: isDonation || isTrade ? null : daysOrWeeks,
            allow_to_0rder_advance: isDonation || isTrade ? 1 : numbers,
            isUnlimitted: unlimitedDate
        }
        if (result) {
            setLoading(true)
            try {
                await axios
                    .post(url, goodsData, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            setLoading(false)
                            // ShowAlert({type: 'success', description: response.data.message})
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
        }
    }

    const getCategories = async () => {
        const headers = getHeaders(userData.auth_token)
        try {
            await axios
                .get(`user/product/get_all_category?${(isWeb = true)}`, headers)
                .then(async (response) => {
                    if (response.data.success === true) {
                        let _categories = []
                        for (let i = 0; i < response.data.data.category.length; i++) {
                            _categories.push({name: response.data.data.category[i].title, id: response.data.data.category[i].id})
                        }
                        setCategoryData(_categories)
                        setLoading(false)
                    } else {
                        setLoading(false)
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
    const hoursSelectionHandler = (item) => {
        setPickerVisibleWeight(false)
        setNumbers(item.name === 'Hour(s)' ? '0' : '1')
        setDaysOrWeeks(item.name)
    }

    const hoursVisibleHandler = () => {
        setPickerVisibleWeight(!pickerVisibleWeight)
    }

    const infoHandler = () => {
        ShowAlert({type: 'Info', description: 'Set this up if you allow customers to order your products hour(s) or day(s) in advance; otherwise, leave it alone.'})
    }
    const infoHandlerD = () => {
        ShowAlert({type: 'Info', description: 'If you limit people with the amount of product you donate, please indicate the quantity here, if do not, go next.'})
    }

    const renderImageCell = (path, index) => {
        return (
            <View key={index}>
                <FastImage source={{uri: path.data ? path.data : path}} style={styles.mapImage}>
                    <TouchableOpacity
                        onPress={() => {
                            removeImage(path, index)
                        }}
                        activeOpacity={0.8}>
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
                <View style={styles.leftContainer}>
                    <TouchableOpacity onPress={props.onCloseCB} activeOpacity={0.8}>
                        <FastImage source={require('../../../assets/icons/screens/left.png')} style={styles.backIcon} tintColor={Colors.Black} />
                    </TouchableOpacity>
                    {/* <Text style={styles.titleText}>{props.title + '  > '} </Text>
                    <Text style={styles.titleText}>{isDonation ? 'Donation' : isTrade ? 'Trade' : 'Product'}</Text>
               */}
                </View>
                <View activeOpacity={0.8} style={styles.midContainer}>
                    <Text style={styles.titleText}>{props?.title?.includes('Sell') ? 'Sell Your Goods' : props?.title}</Text>
                </View>
                <View style={styles.rightContainer}></View>
            </View>
            {separatorHeight()}
            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => onBasicPress()} style={styles.container}>
                    <Text style={basicSelected ? styles.selected : basicComplete ? styles.selectedC : styles.unSelected}>Basic</Text>
                </TouchableOpacity>
                <FastImage source={require('../../../assets/icons/screens/right.png')} style={styles.backIcon} tintColor={basicComplete ? Colors.MainThemeColor : Colors.LightGrayColor} />

                <TouchableOpacity onPress={() => onDonationPress()} style={styles.container}>
                    <Text style={donationSelected ? styles.selected : productInfoC ? styles.selectedC : styles.unSelected}>Product Info</Text>
                </TouchableOpacity>
                <FastImage source={require('../../../assets/icons/screens/right.png')} style={styles.backIcon} tintColor={productInfoC ? Colors.MainThemeColor : Colors.LightGrayColor} />

                <TouchableOpacity onPress={() => onTradePress()} style={styles.containerN}>
                    <Text style={tradeSelected ? styles.selected : complete ? styles.selectedC : styles.unSelected}>Complete</Text>
                </TouchableOpacity>
            </View>
            {!index && basicSelected && (
                <>
                    <ScrollView contentContainerStyle={styles.scrollBodyB} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                        <View>
                            {separatorHeight()}
                            <View style={styles.textProducts}>
                                <Text style={styles.remember}>{'Upload Pictures'}</Text>
                            </View>
                            <View style={styles.mapImages}>
                                {imagesData.map((_imagesData, index) => renderImageCell(_imagesData, index))}

                                {imagesData.length < imagesLength && (
                                    <View>
                                        {renderEmptyCell()}
                                        {/* <Text style={{...styles.countText, ...styles.unSelected}}>{`${imagesData.length} / ${imagesLength}`}</Text> */}
                                    </View>
                                )}
                            </View>
                            {<Text style={{...styles.countText, ...styles.unSelected}}>{`${imagesData.length} / ${imagesLength}`}</Text>}
                            {errorTextImages && imagesData.length < 1 && <Text style={styles.errorTextH}>{errorTextImages}</Text>}
                        </View>
                        <View style={styles.backgroundContainer}>
                            <>
                                <Picker
                                    data={[
                                        {name: 'Sell', id: 1},
                                        {name: 'Trade', id: 2},
                                        {name: 'Giveaway', id: 3}
                                    ]}
                                    title={'Product is for'}
                                    showSteric={true}
                                    visible={productTypeVisible}
                                    onPress={productTypeVH}
                                    pickerHandler={onSelectProductType}
                                    selectedItem={productType}
                                />
                                {isDonation && separatorHeight()}
                            </>
                            {!isDonation && separatorHeight()}
                            {isDonation ? (
                                <View style={styles.donationContainer}>
                                    <SmallPicker
                                        data={[
                                            {name: 'Unit', id: 0},
                                            {name: 'Kilo', id: 1},
                                            {name: 'Pound', id: 3},
                                            {name: 'Dozen', id: 4},
                                            {name: 'Tray', id: 5}
                                        ]}
                                        title={'Sold by'}
                                        showSteric={true}
                                        visible={pickerVisibleWeight}
                                        onPress={weightVisibleHandler}
                                        pickerHandler={weightSelectionHandler}
                                        selectedItem={weight}
                                        style={{width: wp('45%'), height: hp('6%')}}
                                        styleDropDown={{width: wp('45%')}}
                                        listContainerStyle={{width: wp('43%')}}
                                        titleTextStyle={{width: wp('25%'), fontSize: Typography.FONT_SIZE_12}}
                                    />

                                    <View style={styles.inputFiledConatoner}>
                                        <View style={styles.donationPerson}>
                                            <Text style={styles.remember}>
                                                {'Allow per person'}
                                                {/* <Pressable onPress={infoHandlerD}> */}
                                                <Text onPress={infoHandlerD}>{' [!]'}</Text>
                                                {/* </Pressable> */}
                                            </Text>
                                        </View>
                                        <InputWithLabels
                                            style={styles.inputViewPrice}
                                            showLabelCB={false}
                                            value={allowPerson}
                                            keyboardType={'decimal-pad'}
                                            placeholder={''}
                                            showPlaceHolder={true}
                                            placeholderInner={'Qauntity'}
                                            isError={allowPersonError}
                                            isFocus={focusAllowPerson}
                                            onFocus={() => {
                                                resetAllFocus()
                                                setFocusAllowPerson(true)
                                            }}
                                            onBlur={submitAllowPerson}
                                            errorText={errorTextAllowPerson}
                                            onChangeText={(text) => onChangeAllowPerson(text)}
                                        />
                                    </View>
                                </View>
                            ) : (
                                <Picker
                                    data={[
                                        {name: 'Unit', id: 0},
                                        {name: 'Kilo', id: 1},
                                        {name: 'Pound', id: 3},
                                        {name: 'Dozen', id: 4},
                                        {name: 'Tray', id: 5}
                                    ]}
                                    title={'Sold by'}
                                    showSteric={true}
                                    visible={pickerVisibleWeight}
                                    onPress={weightVisibleHandler}
                                    pickerHandler={weightSelectionHandler}
                                    selectedItem={weight}
                                />
                            )}
                        </View>
                    </ScrollView>
                    <PhotoOptionsBottomSheet setRef={photoOptionsSheetRef} title={'Add Photo'} skipTitle={'cancel'} accessAllowGallery={() => checkPermissions('photo')} accessAllowCamera={() => checkPermissions('camera')} skipButtonCB={() => photoOptionsSheetRef.current.close()} />
                </>
            )}
            {!index && donationSelected && (
                // <View style={styles.topContainer}>
                <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                    <View style={styles.backgroundContainer}>
                        {separatorHeight()}
                        <Picker data={categoryData} title={'Category'} showSteric={true} visible={pickerVisible} onPress={pickerVisibleHandler} pickerHandler={pickerSelectionHandler} selectedItem={category === '' ? 'Select' : category} />
                        {categoryError && <Text style={styles.errorTextH}>{'Category is required'}</Text>}
                        {category === 'Other' ? separatorHeight() : null}
                        {category === 'Other' && showOtherInput && (
                            <InputWithLabels
                                showLabelCB={false}
                                value={addProduct}
                                placeholder=""
                                placeholderInner={'Type other'}
                                showPlaceHolder={true}
                                isError={addProductError}
                                isFocus={focusAddProduct}
                                onFocus={() => {
                                    resetAllFocus()
                                    submitAddProduct(true)
                                }}
                                onBlur={submitProductName}
                                errorText={errorTextAddProduct}
                                onChangeText={(text) => setAddProduct(text.trimStart())}
                                style={{width: wp('92'), backgroundColor: Colors.White}}
                            />
                        )}
                        {separatorHeight()}
                        <InputWithLabels
                            showLabelCB={true}
                            value={productName}
                            showAstaric
                            placeholderInner={'Product name'}
                            showPlaceHolder={true}
                            placeholderC={isTrade ? 'Product to trade' : 'Name'}
                            isError={productNameError}
                            isFocus={focusProductName}
                            onFocus={() => {
                                resetAllFocus()
                                setFocusProductName(true)
                            }}
                            onBlur={submitProductName}
                            errorText={errorTextProductName}
                            onChangeText={(text) => setProductName(text.trimStart())}
                            style={{width: wp('92'), backgroundColor: Colors.White}}
                        />
                        {isTrade ? (
                            <TradeSheetInputs handleToggleTrade={handleToggleTrade} onSaveData={tradeDataCB} tradeDataArray={tradeData} tradeShow={true} errorTextTradeD={errorTextTrade} />
                        ) : (
                            <>
                                {isDonation ? null : (
                                    <View style={styles.quantityView}>
                                        <InputWithLabels
                                            style={styles.inputViewPrice}
                                            textError={styles.errorText}
                                            showLabelCB={true}
                                            showAstaric
                                            value={price}
                                            showPlaceHolder={true}
                                            placeholderInner={'$'}
                                            placeholderC="Price"
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
                                            editable={productData?.is_trade || productData?.is_donation ? false : true}
                                        />
                                        <InputWithLabels
                                            editable={productData?.is_donation || productData?.is_trade ? false : true}
                                            style={styles.inputViewPrice}
                                            textError={styles.errorText}
                                            showLabelCB={true}
                                            value={discount}
                                            showAstaric
                                            placeholder="Discount % "
                                            keyboardType={'decimal-pad'}
                                            secure={false}
                                            isError={discountError}
                                            onBlur={submitDiscount}
                                            isFocus={focusDiscount}
                                            onFocus={() => {
                                                resetAllFocus()
                                                setFocusDiscount(true)
                                            }}
                                            errorText={errorTextDiscount}
                                            onChangeText={(text) => onChangeDiscount(text)}
                                        />
                                    </View>
                                )}
                            </>
                        )}

                        {separatorHeight()}
                    </View>
                </ScrollView>
            )}

            {!index && tradeSelected && (
                <ScrollView scrollEnabled={openChemicals ? false : true} contentContainerStyle={[styles.scrollBody, {paddingBottom: focusdescription ? hp('40') : hp('5'), flex: focusdescription ? 0 : 1}]} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                    <View style={styles.backgroundContainer}>
                        {isDonation || isTrade ? null : (
                            <>
                                <View style={styles.containerAllow}>
                                    <Text style={styles.remember}>
                                        {'Allow to order in advance'}
                                        <Text onPress={infoHandler}>{' [!]'}</Text>
                                    </Text>
                                </View>

                                <View style={styles.checkHourDays}>
                                    <InputWithLabels
                                        style={styles.inputViewPrice}
                                        textError={styles.errorText}
                                        showLabelCB={false}
                                        value={numbers}
                                        placeholderC="Allow to order"
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
                                            {name: 'Hour(s)', id: 0},
                                            {name: 'Day(s)', id: 1}
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
                                {/* {separatorHeight()} */}
                            </>
                        )}

                        <View style={styles.textProducts}>
                            <Text style={styles.remember}>{'Product(s) Available'}</Text>
                        </View>

                        <View style={styles.fromPickerConatiner}>
                            <PickerDate
                                onPress={toggleDatePicker}
                                fromDate={'From'}
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
                            <PickerDate
                                onPress={unlimitedDate ? null : toggleDatePickerTo}
                                fromDate={'To'}
                                style={styles.pickerDateStyle}
                                stylePicker={styles.stylePickerD}
                                styleErrorText={styles.pickerStyleErrorText}
                                bodyStyle={styles.bodyStyle}
                                open={openTo}
                                modeDate={true}
                                mode={'date'}
                                minimumDate={new Date()}
                                selectedDate={endDate}
                                handleDateChange={changeEndDHandler}
                                onCancel={() => {
                                    setOpenTo(false)
                                }}
                                errorText={errorTextEndDate}
                                showCheck={true}
                                onSelect={() => (setUnlimitedDate(!unlimitedDate), setErroTextStartDate(null), setErroTextEndDate(null))}
                                selected={unlimitedDate}
                            />
                        </View>
                        <View style={styles.rememberContainerPickUp}>
                            <View style={styles.rememberContainer}>
                                <TouchableOpacity onPress={() => setIsPickUp(!isPickUp)} activeOpacity={0.8}>
                                    {isPickUp ? <FastImage source={require('../../../assets/icons/screens/checked.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.MainThemeColor} /> : <FastImage source={require('../../../assets/icons/screens/unchecked.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.LightGrayColor} />}
                                </TouchableOpacity>
                                <Text style={styles.pickUpText}>Pick-Up</Text>
                            </View>

                            <View style={[styles.rememberContainer, {paddingLeft: wp('2')}]}>
                                <TouchableOpacity onPress={() => setIsDelivery(!isDelivery)} activeOpacity={0.8}>
                                    {isDelivery ? <FastImage source={require('../../../assets/icons/screens/checked.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.MainThemeColor} /> : <FastImage source={require('../../../assets/icons/screens/unchecked.png')} style={styles.rememberImage} resizeMode="contain" tintColor={Colors.LightGrayColor} />}
                                </TouchableOpacity>
                                <Text style={styles.pickUpText}>Delivery</Text>
                            </View>
                        </View>
                        <View style={styles.deliveryContainer}>
                            {/* {separatorHeight()} */}
                            {isDelivery && (
                                <View style={styles.textRadiusCont}>
                                    <InputWithLabels
                                        showLabelCB={true}
                                        value={distance}
                                        placeholderC="Delivery in Mile Radius"
                                        showPlaceHolder
                                        placeholderInner={'0'}
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
                                    <Text style={styles.titleRadius}>miles</Text>
                                </View>
                            )}
                        </View>
                        {isDelivery ? separatorHeight() : false}
                        {/* {separatorHeight()} */}
                        {/* change here */}
                        {/* {productData?.is_donation || productData?.is_trade ? null : (
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
                                )} */}
                        <ToggelButton text={'Organic'} isOn={isOrganic} handleToggle={organicHandler} style={styles.toggleWrapper} />
                        <View style={styles.textProducts}>
                            <Text style={styles.remember}>{'Chemical Used'}</Text>
                        </View>
                        <MultipleSelectPicker open={openChemicals} value={chemicalsValue} items={chemicalsList} setOpen={isOrganic ? () => null : (value) => setOpenChemicals(value)} setValue={setChemicalsValue} setItems={chemicalsList} />
                        {chemcalIdError && chemicalsValue.length < 1 && <Text style={styles.errorTextH}>{'Chemcal is required'}</Text>}
                        {separatorHeight()}
                        <View style={styles.textProducts}>
                            <Text style={styles.remember}>
                                {'Caption'} <Text style={styles.captionCount}>{'(100 Words)'}</Text>
                            </Text>
                        </View>
                        <InputWithLabels
                            value={description}
                            placeholder={''}
                            placeholderInner={'Write...'}
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
                            style={styles.desciptionInput}
                            maxLength={150}
                        />
                    </View>
                </ScrollView>
            )}

            <View style={styles.buttonConatiner}>
                <ActiveButton title={'Back'} onPress={() => (donationSelected ? onBasicPress() : tradeSelected ? onDonationPress() : null)} style={basicComplete ? styles.inActiveBtA : styles.inActiveBt} textStyle={basicComplete ? styles.inActiveTxtA : styles.inActiveTxt} />
                <ActiveButton title={'Next'} onPress={() => (basicSelected ? onPressNextB('Donation') : donationSelected ? onPressNextD() : postHandler())} style={styles.activeBt} />
            </View>
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
    labelStyleSmall: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        textTransform: 'capitalize'
    },
    titleRadius: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        top: hp('1%')
    },

    headerContainer: {
        marginTop: Platform.OS == 'android' ? hp('0') : hp('6'),
        width: wp('100'),
        flexDirection: 'row',
        paddingHorizontal: wp('2'),
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    donationContainer: {
        width: wp('92%'),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    backIcon: {
        width: wp('6%'),
        height: wp('6%')
    },
    bodyStyle: {
        width: wp('43%')
    },
    leftContainer: {
        minWidth: wp(20)
    },
    midContainer: {
        minWidth: wp(56),
        alignItems: 'center'
    },

    titleText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_20,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    textRadiusCont: {
        width: wp('92'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    rightContainer: {
        minWidth: wp(20)
    },
    toggleWrapper: {
        width: wp(35),
        alignSelf: 'flex-start',
        borderWidth: 0,
        marginLeft: wp('4')
    },
    tabContainer: {
        alignSelf: 'center',
        width: wp('92%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    container: {
        borderBottomColor: Colors.OrangeColor,
        alignItems: 'center'
    },
    containerN: {
        borderBottomColor: Colors.OrangeColor,
        alignItems: 'center'
    },
    selected: {
        color: Colors.MainThemeColor,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    selectedC: {
        color: Colors.MainThemeColor,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    },
    unSelected: {
        color: Colors.LightGrayColor,
        fontSize: Platform.OS === 'android' ? Typography.FONT_SIZE_14 : Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_MEDIUM
    },

    scrollBody: {
        paddingBottom: Platform.OS == 'android' ? hp('0') : hp('20'),
        alignItems: 'center',
        flex: 1
    },
    scrollBodyB: {
        alignItems: 'center'
    },
    buttonConatiner: {
        marginBottom: Platform.OS == 'android' ? hp('2') : hp('4'),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: wp(92)
    },
    activeBt: {
        width: wp(45)
    },
    desciptionInput: {
        textAlignVertical: 'top',
        backgroundColor: Colors.White,
        width: wp('92')
    },
    inActiveBt: {
        width: wp(45),
        backgroundColor: Colors.White,
        borderWidth: wp('.3'),
        borderColor: Colors.LightGrayColor
    },

    inActiveBtA: {
        width: wp(45),
        backgroundColor: Colors.White,
        borderWidth: wp('.3'),
        borderColor: Colors.MainThemeColor
    },
    inActiveTxt: {
        color: Colors.LightGrayColor
    },
    inActiveTxtA: {
        color: Colors.MainThemeColor
    },
    backgroundContainer: {
        // flex: 1,
        width: wp('100%'),
        alignSelf: 'center',
        backgroundColor: Colors.White,
        marginTop: hp('1%'),
        alignItems: 'center',
        paddingVertical: hp('1%')
    },

    icons: {
        width: wp('10%'),
        height: wp('10%')
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

    mapImage: {
        width: wp('30%'),
        height: wp('30%'),
        borderRadius: wp('4'),
        marginTop: hp('1%'),
        marginLeft: wp('1')
    },
    mapImages: {
        width: wp('94'),
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    crossIconContainer: {
        width: wp('5%'),
        height: wp('5%'),
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

    discount: {
        minWidth: wp('20'),
        minHeight: hp('5'),
        borderRadius: wp('4'),
        backgroundColor: Colors.BorderGrey,
        justifyContent: 'center',
        alignItems: 'center'
    },

    errorText: {
        fontSize: Typography.FONT_SIZE_12,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        width: wp('86%'),
        paddingLeft: wp('3%'),
        letterSpacing: 0.2,
        color: Colors.ErrorText
    },
    inputViewLimit: {
        width: wp('41%'),
        height: hp('6%')
    },
    inputFiledConatoner: {
        width: wp('45%')
        // bottom: wp('1%')
    },
    TextViewCaption: {
        width: wp('80%'),
        color: Colors.SearchableText,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    },

    quantityView: {
        width: wp('92'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    topContainer: {
        width: wp('100%'),
        height: Platform.OS == 'ios' ? hp('77%') : hp('84.5%'),
        alignItems: 'center'
    },

    caontainerQWeight: {
        width: wp('86'),
        alignItems: 'center'
    },

    rightContainer: {
        width: wp('35'),
        alignItems: 'center',
        flexDirection: 'row'
    },

    inputViewCQ: {
        width: wp('86%'),
        height: hp('7')
    },
    inputViewPrice: {
        width: wp('45%'),
        backgroundColor: Colors.White
    },
    inputViewDiscount: {
        width: wp('45%')

        // bottom: hp('0.3')
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
    },

    containerAllow: {
        width: wp('92%')
    },
    donationPerson: {
        maxWidth: wp('45%')
    },
    textProducts: {
        width: wp('92%')
    },
    pickerStyleErrorText: {
        width: wp('40%'),
        maxWidth: wp('40%')
    },
    pickerDateStyle: {
        width: wp('42%'),
        height: hp(6),
        borderRadius: wp('8')
    },
    titleTextStyleC: {
        width: wp('14%')
    },
    checkHourDays: {
        width: wp('92%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    stylePickerD: {
        width: wp('25%'),
        marginLeft: wp('1')
    },
    listContainerStyleH: {
        width: wp('39%')
    },
    dropDownS: {
        width: wp('41%')
    },
    fromPickerConatiner: {
        marginTop: hp('1'),
        width: wp('92%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    pressAble: {
        // width: wp('6%'),
        alignItems: 'center'
    },

    selectedAllow: {
        width: wp('41%'),
        height: hp('6%')
    },

    deliveryContainer: {
        width: wp('92%'),
        top: hp('2%')
        // alignItems: 'center'
    },
    checkBoxContainerType: {
        width: wp('85%'),
        flexDirection: 'row'
    },

    distanceStyle: {
        width: wp('76%'),
        height: hp('6%'),
        backgroundColor: Colors.White
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
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Platform.OS == 'android' ? Typography.FONT_SIZE_13 : Typography.FONT_SIZE_15
    },
    captionCount: {
        color: Colors.LightGrayColor,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_10
    },
    pickUpText: {
        paddingLeft: wp('1%'),
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        fontSize: Typography.FONT_SIZE_14
    },
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rememberContainerPickUp: {
        width: wp(92),
        flexDirection: 'row',
        marginTop: hp('2')
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
    },
    activeIconC: {
        width: wp('9%') * 0.89,
        height: wp('9%')
    }
})

export default AddSellYourGoodsScreen
