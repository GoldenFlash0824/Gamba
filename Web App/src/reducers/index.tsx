import { combineReducers } from 'redux'
import auth from './authReducer'
import cart from './cartReducer'
import event from './eventReducer'

export default combineReducers({
	auth,
	cart,
	event
})
