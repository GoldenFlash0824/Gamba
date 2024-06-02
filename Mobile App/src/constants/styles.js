import {StyleSheet} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import * as Colors from './colors'
import * as Typography from './typography'

const Styles = StyleSheet.create({
    sectionTitle: {
        // width: wp('100%'),
        // textAlign: 'center',
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Typography.FONT_SIZE_20
    },
    sectionDescription: {
        width: wp('82%'),
        marginTop: hp('1%'),
        textAlign: 'center',
        fontSize: Typography.FONT_SIZE_16,
        color: Colors.SubTitleColor,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    logoImage: {
        height: wp('25%'),
        width: wp('25%')
    },
    terms: {
        textAlign: 'center',
        color: Colors.HTextColor,
        fontSize: Typography.FONT_SIZE_17,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontWeight: Typography.FONT_WEIGHT_REGULAR
    }
})

export default Styles
