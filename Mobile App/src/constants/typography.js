import {RFValue} from 'react-native-responsive-fontsize'
import {Platform} from 'react-native'
export const FONT_FAMILY_REGULAR = 'Lato-Regular'
export const FONT_FAMILY_BOLD = 'Lato-Bold'
export const FONT_FAMILY_MEDIUM = 'Lato-Medium'
export const FONT_FAMILY_AileronBold = 'Aileron-Bold'
export const FONT_FAMILY_Italic = 'Roboto-Italic'

// FONT WEIGHT
export const FONT_WEIGHT_REGULAR = '400'
export const FONT_WEIGHT_BOLD = '700'

// FONT SIZE
export const FONT_SIZE_6 = RFValue(6)
export const FONT_SIZE_7 = RFValue(7)
export const FONT_SIZE_8 = RFValue(8)
export const FONT_SIZE_9 = RFValue(9)
export const FONT_SIZE_10 = RFValue(10)
export const FONT_SIZE_11 = RFValue(11)
export const FONT_SIZE_12 = RFValue(12)
export const FONT_SIZE_13 = RFValue(13)
export const FONT_SIZE_14 = RFValue(14)
export const FONT_SIZE_15 = RFValue(15)
export const FONT_SIZE_16 = RFValue(16)
export const FONT_SIZE_17 = RFValue(17)
export const FONT_SIZE_18 = RFValue(18)
export const FONT_SIZE_20 = Platform.OS === 'android' ? RFValue(18) : RFValue(20)
export const FONT_SIZE_24 = RFValue(24)
export const FONT_SIZE_28 = RFValue(28)
export const FONT_SIZE_30 = RFValue(30)
export const FONT_SIZE_32 = RFValue(32)
export const FONT_SIZE_34 = RFValue(34)
export const FONT_SIZE_40 = RFValue(40)
export const FONT_SIZE_50 = RFValue(50)

// FONT STYLE
export const FONT_REGULAR = {
    fontFamily: FONT_FAMILY_REGULAR,
    fontWeight: FONT_WEIGHT_REGULAR
}

// FONT FAMILY
export const FONT_BOLD = {
    fontFamily: FONT_FAMILY_BOLD,
    fontWeight: FONT_WEIGHT_BOLD
}
