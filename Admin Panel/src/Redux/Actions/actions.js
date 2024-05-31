import {IS_LOGIN} from "../constants"
export const LoginController = (data) => {
	return {
		type: IS_LOGIN,
		data: data,
	}
}
