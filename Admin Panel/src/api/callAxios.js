import axios from 'axios'
import { base_url } from '../assets/constant/urls'
export const api = axios.create({
	baseURL: base_url,
	headers: {
		'Content-Type': 'application/json'
	}
})

api.interceptors.request.use(
	(request) => {
		let token = localStorage.getItem('auth_token')
		if (token) {
			request.headers.common.Authorization = `${token}`
		}
		return request
	},
	(error) => {
		return Promise.reject(error)
	}
)
api.interceptors.response.use(
	(response) => {
		return response
	},
	function (error) {
		return Promise.reject(error)
	}
)
