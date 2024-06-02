import React, {memo} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import * as Colors from '../constants/colors'
const Label = ({text, ...restProps}) => {
    return (
        <View style={styles.root} {...restProps}>
            <Text style={styles.text}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 8,
        backgroundColor: Colors.ActiveBtColor,
        borderRadius: 4
    },
    text: {
        fontSize: 16,
        color: '#fff'
    }
})

export default memo(Label)
