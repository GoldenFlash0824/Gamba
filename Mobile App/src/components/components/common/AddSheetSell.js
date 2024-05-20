import React, {useState} from 'react'
import {heightPercentageToDP as hp} from 'react-native-responsive-screen'
import RBSheet from 'react-native-raw-bottom-sheet'

import AddSellYourGoodsScreen from '../../../screens/appFlow/add/AddSellYourGoodsScreen'

const AddSheetSell = ({setRef, title, onCloseCB, editProductData}) => {
    const [visible, setVisible] = useState(true)

    const _onOpen = () => setVisible(true)
    const _onClose = () => setVisible(false)

    return (
        <RBSheet animationType={'slide'} ref={setRef} height={hp('100%')} closeOnDragDown={false} closeOnPressMask={true} openDuration={100} closeDuration={100} onOpen={_onOpen} onClose={_onClose}>
            <AddSellYourGoodsScreen title={title} onCloseCB={onCloseCB} visible={visible} _editProductData={editProductData} />
        </RBSheet>
    )
}

export default AddSheetSell
