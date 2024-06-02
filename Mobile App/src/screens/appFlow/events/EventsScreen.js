import React, {useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'

import * as Colors from '../../../constants/colors'
import * as Typography from '../../../constants/typography'
import MainHeader from '../../../components/components/common/MainHeader'
import TabViews from '../../../components/components/common/TabViews'
import AllEvents from '../../../components/components/common/AllEvents'
import MyEvents from '../../../components/components/common/MyEvents'
import InputWithLabels from '../../../components/components/common/InputWithLabels'
import {separatorHeightH} from '../../../utils/helpers'

const EventsScreen = ({navigation}) => {
    const renderScene = {allEvents: AllEvents, myEvents: MyEvents}
    const [serachBar, setserachBar] = useState('')
    const [focusSearch, setFocusSearch] = useState(false)
    const [index, setIndex] = useState(0)
    const routes = [
        {key: 'allEvents', title: 'All Events', id: 0, ind: index, searching: serachBar},
        {key: 'myEvents', title: 'My Events', id: 1, ind: index, searching: serachBar}
    ]

    const chatHandler = () => {
        navigation.navigate('ChatScreen')
    }
    const leftDrawerHandler = () => {
        navigation.getParent('LeftDrawer').openDrawer()
    }
    const rightDrawerHandler = () => {
        navigation.getParent('RightDrawer').openDrawer()
    }
    const notificationHandler = () => {
        navigation.navigate('NotificationScreen')
    }
    const onChangeSearchBar = async (text) => {
        text = text.toLowerCase()
        setserachBar(text)
    }
    const onSubmitProducts = async () => {
        setFocusSearch(false)
    }
    return (
        <>
            <MainHeader back={true} rightDrawerCB={rightDrawerHandler} leftDrawerCB={leftDrawerHandler} notificationCB={notificationHandler} right={true} noti={true} chatCB={chatHandler} />
            <View style={styles.topContainer}>
                {separatorHeightH()}

                <InputWithLabels
                    showLabelCB={false}
                    value={serachBar}
                    inputStyles={{width: wp('86'), paddingRight: wp('4')}}
                    style={{width: wp('92')}}
                    autoCapitalize={'none'}
                    placeholder={'Search'}
                    isError={false}
                    isFocus={focusSearch}
                    onBlur={onSubmitProducts}
                    onFocus={() => setFocusSearch(true)}
                    icon={true}
                    onChangeText={(text) => {
                        onChangeSearchBar(text)
                    }}
                    showPlaceHolder={true}
                    leftIcon={false}
                    clearIcon={true}
                />
                {separatorHeightH()}
            </View>
            <TabViews renderSceneCB={renderScene} routesCB={routes} indexCB={(ind) => (setIndex(ind), setserachBar(''))} style={styles.labelStyle} styleU={styles.labelStyleU} />
        </>
    )
}

const styles = StyleSheet.create({
    labelStyle: {
        fontSize: 16,
        fontFamily: Typography.FONT_FAMILY_BOLD
    },
    labelStyleU: {
        color: Colors.LightGrayColor,
        fontSize: 16,
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    topContainer: {
        width: wp('100%'),
        backgroundColor: Colors.White,
        alignItems: 'center'
    }
})

export default EventsScreen
