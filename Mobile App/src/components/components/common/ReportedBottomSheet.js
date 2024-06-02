import React, {useEffect, useRef, useState} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import RBSheet from 'react-native-raw-bottom-sheet'
import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import {separatorHeightH} from '../../../utils/helpers'
import Header from '../../../components/components/common/Header'
import FastImage from 'react-native-fast-image'
import InputWithLabels from '../../../components/components/common/InputWithLabels'
import ValidateInput from '../../../utils/ValidateInput'
import ActiveButton from '../../../components/components/common/ActiveButton'
import DisableButton from './DisableButton'

const ReportedBottomSheet = ({setRef, reportCB, height, title}) => {
    const [reason, setReason] = useState('')
    const [focusReason, setFocusReason] = useState(false)

    const onReport = () => {
        setReason('')
        setFocusReason(false)
        reportCB(reason)
    }

    return (
        <RBSheet
            ref={setRef}
            closeOnDragDown={true}
            closeOnPressMask={true}
            closeDuration={100}
            openDuration={100}
            height={height}
            customStyles={{
                draggableIcon: {
                    backgroundColor: Colors.DarkPepper_80
                },
                container: {
                    backgroundColor: Colors.White
                }
            }}>
            <View style={styles.body}>
                <View style={styles.container}>
                    <Text style={styles.title}>{title}</Text>
                    {separatorHeightH()}
                    <InputWithLabels
                        showLabelCB={false}
                        value={reason}
                        placeholder={title?.includes('Post') ? 'Please explain the problem with this post' : 'Please explain the problem'}
                        showPlaceHolder={true}
                        secure={false}
                        isError={false}
                        isFocus={focusReason}
                        onFocus={() => {
                            setFocusReason(true)
                        }}
                        errorText={null}
                        autoCapitalize="none"
                        onChangeText={(text) => {
                            setReason(text)
                        }}
                        multiline={true}
                        maxHeight={130}
                        minHeight={130}
                        style={{textAlignVertical: 'top'}}
                    />

                    {reason.length > 1 ? <ActiveButton title="Send" style={{width: wp('86%')}} onPress={onReport} /> : <DisableButton title="Send" style={{width: wp('86%')}} />}
                </View>
            </View>
        </RBSheet>
    )
}

const styles = StyleSheet.create({
    body: {
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: Colors.White
    },

    container: {
        alignItems: 'center'
    },
    title: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    skipButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('1%'),
        height: hp('5%')
    },
    skipText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    }
})

export default ReportedBottomSheet
