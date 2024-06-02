import React, {useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import Loader from '../../../components/components/common/Spinner'
import * as Colors from '../../../constants/colors'
import Header from '../../../components/components/common/Header'

const AccountSecurityScreen = ({navigation}) => {
    const [loading, setLoading] = useState(false)

    const backHandler = () => {
        navigation.goBack()
    }
    return (
        <View style={styles.body}>
            <Loader visible={loading} />
            <Header back={true} backCB={backHandler} />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: Colors.BackgroundColor,
        width: wp('100%'),
        height: hp('100%')
    }
})

export default AccountSecurityScreen
