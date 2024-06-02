import React from 'react'
import {View, StyleSheet} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import DropDownPicker from 'react-native-dropdown-picker'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const MultipleSelectPicker = ({open, value, items, setOpen, setValue, setItems, onSelectItem}) => {
    return (
        <View style={{position: 'relative', zIndex: 20, marginTop: hp('0.5')}}>
            <DropDownPicker
                multipleText={value.length + ' Chemicals have been selected'}
                multiple={true}
                min={0}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                onSelectItem={onSelectItem}
                closeAfterSelecting={true}
                placeholder="Select"
                placeholderStyle={{
                    fontFamily: Typography.FONT_FAMILY_REGULAR,
                    color: Colors.Black,
                    fontSize: Typography.FONT_SIZE_16
                }}
                labelStyle={{
                    fontFamily: Typography.FONT_FAMILY_REGULAR,
                    color: Colors.Black,
                    fontSize: Typography.FONT_SIZE_16
                }}
                textStyle={{
                    fontFamily: Typography.FONT_FAMILY_REGULAR,
                    color: Colors.Black,
                    fontSize: Typography.FONT_SIZE_16
                }}
                containerStyle={{
                    width: wp('92%'),
                    flexGrow: open ? 1 : 0
                }}
                style={{
                    borderColor: Colors.BorderGrey,
                    borderRadius: wp('8')
                }}
                dropDownContainerStyle={{
                    borderColor: Colors.BorderGrey,
                    borderRadius: wp('8')
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({})

export default MultipleSelectPicker
