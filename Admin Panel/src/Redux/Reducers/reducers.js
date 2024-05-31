import { IS_LOGIN } from "../constants"

let token = localStorage.getItem('auth_token')
const initialState = {
	isLogin: token ? true : false,
}
const dataForEditing = (state = initialState, action) => {
	switch (action.type) {
		case IS_LOGIN:
			return {
				isLogin: action.data,
			}
		// break;
		default:
			return state
	}
}
export default dataForEditing
