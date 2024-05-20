import React, {useState} from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import RBSheet from 'react-native-raw-bottom-sheet'
import FastImage from 'react-native-fast-image'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import {separatorHeight} from '../../../utils/helpers'
import InputWithLabels from '../../../components/components/common/InputWithLabels'

const ChemicalsDetailUsed = ({itemCB, setRef, onChe, height, onCloseCB}) => {
    const [serachBar, setserachBar] = useState('')
    const [focusSearch, setFocusSearch] = useState(false)
    const [searchData, setSearchData] = useState([])

    const onChangeSearchBar = (text) => {
        text = text.toLowerCase()
        setserachBar(text)
        setSearchData((itemCB?.route?.tradeData?.chemical_data || itemCB?.chemical_data).filter((item) => item?.chemical_data_detail?.title.toLowerCase().includes(text.toLowerCase())))
    }
    const onSearchBarFocus = () => setFocusSearch(true)

    return (
        <RBSheet
            animationType={'slide'}
            ref={setRef}
            closeOnPressMask={true}
            closeDuration={100}
            openDuration={100}
            height={height}
            customStyles={{
                container: {
                    backgroundColor: Colors.White
                }
            }}>
            <View style={styles.body}>
                <View style={styles.backgroundContainer}>
                    <View style={styles.headingContainer}>
                        <Text style={styles.title}>Chemicals Used</Text>
                        <TouchableOpacity onPress={onChe}>
                            <FastImage source={require('../../../assets/icons/screens/close.png')} resizeMode="contain" style={styles.crossIcon} />
                        </TouchableOpacity>
                    </View>
                    <InputWithLabels
                        showLabelCB={false}
                        value={serachBar}
                        inputStyles={styles.input}
                        style={styles.inpuC}
                        autoCapitalize={'none'}
                        placeholder={'Search'}
                        isError={false}
                        isFocus={focusSearch}
                        onBlur={() => setFocusSearch(false)}
                        onFocus={() => onSearchBarFocus()}
                        icon={true}
                        onChangeText={(text) => {
                            onChangeSearchBar(text)
                        }}
                        type={false}
                        clearIcon={true}
                        showPlaceHolder={true}
                    />
                    {separatorHeight()}
                    {(serachBar != '' ? searchData : itemCB?.route?.tradeData?.chemical_data || itemCB?.chemical_data)?.map((chemical, index) => (
                        <View style={styles.titleConatiner} key={index}>
                            <Text style={styles.chemicalTitle}>{chemical?.chemical_data_detail?.title}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </RBSheet>
    )
}

const styles = StyleSheet.create({
    body: {
        marginTop: Platform.OS === 'ios' ? hp('5') : hp(0),
        width: wp('100%'),
        height: hp('100%'),
        backgroundColor: Colors.White
    },
    headingContainer: {
        width: wp('86%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_BOLD,
        fontSize: Typography.FONT_SIZE_14
    },
    chemicalTitle: {
        color: Colors.Black,
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontSize: Typography.FONT_SIZE_14,
        paddingLeft: wp('2%'),
        paddingVertical: hp(1)
    },
    crossIcon: {
        width: wp('6%'),
        height: hp('6%')
    },
    titleConatiner: {
        width: wp('92%'),
        // height: hp('65%'),
        backgroundColor: Colors.White,
        borderColor: Colors.BorderGrey,
        borderWidth: wp(0.3),
        borderRadius: wp('2%'),
        marginTop: hp(1)
    },
    backgroundContainer: {
        width: wp('92%'),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,
        // borderColor: Colors.BorderGrey,
        // borderWidth: wp(0.3),
        borderRadius: wp('4%'),
        paddingVertical: hp('1%'),
        marginTop: hp('2%')
    },
    input: {
        width: wp('86'),
        backgroundColor: Colors.White,
        paddingRight: wp(4)
    },
    inpuC: {
        width: wp('92'),
        backgroundColor: Colors.White
    }
})

export default ChemicalsDetailUsed
