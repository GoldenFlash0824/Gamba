import React from 'react'
import {StyleSheet, View, Dimensions, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import Pdf from 'react-native-pdf'

import * as Colors from '../../../constants/colors'
import Header from '../../../components/components/common/Header'

const SellersRefundAgreementScreen = ({navigation}) => {
    return (
        <View style={styles.body}>
            <Header back={true} backCB={() => navigation.goBack()} titlleLeft={'Sellers Agreement'} />
            <View style={styles.container}>
                <Pdf
                    trustAllCerts={false}
                    source={Platform.OS === 'ios' ? require('../../../assets/Refund_Agreement.pdf') : {uri: 'bundle-assets://RefundAgreement.pdf'}}
                    onError={(error) => {
                        console.log(error)
                    }}
                    onPressLink={(uri) => {
                        console.log(`Link pressed: ${uri}`)
                    }}
                    style={styles.pdf}
                />
            </View>
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
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: Colors.White,
        alignItems: 'center'
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    }
})

export default SellersRefundAgreementScreen
