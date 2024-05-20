import React from 'react'
import {StyleSheet, View} from 'react-native'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const GoogleAutoComplete = ({textInputProps, onPress, placeholder, fetchDetails, query, containerStyle = {}}) => {
    return (
        <View style={styles.body}>
            <GooglePlacesAutocomplete
                placeholder={placeholder}
                enablePoweredByContainer={false}
                keepResultsAfterBlur={true}
                fetchDetails={fetchDetails}
                onPress={onPress}
                query={query}
                textInputProps={textInputProps}
                styles={{
                    container: [styles.container, containerStyle],
                    textInput: [styles.textInput],
                    description: {
                        color: Colors.DarkPepper_60
                    }
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width: wp('92%')
    },
    container: {
        width: wp('92%')
    },
    textInput: {
        width: wp(92),
        height: hp('6%'),
        paddingLeft: wp('3%'),
        color: Colors.SearchableText,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        backgroundColor: Colors.White,
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.4),
        borderRadius: wp('8%')
    }
})

export default GoogleAutoComplete
