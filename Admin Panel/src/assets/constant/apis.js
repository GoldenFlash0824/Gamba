import { api } from "../../api/callAxios"

export const getCategory = async () => {
	let response = []
	await api
		.get(`user/product/get_all_category`)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const doGetChemicals = async () => {
	let response = []
	await api
		.get(`user/product/get_all_chemical`)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}