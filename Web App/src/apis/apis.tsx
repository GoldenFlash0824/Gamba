import axios from 'axios'
import { toastError, toastSuccess } from '../styled/toastStyle'


axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Accept'] = 'application/json'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'

const environment = process.env.REACT_APP_PUBLIC_WEAVY_URL
const apiKey = process.env.REACT_APP_PUBLIC_WEAVY_APIKEY

interface IData {
	data: [{}]
	message: string
	status: boolean
}

export const registerUser: any = async (firstName: any, lastName: any, email: any, password: any, phoneNumber: any, lat: any, log: any, location: any) => {
	let response: IData[] = []

	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/register`, { first_name: firstName, last_name: lastName, email: email, password: password, confirmPassword: password, phone: phoneNumber, lat, log, address: location })
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const loginUser: any = async (email: any, password: any, lat: any, log: any, location: any) => {
	let response: IData[] = []
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/login`, { email: email, password: password, lat, log, address: location })
		.then((res) => {
			response = res?.data
			response = res?.data
			if (res?.data?.success === true) {
				sessionStorage.setItem('authorization', res?.data?.data?.user?.auth_token)
			}
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const logoutUser: any = async () => {
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	await axios.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/logout`, {
		headers: {
			authorization: `bearer ${token}`
		}
	})
		.then((res) => {
			if (res?.data?.success === true) {
				localStorage.removeItem('authorization')
				sessionStorage.removeItem('authorization')
				sessionStorage.removeItem('chatToken')
			}
		})
		.catch((error) => {
			console.log(error)
		})
}

export const createPost: any = async (description: any, images: any, title: any, privacy: any, postDate: any) => {
	let response: IData[] = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/posts/create_post`, { description: description, images: images, title: title, privacy, future_post_date: postDate }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const editPost: any = async (id: any, description: any, images: any, title: any, privacy: any, postDate: any) => {
	let response: IData[] = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/posts/update_post/${id}`, { description: description, images: images, title: title, privacy, future_post_date: postDate }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const deletePost: any = async (id: any) => {
	let response: any = null
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.delete(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/posts/delete_post/${id}`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const createEvent: any = async (price: any, location: any, latitude: any, longitude: any, start_date: any, end_date: any, summary: any, image: any, title: any, is_private: any, privacy: any, limitTo: any, limitToNumber: any) => {
	let response: IData[] = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(
			`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/event/create_event`,
			{
				price: price,
				location,
				latitude: latitude,
				longitude: longitude,
				start_date: start_date,
				end_date: end_date,
				summary: summary,
				title: title,
				image: image,
				is_private: is_private,
				privacy,
				limit_to: limitTo,
				limit_to_number: parseInt(limitToNumber)
			},
			config
		)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const UpdateEvent: any = async (id: any, price: any, location: any, latitude: any, longitude: any, start_date: any, end_date: any, summary: any, image: any, title: any, is_private: any, privacy: any, limitTo: any, limitToNumber) => {
	let response: IData[] = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.put(
			`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/event/update_event/${id}`,
			{
				price: price,
				location,
				latitude: latitude,
				longitude: longitude,
				start_date: start_date,
				end_date: end_date,
				summary: summary,
				title: title,
				image: image,
				is_private: is_private,
				privacy,
				limit_to: limitTo,
				limit_to_number: parseInt(limitToNumber)
			},
			config
		)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const addNewProduct: any = async (
	name: any,
	price: any,
	is_donation: any,
	is_trade: any,
	productImage: any,
	quantity: any,
	is_organic: any,
	category_id: any,
	discount: any,
	unit: any,
	trade_with: any,
	chemical_id: any,
	available_from: any,
	available_to: any,
	allow_to_0rder: any,
	is_delivery: any,
	is_pickUp: any,
	// advance_order_day: any,
	allow_to_0rder_advance: any,
	distance: any,
	caption: any,
	// chemicalCheckBoxNone: any,
	allowCustomersToGetUpTo: any,
	isUnlimitted: any
) => {
	let response: IData[] = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(
			`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/product/add_new_product`,
			{
				name: name,
				price: price,
				is_donation: is_donation,
				is_trade: is_trade,
				images: productImage,
				quantity: quantity,
				is_organic: is_organic,
				category_id: category_id,
				discount: discount ? discount : 0,
				unit: unit,
				trade_with: trade_with,
				chemical_id: chemical_id,
				available_from,
				available_to,
				allow_to_0rder,
				is_delivery,
				is_pickUp,
				// advance_order_day,
				allow_to_0rder_advance: parseInt(allow_to_0rder_advance),
				distance: is_delivery ? distance : null,
				caption,
				// none: chemicalCheckBoxNone,
				allow_per_person: parseInt(allowCustomersToGetUpTo),
				isUnlimitted
			},

			config
		)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const updateProduct: any = async (
	id: any,
	name: any,
	price: any,
	is_donation: any,
	is_trade: any,
	productImage: any,
	quantity: any,
	is_organic: any,
	category_id: any,
	discount: any,
	unit: any,
	trade_with: any,
	chemical_id: any,
	available_from: any,
	available_to: any,
	allow_to_0rder: any,
	is_delivery: any,
	is_pickUp: any,
	// advance_order_day: any,
	allow_to_0rder_advance: any,
	distance: any,
	caption: any,
	// chemicalCheckBoxNone: any,
	allowCustomersToGetUpTo: any,
	isUnlimitted: any
) => {
	let response: IData[] = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(
			`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/product/update_product/${id}`,
			{
				name: name,
				price: price,
				is_donation: is_donation,
				is_trade: is_trade,
				images: productImage,
				quantity: quantity,
				is_organic: is_organic,
				category_id: category_id,
				discount: discount ? discount : 0,
				unit: unit,
				trade_with: trade_with,
				chemical_id: chemical_id,
				available_from,
				available_to,
				allow_to_0rder,
				is_delivery,
				is_pickUp,
				// advance_order_day,
				allow_to_0rder_advance,
				distance: is_delivery ? distance : null,
				caption,
				// none: chemicalCheckBoxNone,
				allow_per_person: parseInt(allowCustomersToGetUpTo),
				isUnlimitted
			},

			config
		)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const deleteProduct: any = async (id: any) => {
	let response: any = null
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.delete(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/product/delete_product_good/${id}`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const getAllUserPosts: any = async (page: any) => {
	let response: IData[] = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/posts/get_all_posts?page=${page}`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})

	return response
}
export const getSellerAllPost: any = async (userId: any) => {
	let response: IData[] = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/posts/seller_all_post`, { u_id: userId }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const getCategory: any = async () => {
	let response: IData[] = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/product/get_all_category?isWeb=true`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const verifyUserRegisterCodeApi: any = async (email: any, verification_code: any, two_fector_auth) => {
	let response: IData[] = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/verify_register_code`, { email: email, verification_code: verification_code, two_fector_auth }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			toastError(error.message)
			console.error(error)
		})
	return response
}

export const getAllProductsApi: any = async (trade = 0, discount = 0, donation = 0, organicProducts, page: any) => {
	let response: IData[] = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		params: { is_trade: trade, is_donation: donation, is_discount: discount, is_organic: organicProducts },
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/product/get_all_products?page=${page}`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			toastError(error.message)
			console.error(error)
		})
	return response
}
export const getUserAllProductsApi: any = async (userId: any, trade = 0, discount = 0, donation = 0) => {
	let response: IData[] = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		// params: {is_trade: trade, is_donation: donation, is_discount: discount},
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/product/get_user_products`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			toastError(error.message)
			console.error(error)
		})
	return response
}
///Not Working from backend
export const addPostLikesApi: any = async (post_id: any) => {
	let response: IData[] = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}

	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/posts/add_like`, { post_id: post_id }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const getAllEventsApi: any = async (page) => {
	let response: IData[] = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		params: { page: page },
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/event/all_events`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			toastError(error.message)
			console.error(error)
		})
	return response
}

export const deleteEvent: any = async (id: any) => {
	let response = ''
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.delete(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/event/delete_event/${id}`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			toastError(error.message)
			console.error(error)
		})
	return response
}

export const getAllSellersApi: any = async (is_organic: any, page: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		params: { is_organic: is_organic },
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/get_all_sellers?page=${page}`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const searchSellersApi: any = async (filter: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` },
		params: { filter: filter }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/search_sellers`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const searchProductsApi: any = async (trade = 0, discount = 0, donation = 0, filter: any, is_organic: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` },
		params: { is_trade: trade, is_donation: donation, is_discount: discount, filter: filter, is_organic }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/product/search_products`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const searchTradeApi: any = async (trade, tradewith, is_organic) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/product/search`, { trade: trade, tradeWith: tradewith, is_organic }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const searchPostsApi: any = async (filter) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` },
		params: { filter: filter }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/posts/search_posts`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const getTopUsersApi: any = async () => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/get_user_with_max_posts`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const paymentApi: any = async (delivery_charges, service_charges, total, products, payment_method) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/checkout/payment`, { delivery_charges: delivery_charges, service_charges: service_charges, total: total, products: products, payment_method }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const addRatingToProduct: any = async (product_id, rating) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/product/add_rating`, { product_id: product_id, rating: rating }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const getOrdersApi: any = async () => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/checkout/orders`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const getUserPosts: any = async () => {
	let response: IData[] = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/posts/view_single_user`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}
export const getUserEvents: any = async () => {
	let response: IData[] = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/event/event`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

// add post comment
export const doAddPostComment: any = async (p_id: any, comment: any, page: any, media: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/add_post_comments`, { p_id, comment, page, order: 'desc', imageData: media }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

// get post comment
export const doGetPostComment: any = async (p_id: any, page: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/view_all_post_comments`, { p_id, page, order: 'desc' }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

// add post comment like
export const doAddPostCommentLike: any = async (p_id: any, c_id: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/like_comment`, { p_id, c_id }, config)
		.then((res) => {
			if (res.data?.success) {
				response = res?.data
			} else {
				toastError(res?.data?.message)
			}
		})
		.catch((error) => {
			toastError(error.message)
		})
	return response
}

// add post reply like
export const doAddPostReplyLike: any = async (p_id: any, r_id: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/like_comment`, { p_id, r_id }, config)
		.then((res) => {
			if (res.data?.success) {
				response = res?.data
			} else {
				toastError(res?.data?.message)
			}
		})
		.catch((error) => {
			toastError(error.message)
		})
	return response
}

//  post comment unlike
export const doPostCommentUnLike: any = async (p_id: any, c_id: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/unlike_comment`, { p_id, c_id }, config)
		.then((res) => {
			if (res.data?.success) {
				response = res?.data
			} else {
				toastError(res?.data?.message)
			}
		})
		.catch((error) => {
			toastError(error.message)
		})
	return response
}

// post reply unlike
export const doPostReplyUnLike: any = async (p_id: any, r_id: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/unlike_comment`, { p_id, r_id }, config)
		.then((res) => {
			if (res.data?.success) {
				response = res?.data
			} else {
				toastError(res?.data?.message)
			}
		})
		.catch((error) => {
			toastError(error.message)
		})
	return response
}

// add post reply
export const doAddPostReply = async (p_id: any, c_id: any, reply: any, page: any, media: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/add_post_reply`, { p_id, c_id, reply, page, order: 'desc', imageData: media }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response;
}

// remove like
export const doUnlikePost: any = async (post_id: any) => {
	let response: IData[] = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/posts/un_like`, { post_id: post_id }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

// update post comment
export const doUpdatePostComment = async (id: any, comment: any, page: any, media: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/update_post_comment`, { id, comment, page, order: 'desc', imageData: media }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

// update post reply
export const doUpdatePostReply = async (id: any, reply: any, page: any, p_id: any, media: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/update_post_reply`, { id, reply, page, order: 'desc', p_id, media }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

// delete post reply
export const doDeletePostReply = async (id: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/delete_post_reply`, { id }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

// delete post comment
export const doDeletePostComment = async (id: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/delete_post_comment`, { id }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

// add post comment dislike
export const doAddPostCommentDisLike: any = async (p_id: any, c_id: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/disLike_comment`, { p_id, c_id }, config)
		.then((res) => {
			if (res.data?.success) {
				response = res?.data
			} else {
				toastError(res?.data?.message)
			}
		})
		.catch((error) => {
			toastError(error.message)
		})
	return response
}

// add post reply dislike
export const doAddPostReplyDisLike: any = async (p_id: any, r_id: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/disLike_comment`, { p_id, r_id }, config)
		.then((res) => {
			if (res.data?.success) {
				response = res?.data
			} else {
				toastError(res?.data?.message)
			}
		})
		.catch((error) => {
			toastError(error.message)
		})
	return response
}

//  post comment unlike
export const doPostCommentRemoveDisLike: any = async (p_id: any, c_id: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/remove_disLike_comment`, { p_id, c_id }, config)
		.then((res) => {
			if (res.data?.success) {
				response = res?.data
			} else {
				toastError(res?.data?.message)
			}
		})
		.catch((error) => {
			toastError(error.message)
		})
	return response
}

// post reply unlike
export const doPostReplyremoveDisLike: any = async (p_id: any, r_id: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/remove_disLike_comment`, { p_id, r_id }, config)
		.then((res) => {
			if (res.data?.success) {
				response = res?.data
			} else {
				toastError(res?.data?.message)
			}
		})
		.catch((error) => {
			toastError(error.message)
		})
	return response
}

// view all dislike users
export const doViewAllDislikeUsers: any = async (p_id: any, r_id: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/view_all_disLiked_comments`, { p_id, r_id }, config)
		.then((res) => {
			if (res.data?.success) {
				response = res?.data
			} else {
				toastError(res?.data?.message)
			}
		})
		.catch((error) => {
			toastError(error.message)
		})
	return response
}

export const getPopularSeller: any = async () => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/top_seller`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const getPopularPost: any = async () => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/posts/get_popular_post`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const getPopularEvent: any = async () => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/event/popular_event`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}
export const reportPost = async (post_id: any, reason: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}admin/reported_post`, { post_id, reason }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const reportEvent = async (event_id: any, reason: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}admin/reported_event`, { event_id, reason }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const reportProduct = async (product_id: any, reason: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}admin/reported_product`, { product_id, reason }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const doGetChemicals = async () => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/product/get_all_chemical`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const doGetUserProfile = async () => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/user_profile`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const getPostById = async (post_id: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/posts/get_post_by_id`, { post_id: parseInt(post_id) }, config)
		.then((res) => {
			response = res?.data?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const joinEvent = async (event_id: any, payment_id: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/event/join_event`, { event_id, payment_id }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}
export const UnJoinEvent = async (event_id: any, payment_id: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/event/un_join_event`, { event_id, payment_id }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const updateUserInfo: any = async (first_name, last_name, image, phone, about, dob, gender, address, email) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/update`, { first_name: first_name, last_name: last_name, image: image, phone: phone, about: about, dob, gender, address, email }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const updatePassword: any = async (previousPassword, newPassword, forgotPassword) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/update_user_password`, { previousPassword: previousPassword, newPassword: newPassword, isUpdate: forgotPassword }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const contectUs: any = async (first_name, last_name, email, phone, subject, message) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/contect_us`, { first_name: first_name, last_name: last_name, email: email, phone: phone, subject: subject, message: message }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const searchEventsApi: any = async (page: any, filter: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` },
		params: { page: page, filter: filter }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/event/search_events`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const searchMyEventsApi: any = async (page: any, filter: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` },
		params: { page: page, filter: filter }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/event/search_my_events`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const getEventById = async (event_id: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/event/get_event_by_id`, { event_id: parseInt(event_id) }, config)
		.then((res) => {
			response = res?.data?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}
export const getSellerById = async (seller_id: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/get_seller_by_id`, { seller_id: parseInt(seller_id) }, config)
		.then((res) => {
			response = res?.data?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}
export const getProductById = async (product_id: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/product/get_product_by_id`, { product_id: parseInt(product_id) }, config)
		.then((res) => {
			response = res?.data?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}
export const notificationApi: any = async () => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/user_notification`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const hidePost = async (post_id: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/posts/hide_post`, { post_id: parseInt(post_id) }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const hideEvent = async (event_id: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/event/hide_event`, { event_id: parseInt(event_id) }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const hideSeller = async (seller_id: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/hide_seller`, { seller_id: parseInt(seller_id) }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}
export const getPostAllLikes = async (post_id: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/posts/all_likes`, { post_id: parseInt(post_id) }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}
export const getUserSoldProducts = async () => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/seller_order_data`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}
export const deleteAccountApi = async (reason, password) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/delete_account`, { reason }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const dsiableAccountApi = async (u_id, enable) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/disable_account`, { u_id: u_id, enable: enable }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const notificationSetting = async (allowOffers: any, emailNotification: any, smsNotification: any, recieveMessages: any, twoFactorAuthentication: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(
			`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/notification_setting`,
			{ email_notification: emailNotification, sms_notification: smsNotification, recieve_msg: recieveMessages, promotional_offers: allowOffers, two_fector_auth: twoFactorAuthentication },
			config
		)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const deleteNotification: any = async (id: any) => {
	let response: any = null
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.delete(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/notifications/${id}`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const soldProductHistoryApi = async () => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/seller_order_data`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const getNotificationSettingApi = async () => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/get_notification_setting`, config)
		.then((res) => {
			response = res?.data?.data?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}
export const getFavoriteProducts = async () => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/product/get_fev_product`, config)
		.then((res) => {
			response = res?.data?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}
export const addFavProducts = async (product_id: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/product/mark_favorite`, { product_id }, config)
		.then((res) => {
			response = res?.data?.data?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}
export const addFavSeller = async (seller_id: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/add_seller_to_fev`, { seller_id }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const reSendApi = async (email: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/re_send_verification_code`, { email }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}
export const forgetPassword = async (email: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/reset_password`, { email }, config)
		.then((res) => {
			response = res?.data

			if (response?.success) {
				toastSuccess(response?.message)
			} else {
				toastError(response?.message)
			}
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}
export const totalCount = async () => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/posts/side_bar_count`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const getFevSeller = async () => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/get_all_fev_seller`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const sideBarCountProduct = async () => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/product/side_bar_count_product`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const getAccessToken = (id: any) => {
	const url = `${environment}/api/users/{${id}}/tokens`
	const data = {
		expires_in: 7200
	}
	const headers = {
		Authorization: `Bearer ${apiKey}`,
		'Content-Type': 'application/json'
	}
	axios
		.post(url, data, { headers })
		.then(async (response) => {
			const accessToken = response.data.access_token
			sessionStorage.setItem('chatToken', accessToken)
		})
		.catch((error) => {
			console.log('Error:', error)
		})
}

export const addUserInChat = async (id: any, user: any) => {
	const environment = process.env.REACT_APP_PUBLIC_WEAVY_URL
	const apiKey = process.env.REACT_APP_PUBLIC_WEAVY_APIKEY
	let name = user?.first_name && user?.first_name + ' ' + user?.last_name
	const config = {
		headers: { authorization: `bearer ${user?.login_token}` }
	}
	try {
		const headers = {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		}

		await axios
			.post(
				`${environment}/api/users`,
				{
					uid: id + 'a',
					name: name,
					expires_in: 7200
				},
				{ headers }
			)
			.then((res) => {
			})
			.catch((err) => {
				console.log(err)
			})

		await axios.post(
			`${environment}/api/users/${id + 'a'}/tokens`,
			{
				name: name,
				expires_in: 7200
			},
			{ headers }
		)

		const userResponse = await axios.put(
			`${environment}/api/users/${id + 'a'}`,
			{ name: name, email: user?.email, phone_number: user?.phone, picture: user?.image ? process.env.REACT_APP_PUBLIC_IMAGE_URL + user?.image : process.env.REACT_APP_PUBLIC_IMAGE_URL + user?.first_name[0]?.toLowerCase() + '.png' },
			{ headers }
		)

		await axios
			.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/update`, { chat_id: userResponse?.data?.id }, config)
			.then((res) => {
			})
			.catch((error) => {
				console.error(error)
			})

		return userResponse
	} catch (error) {
		console.log('Error:', error)
	}
}
export const addUsers = async () => {
	const adminConfig = {
		headers: { authorization: `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoxLCJpc0FkbWluIjp0cnVlfSwiaWF0IjoxNjkyMDg1OTE5LCJleHAiOjE2OTcyNjk5MTl9.RV5yXak6hVP8Wn97MSVpxkdTGAsoPjH1eCvrRBIvLS0` }
	}
	const environment = process.env.REACT_APP_PUBLIC_WEAVY_URL
	const apiKey = process.env.REACT_APP_PUBLIC_WEAVY_APIKEY

	await axios.get(`http://44.215.216.235:5000/gamba/admin/view_all_user?page=1`, adminConfig).then(async (res) => {
		if (res?.data?.data?.all_users?.all_users) {
			let users = res?.data?.data?.all_users?.all_users
			for (let i = 0; i < users?.length; i++) {
				let name = users[i]?.first_name && users[i]?.first_name + ' ' + users[i]?.last_name


				const config = {
					headers: { authorization: `bearer ${users[i]?.login_token}` }
				}

				try {
					const headers = {
						Authorization: `Bearer ${apiKey}`,
						'Content-Type': 'application/json'
					}

					let userDetails = await axios
						.get(`${environment}/api/users/${users[i]?.id + 'a'}`, { headers })
						.then((res) => {
							return res
						})
						.catch((err) => {
							console.log(err)
						})

					if (userDetails?.data) {
						await axios
							.post(`http://44.215.216.235:5000/gamba/user/update`, { email: users[i]?.email, chat_id: userDetails?.data?.id }, config)
							.then((res) => {
							})
							.catch((error) => {
								console.error(error)
							})
					} else {
						await axios
							.post(
								`${environment}/api/users`,
								{
									uid: users[i]?.id + 'a',
									name: name,
									expires_in: 7200
								},
								{ headers }
							)
							.then((res) => {
							})
							.catch((err) => {
								console.log(err)
							})
					}

					await axios.post(
						`${environment}/api/users/${users[i]?.id + 'a'}/tokens`,
						{
							name: name,
							expires_in: 7200
						},
						{ headers }
					)

					const userResponse = await axios.put(
						`${environment}/api/users/${users[i]?.id + 'a'}`,
						{
							name: name,
							email: users[i]?.email,
							phone_number: users[i]?.phone,
							display_name: name,
							picture: users[i]?.image ? process.env.REACT_APP_PUBLIC_IMAGE_URL + users[i]?.image : process.env.REACT_APP_PUBLIC_IMAGE_URL + users[i]?.first_name[0]?.toLowerCase() + '.png'
						},
						{ headers }
					)

					await axios
						.post(`http://44.215.216.235:5000/gamba/user/update`, { chat_id: userResponse?.data?.id }, config)
						.then((res) => {
						})
						.catch((error) => {
							console.error(error)
						})

				} catch (error) {
					console.log('Error:', error)
				}
			}
		}
	})
}

export const updateUserInChat = async (id: any, user: any) => {
	const environment = process.env.REACT_APP_PUBLIC_WEAVY_URL
	const apiKey = process.env.REACT_APP_PUBLIC_WEAVY_APIKEY
	let name = user?.first_name && user?.first_name + ' ' + user?.last_name
	try {
		const headers = {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		}

		await axios.post(
			`${environment}/api/users/${id + 'a'}/tokens`,
			{
				name: name,
				expires_in: 7200
			},
			{ headers }
		)

		const userResponse = await axios.put(
			`${environment}/api/users/${id + 'a'}`,
			{
				name: name,
				email: user?.email,
				phone_number: user?.phone,
				display_name: name,
				picture: user?.image ? process.env.REACT_APP_PUBLIC_IMAGE_URL + user?.image : process.env.REACT_APP_PUBLIC_IMAGE_URL + user?.first_name[0]?.toLowerCase() + '.png',
				metadata: {
					lat: user?.lat,
					log: user?.log
				}
			},
			{ headers }
		)
		return userResponse
	} catch (error) {
		console.log('Error:', error)
	}
}

export const connectTradeProduct = async (full_name: any, email: any, phone_number: any, topic: any, tradeWith: any, more_info: any, user_email: any, title: any, seller_name: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/connect_trade_product`, { full_name, email, phone_number, topic, tradeWith, more_info, user_email, title, seller_name }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const connectGiveAwayProduct = async (full_name: any, email: any, phone_number: any, interested_in: any, more_info: any, user_email: any, subject: any, seller_name: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/connect_giveaway_product`, { full_name, email, phone_number, interested_in, more_info, user_email, subject, seller_name }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const contactWithUs = async (full_name: any, email: any, phone_number: any, topic: any, message: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/contact_us`, { full_name, email, phone_number, topic, message }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response;
}

export const shareModelApi = async (post_id: any, product_id: any, event_id: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	if (token) {
		await axios
			.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/share_post`, { post_id: post_id ? post_id : undefined, product_id: product_id ? product_id : undefined, event_id: event_id ? event_id : undefined }, config)
			.then((res) => {
				response = res?.data
			})
			.catch((error) => {
				console.error(error)
			})
	}

	return response
}

export const addUserProfileLike = async (f_id: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/like_user`, { f_id }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const removeUserProfileLike = async (f_id: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/remove_like_user`, { f_id }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const viewAllProdileLikeUsers = async () => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/view_all_liked_users`, {}, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

//dislike user profile
export const addUserProfileDisike = async (f_id: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/dislike_user`, { f_id }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const removeUserProfileDislike = async (f_id: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/remove_dislike_user`, { f_id }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const viewAllProdileDislikeUsers = async () => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/view_all_disliked_users`, {}, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const readAllNotifications = async () => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/mark_all_read_notification`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const readSingleNotifications = async (id: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/read_notification?id=${id}`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const getUserPrivacySetting = async () => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/get_user_privacy_setting`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const updateUserPrivacySetting = async (display_phone: any, display_email: any, display_dob: any, display_location: any, display_profile: any, display_dob_full_format: any) => {
	let response: any = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/privacy_setting`, { display_phone, display_email, display_dob, display_location, display_profile, display_dob_full_format }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const orderReport = async (order_id: any, reason: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/add_order_report`, { order_id, reason }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const connectToStripe = async () => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/checkout/connect_to_stripe`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const retriveUserAccount = async (id: any) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/checkout/user_account`, { id }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const removeConnectedAccount = async () => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/checkout/remove_connected_account`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const completePayment: any = async (delivery_charges, service_charges, total, products, payment_method, amount, product_name, user_id, card_number, exp_year, exp_month, cvc) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(
			`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/checkout/complete_payment/pay`,
			{ delivery_charges: delivery_charges, service_charges: service_charges, total: total, products: products, payment_method, amount, product_name, user_id, card_number, exp_year, exp_month, cvc },
			config
		)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const makePaymentInitialze: any = async (paymentToken, sellersAndProducts, payment_method, total) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/checkout/payment_stripe`, { products: sellersAndProducts, token: paymentToken, payment_method, total, delivery_charges: 0, service_charges: 0 }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}


export const addCard: any = async (paymentMethodId) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}/user/checkout/add_card`, { paymentMethodId: paymentMethodId }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const getCards: any = async () => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.get(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}/user/checkout/my_cards`, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const setCardAsDefault: any = async (paymentMethodId) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.put(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}/user/checkout/change_default_payment`, { paymentMethodId: paymentMethodId }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}

export const updateUserPassword: any = async (password, id) => {
	let response = []
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')

	const config = {
		headers: { authorization: `bearer ${token}` }
	}
	await axios
		.post(`${process.env.REACT_APP_PUBLIC_BACKEND_HOST}user/update_password/${id}`, { password }, config)
		.then((res) => {
			response = res?.data
		})
		.catch((error) => {
			console.error(error)
		})
	return response
}