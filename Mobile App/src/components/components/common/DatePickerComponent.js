import React, {useState} from 'react'
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import DatePicker from 'react-native-date-picker'
import FastImage from 'react-native-fast-image'
import moment from 'moment'
import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const DatePickerComponent = ({fromDate, toDate}) => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedFrom, setSelectedFrom] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [open, setOpen] = useState(false)
    const [from, setFrom] = useState(false)

    const toggleDatePicker = (type) => {
        if (type == 'from') {
            setFrom(true)
        }
        setShowDatePicker(true)
        setOpen(true)
    }

    const handleDateChange = (date) => {
        if (from) {
            setSelectedFrom(date)
            setFrom(false)
        } else {
            setSelectedDate(date)
        }
        setShowDatePicker(false)
        setOpen(false)
    }

    return (
        <>
            <View style={styles.dateText}>
                <Text style={styles.pickFromTo}>{fromDate}</Text>
                <Text style={styles.pickFromTo}>{toDate}</Text>
            </View>
            <View style={styles.dateContainer}>
                <TouchableOpacity style={styles.pickDateImage} onPress={() => toggleDatePicker('from')}>
                    <Text style={styles.pickOption}>{moment(selectedFrom).format('MMM/DD/YYYY')}</Text>
                    <FastImage source={require('../../../assets/icons/screens/down_arrow.png')} resizeMode={'contain'} style={styles.icons} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.pickDateImage} onPress={toggleDatePicker}>
                    <Text style={styles.pickOption}>{moment(selectedDate).format('MMM/DD/YYYY')}</Text>
                    <FastImage source={require('../../../assets/icons/screens/down_arrow.png')} resizeMode={'contain'} style={styles.icons} />
                </TouchableOpacity>
            </View>
            {showDatePicker && (
                <DatePicker
                    modal
                    open={open}
                    date={(selectedFrom, selectedDate)}
                    mode="date"
                    onConfirm={handleDateChange}
                    onCancel={() => {
                        setOpen(false)
                    }}
                />
            )}
        </>
    )
}

export default DatePickerComponent

const styles = StyleSheet.create({
    dateText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: wp('60%'),
        height: hp('3%'),
        alignSelf: 'center',
        marginTop: hp('2%')
    },
    pickFromTo: {
        alignSelf: 'center',
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: wp('92%'),
        alignSelf: 'center',
        alignItems: 'center'
    },
    pickDateImage: {
        width: wp('42%'),
        height: hp('6%'),
        backgroundColor: Colors.White,
        borderRadius: wp('2%'),
        justifyContent: 'center',
        flexDirection: 'row',
        borderWidth: wp(0.4),
        borderColor: Colors.BorderGrey
    },
    pickOption: {
        alignSelf: 'center',
        color: Colors.Black,
        fontSize: Typography.FONT_SIZE_13,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    icons: {
        width: wp('5%'),
        height: wp('5%'),
        alignSelf: 'center',
        left: wp('2%')
    }
})
