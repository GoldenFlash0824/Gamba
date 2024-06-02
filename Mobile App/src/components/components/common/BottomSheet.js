import React from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import RBSheet from 'react-native-raw-bottom-sheet'
import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import ActiveButton from './ActiveButton'
import DisableButton from './DisableButton'
const titles = ['Yes', 'Delete', 'Sign Out']
const BottomSheet = ({setRef, title, description, continueTitle, skipTitle, commentShow, continueButtonCB, continueTitleE, skipButtonCB, continueButtonEC, isActive = true, onCloseCB}) => {
    return (
        <RBSheet
            ref={setRef}
            height={titles.includes(continueTitle) ? hp('38%') : hp('40%')}
            closeOnDragDown={true}
            closeOnPressMask={true}
            closeDuration={100}
            openDuration={100}
            onClose={onCloseCB}
            customStyles={{
                mask: {
                    backgroundColor: Colors.DarkPepper_80
                },
                draggableIcon: {
                    backgroundColor: Colors.DarkPepper_80
                },
                container: {
                    backgroundColor: Colors.White
                }
            }}>
            <>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>

                <View style={styles.nextButton}>
                    <ActiveButton
                        title={continueTitle}
                        onPress={() => {
                            continueButtonCB()
                        }}
                        style={{backgroundColor: titles.includes(continueTitle) ? Colors.OrangeColor : Colors.MainThemeColor, shadowColor: titles.includes(continueTitle) ? Colors.OrangeColor : Colors.MainThemeColor, marginBottom: hp('2%')}}
                    />

                    {commentShow ? (
                        <ActiveButton
                            title={continueTitleE}
                            onPress={() => {
                                continueButtonEC()
                            }}
                            style={{backgroundColor: titles.includes(continueTitleE) ? Colors.OrangeColor : Colors.OrangeColor, shadowColor: titles.includes(continueTitleE) ? Colors.OrangeColor : Colors.OrangeColor}}
                        />
                    ) : null}
                </View>
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={() => {
                        skipButtonCB()
                    }}
                    activeOpacity={0.8}>
                    <Text style={styles.skipText}>{skipTitle}</Text>
                </TouchableOpacity>
            </>
        </RBSheet>
    )
}

const styles = StyleSheet.create({
    title: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        alignSelf: 'center',
        width: wp('92%'),
        textAlign: 'center'
    },
    description: {
        width: wp('92%'),
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_16,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        marginTop: hp('1%'),
        marginBottom: hp('2%'),
        alignSelf: 'center',
        color: Colors.Description
    },
    nextButton: {
        marginTop: hp('1%'),
        alignItems: 'center'
    },
    skipButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('3%'),
        height: hp('5%'),
        borderWidth: wp(0.2),
        borderColor: Colors.DarkGrey,
        width: wp('88'),
        borderRadius: wp('8'),
        alignSelf: 'center'
    },
    skipText: {
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_14,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    }
})

export default BottomSheet
