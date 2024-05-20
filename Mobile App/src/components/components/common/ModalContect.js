import React, {useState} from 'react'
import {Modal, StyleSheet, Text, Pressable, View, TouchableOpacity} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import FastImage from 'react-native-fast-image'
import {useSelector} from 'react-redux'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import ValidateInput from '../../../utils/ValidateInput'
import {getHeaders} from '../../../utils/helpers'
import InputWithLabels from './InputWithLabels'
import ActiveButton from './ActiveButton'
import Loader from './Spinner'
import ShowAlert from './ShowAlert'

const ModalContect = ({modalVisible, onRequestClose, styleShowModal, item}) => {
    const {userData} = useSelector((state) => state.user)
    const userEmail = item?.user?.email
    const [firstName, setFirstName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [topic, setTopic] = useState('')
    const [about, setAbout] = useState('')

    //states for handling errors
    const [firstNameError, setFirstNameError] = useState(false)
    const [phoneError, setPhoneError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [topicError, setTopicError] = useState(false)
    const [aboutError, setAboutError] = useState(false)

    //states for handling focus
    const [focusFirstName, setFocusFirstName] = useState(false)
    const [focusPhone, setFocusPhone] = useState(false)
    const [focusEmail, setFocusEmail] = useState(false)
    const [focusTopic, setFocusTopic] = useState(false)
    const [focusAbout, setFocusAbout] = useState(false)

    //states for setting error text
    const [errorTextFirstName, setErrorTextFirstName] = useState(null)
    const [errorTextPhone, setErrorTextPhone] = useState(null)
    const [errorTextEmail, setErrorTextEmail] = useState(null)
    const [errorTextTopic, setErrorTextTopic] = useState(null)
    const [errorTextAbout, setErrorTextAbout] = useState(null)

    const [loading, setLoading] = useState(false)

    const checkIsValidRequest = () => {
        if (!ValidateInput('firstName', firstName) && !ValidateInput('email', email) && !ValidateInput('phone', phone) && !ValidateInput('topic', topic) && !ValidateInput('about', about)) {
            setErrorTextFirstName(null)
            setFirstNameError(false)
            setFocusFirstName(false)

            setErrorTextEmail(null)
            setEmailError(false)
            setFocusEmail(false)

            setErrorTextTopic(null)
            setTopicError(false)
            setFocusTopic(false)

            setErrorTextPhone(null)
            setPhoneError(false)
            setFocusPhone(false)

            setErrorTextAbout(null)
            setAboutError(false)
            setFocusAbout(false)

            return true
        } else {
            firstName == '' ? (setErrorTextFirstName('Valid first name is required'), setFirstNameError(true), setFocusFirstName(false)) : (setErrorTextFirstName(null), setFirstNameError(false), setFocusFirstName(false))
            email == '' ? (setErrorTextEmail('Valid email is required'), setEmailError(true), setFocusEmail(false)) : (setErrorTextEmail(null), setEmailError(false), setFocusEmail(false))
            phone == '' || phone.length < 4 ? (setErrorTextPhone('Valid phone number is required'), setPhoneError(true), setFocusPhone(false)) : (setErrorTextPhone(null), setPhoneError(false), setFocusPhone(false))
            topic == '' ? (setErrorTextTopic('Valid topic is required'), setTopicError(true), setFocusTopic(false)) : (setErrorTextTopic(null), setTopicError(false), setFocusTopic(false))
            about == '' ? (setErrorTextAbout('Valid about is required'), setAboutError(true), setFocusAbout(false)) : (setErrorTextAbout(null), setAboutError(false), setFocusAbout(false))

            return false
        }
    }

    const conectHandler = async () => {
        const headers = getHeaders(userData.auth_token)
        const result = checkIsValidRequest(firstName, email, phone, topic, about)
        const submittData = {
            full_name: firstName,
            email: email,
            phone_number: phone,
            interested_in: topic,
            more_info: about,
            user_email: userEmail
        }
        if (result) {
            setLoading(true)
            try {
                await axios
                    .post('user/connect_product', submittData, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            setLoading(false)
                            setTimeout(async () => onRequestClose(), 500)
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

    const submitFirstName = () => {
        const error = ValidateInput('firstName', firstName)
        setErrorTextFirstName(error ? 'Valid first name is required' : null)
        setFirstNameError(error ? true : false)
        setFocusFirstName(false)
        if (!error) {
            setFocusEmail(true)
        }
    }

    const submitPhone = () => {
        const error = ValidateInput('phone', phone)
        setErrorTextPhone(error ? 'Valid phone number is required' : null)
        setErrorTextPhone(error ? error : null)
        setPhoneError(error ? true : false)
        if (!error) {
            setFocusTopic(true)
        }
    }

    const submitEmail = () => {
        const error = ValidateInput('email', email)
        setErrorTextEmail(error ? 'Valid email is required' : null)
        setEmailError(error ? true : false)
        setFocusEmail(false)
        if (!error) {
            setFocusPhone(true)
        }
    }
    const submitTopic = () => {
        const error = ValidateInput('topic', topic)
        setErrorTextTopic(error ? 'Valid topic is required' : null)
        setTopicError(error ? true : false)
        setFocusTopic(false)
        if (!error) {
            setFocusAbout(true)
        }
    }

    const submitAbout = () => {
        const error = ValidateInput('about', about)
        setErrorTextAbout(error ? 'Valid about is required' : null)
        setAboutError(error ? true : false)
        setFocusAbout(false)
        if (!error) {
            setFocusAbout(true)
        }
    }

    const changeFirstName = (text) => {
        text = text.trimStart()
        setFirstName(text)
    }
    const changeAbout = (text) => {
        text = text.trimStart()
        setAbout(text)
    }

    const changeTopic = (text) => {
        text = text.trimStart()
        setTopic(text)
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
        setFocusPhone(false)
        setFocusEmail(false)
        setFocusTopic(false)
        setFocusAbout(false)
    }

    const pressButtonHan = () => {
        onRequestClose('chat')
    }

    return (
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
            <Loader visible={loading} />
            <Pressable style={[styles.modalOverlay, styleShowModal]}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalView}>
                        <View style={styles.modalClose}>
                            <TouchableOpacity activeOpacity={0.8} onPress={onRequestClose} style={styles.iconCon}>
                                <FastImage source={require('../../../assets/icons/screens/cancel_b.png')} style={styles.Icon} resizeMode="contain" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.aboveTxt}>Connect</Text>

                        <View style={styles.inputViewCont}>
                            <InputWithLabels
                                showLabelCB={true}
                                value={firstName}
                                placeholder="Full Name"
                                showPlaceHolder={true}
                                placeholderInner={'John'}
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
                                value={email}
                                showPlaceHolder={true}
                                placeholderInner={'johndoe@mail.com'}
                                placeholder="Email "
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
                                placeholderInner={'+1 234 567 8901'}
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
                            <InputWithLabels
                                showLabelCB={true}
                                value={topic}
                                showPlaceHolder={true}
                                placeholderInner={'Topic'}
                                placeholder="Interested in"
                                secure={false}
                                isError={topicError}
                                onBlur={() => submitTopic()}
                                isFocus={focusTopic}
                                onFocus={() => {
                                    resetAllFocus()
                                    setFocusTopic(true)
                                }}
                                errorText={errorTextTopic}
                                autoCapitalize="none"
                                onChangeText={(text) => changeTopic(text)}
                                style={styles.inputStyle}
                            />

                            <InputWithLabels
                                showLabelCB={true}
                                value={about}
                                placeholder="More Info"
                                showPlaceHolder={true}
                                placeholderInner={'Write message...'}
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
                        </View>

                        <View style={styles.btnC}>
                            <ActiveButton style={styles.connect} title="Chat" onPress={pressButtonHan} />
                            <ActiveButton style={styles.connect} title="Connect" onPress={conectHandler} />
                        </View>
                    </View>
                </View>
            </Pressable>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalView: {
        width: wp('92%'),
        backgroundColor: Colors.White,
        borderRadius: wp('4'),
        paddingTop: hp('1'),
        paddingHorizontal: wp('6'),
        shadowColor: Colors.Gray_Dark,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        alignItems: 'center'
    },
    modalBackground: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalClose: {
        width: wp('84%'),
        alignItems: 'flex-end'
    },
    Icon: {
        width: wp('4%'),
        height: wp('4%')
    },
    iconCon: {
        width: wp('6%'),
        height: wp('6%'),
        alignItems: 'center',
        justifyContent: 'center'
    },
    aboveTxt: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_20,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    inputViewCont: {
        alignItems: 'center',
        marginTop: hp('3%')
    },

    inputStyle: {
        width: wp('83%'),
        backgroundColor: Colors.White
    },
    bioStyle: {
        width: wp('83%'),
        textAlignVertical: 'top',
        backgroundColor: Colors.White,
        borderRadius: wp('4%')
    },
    btnC: {
        width: wp('84%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('2%'),
        paddingBottom: hp('3%')
    },
    connect: {
        width: wp('40%')
    }
})

export default ModalContect
