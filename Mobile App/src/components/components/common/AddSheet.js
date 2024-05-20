import React, {useState} from 'react'
import {heightPercentageToDP as hp} from 'react-native-responsive-screen'
import RBSheet from 'react-native-raw-bottom-sheet'

import AddProductScreen from '../../../screens/appFlow/add/AddProductScreen'

const AddSheet = ({setRef, title, onCloseCB, editPostData}) => {
    const [visible, setVisible] = useState(true)

    const _onOpen = () => setVisible(true)
    const _onClose = () => setVisible(false)

    return (
        <RBSheet animationType={'slide'} ref={setRef} height={hp('100%')} closeOnDragDown={false} closeOnPressMask={true} openDuration={100} closeDuration={100} onOpen={_onOpen} onClose={_onClose}>
            <AddProductScreen title={title} onCloseCB={onCloseCB} visible={visible} _editPostData={editPostData} />
        </RBSheet>
    )
}

export default AddSheet
