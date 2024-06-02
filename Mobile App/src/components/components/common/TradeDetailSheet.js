import React, {useState} from 'react'
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen'
import RBSheet from 'react-native-raw-bottom-sheet'

import TradeDetailInfoScreen from '../../../screens/appFlow/home/TradeDetailInfoScreen'
import {useNavigation} from '@react-navigation/native'

const TradeDetailSheet = ({setRef, onCloseCB, itemCB}) => {
    const navigation = useNavigation()
    const [visible, setVisible] = useState(true)
    const _onOpen = () => {
        setVisible(true)
    }
    const _onClose = () => {
        setVisible(false)
    }

    return (
        <RBSheet animationType={'slide'} ref={setRef} height={hp('100%')} closeOnDragDown={false} closeOnPressMask={true} openDuration={100} closeDuration={100} onOpen={_onOpen} onClose={_onClose}>
            <TradeDetailInfoScreen onCloseCB={onCloseCB} itemCB={itemCB} />
        </RBSheet>
    )
}

export default TradeDetailSheet
