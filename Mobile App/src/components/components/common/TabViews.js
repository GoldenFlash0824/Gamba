import React, {useState, useEffect, useRef} from 'react'
import {StyleSheet, View, useWindowDimensions, Text, TouchableOpacity} from 'react-native'
import {TabView, TabBar, SceneMap} from 'react-native-tab-view'
import FastImage from 'react-native-fast-image'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import {useIsFocused} from '@react-navigation/native'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'

const TabViews = (props) => {
    const isFocused = useIsFocused()
    const [stylesLable, setStylesLable] = useState(styles.labelStyle)
    useEffect(() => {
        if (isFocused) {
            const func = async () => {
                setStylesLable(props.style)
                // setIndex(0)
            }
            func()
        }
    }, [isFocused])
    const renderScene = SceneMap(props.renderSceneCB)
    const layout = useWindowDimensions()
    const [index, setIndex] = useState(0)

    const routes = props.routesCB
    const setIndexHandler = (ind) => {
        setIndex(ind)
        props.indexCB(ind)
    }

    const renderTabBarItemS = (prop) => {
        return (
            <View style={styles.tabContainer}>
                {prop.navigationState.routes.map((route, ind) => {
                    return (
                        <TouchableOpacity onPress={() => setIndexHandler(ind)} style={index == route.id ? styles.titleContainer : styles.titleContainerU} key={ind}>
                            <Text style={[styles.labelStyle, index == route.id ? props.style : props.styleU]}>{route.title}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }

    return <TabView renderTabBar={renderTabBarItemS} navigationState={{index, routes}} renderScene={renderScene} onIndexChange={setIndexHandler} initialLayout={{width: layout.width}} />
}

const styles = StyleSheet.create({
    tabContainer: {
        justifyContent: 'space-around',
        backgroundColor: Colors.White,
        paddingVertical: hp('1'),
        flexDirection: 'row',
        width: wp('100'),
        alignSelf: 'center'
    },
    titleContainer: {
        borderRadius: wp('8'),
        backgroundColor: Colors.LightMainColor,
        paddingVertical: hp('1'),
        paddingHorizontal: wp('3')
    },
    titleContainerU: {
        borderRadius: wp('8'),
        backgroundColor: Colors.White,
        paddingVertical: hp('1')
    },
    labelStyle: {
        color: Colors.MainThemeColor,
        fontSize: Typography.FONT_SIZE_8,
        fontFamily: Typography.FONT_FAMILY_MEDIUM,
        textTransform: 'capitalize'
    },

    inactiveColor: {
        backgroundColor: Colors.White
    },
    activeIcon: {
        width: wp('10%'),
        height: wp('10%')
    },
    activeIconP: {
        width: wp('7.5%') * 0.89,
        height: wp('7.5%'),
        marginTop: hp('1')
    },
    activeIconT: {
        width: wp('9%'),
        height: wp('9%')
    }
})

export default TabViews
