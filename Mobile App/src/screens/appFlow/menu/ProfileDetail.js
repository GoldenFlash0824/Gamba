import React, {useRef, useState} from 'react'
import {StyleSheet, View, FlatList} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useSelector, useDispatch} from 'react-redux'
import axios from 'axios'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import Header from '../../../components/components/common/Header'
import UsersListItem from '../../../components/components/common/UsersListItem'
import BottomSheet from '../../../components/components/common/BottomSheet'
import {storeLogInOrLogOut} from '../../../services/store/actions'
import {removeLocalUser, getHeaders} from '../../../utils/helpers'
import Loader from '../../../components/components/common/Spinner'
import ShowAlert from '../../../components/components/common/ShowAlert'

const ProfileDetail = ({navigation}) => {
    const DATA = [
        {
            id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
            images: require('../../../assets/icons/screens/profile.png'),
            title: 'Personal Info',
            navigation: 'EditProfile'
        },
        {
            id: '58694a0f-3da1-471f-bd96-145571e29d72',
            images: require('../../../assets/icons/screens/privacy.png'),
            title: 'Privacy',
            navigation: 'PrivacyScreen'
        },
        {
            id: '58694a0f-3da1-471f-bd96-145571e29d78999',
            images: require('../../../assets/icons/screens/change_password.png'),
            title: 'Change Password',
            navigation: 'ChangePasswordScreen'
        }
    ]
    const {userData} = useSelector((state) => state.user)
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const deleteSheetRef = useRef()
    const renderItem = ({item, onPress}) => {
        return <UsersListItem item={item} menu={true} onPress={() => onPressHanlder(item)} />
    }

    const onPressHanlder = (item) => {
        if (item.navigation) {
            navigation.navigate(item.navigation)
        } else if (item.title.match(/Disable Account/g)) {
            deleteSheetRef.current.open()
        }
    }
    const doDeleteAccount = () => {
        deleteSheetRef.current.close()
        setTimeout(async () => {
            await doDisableAccount()
        }, 200)
    }
    const doDisableAccount = async () => {
        const headers = getHeaders(userData.auth_token)
        setTimeout(async () => {
            setLoading(true)
            try {
                await axios
                    .post(`user/disable_account`, {u_id: userData.id}, headers)
                    .then(async (response) => {
                        if (response.data.success === true) {
                            await removeLocalUser()
                            setLoading(false)
                            setTimeout(async () => {
                                dispatch(storeLogInOrLogOut(false))
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
        }, 200)
    }

    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            <Header back={true} backCB={() => navigation.goBack()} title={'My Account'} />
            <View style={styles.dataListCard}>
                <FlatList data={DATA} renderItem={renderItem} keyExtractor={(item) => item.id} contentContainerStyle={styles.bottomPadding} showsVerticalScrollIndicator={false} />
            </View>

            <BottomSheet
                setRef={deleteSheetRef}
                title={'Are you sure you want to delete account?'}
                continueTitle={'Yes'}
                continueButtonCB={() => {
                    doDeleteAccount()
                }}
                skipTitle={'Cancel'}
                skipButtonCB={() => deleteSheetRef.current.close()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: Colors.White
    },
    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp('2%'),
        backgroundColor: Colors.White
        // borderRadius: wp('2%'),
        // shadowColor: Colors.Shadow_Color,
        // shadowOffset: {
        //     width: 0,
        //     height: 0
        // },
        // shadowOpacity: 0.1,
        // shadowRadius: 1,
        // elevation: 5,
        // paddingVertical: hp('1%')
    },
    dataListCard: {
        alignItems: 'center',
        paddingBottom: hp('17'),
        width: wp('100%'),

        backgroundColor: Colors.White
    }
})

export default ProfileDetail
