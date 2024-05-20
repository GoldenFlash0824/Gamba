import * as types from '../actions/types'

const initialState = {
	isDarkTheme: false,
	isLoading: false,
	auth_token: null,
	userId: null,
	selectedTab: 'products',
	selectedCategory: 'product',
	commentOpen: false,
	organicProducts: false,
	currentRoute: '',
	randerGambaNetworkListToggle: null,
	favProduct: [],
	isCartEdit: false,
	countComment: 0,
	userDetails: {},
	postTitle: '',
	topSearch: ''
}

export default function authReducer(state = initialState, action: any) {
	switch (action.type) {
		case types.SWITCH_THEME: {
			return {
				...state,
				isDarkTheme: action.value
			}
		}
		case types.IS_LOADING:
			return {
				...state,
				isLoading: action.value
			}
		case types.RANDER_GAMBA_NETWORKLIST:
			if (state.randerGambaNetworkListToggle === true && action.value === true) {
				action.value = false
			} else if (state.randerGambaNetworkListToggle === false && action.value === false) {
				action.value = true
			}
			return {
				...state,
				randerGambaNetworkListToggle: action.value
			}
		case types.AUTH_TOKEN:
			return {
				...state,
				auth_token: action.value
			}
		case types.SELECTED_TAB:
			return {
				...state,
				selectedTab: action.value
			}
		case types.SELECTED_CATEGORY:
			return {
				...state,
				selectedCategory: action.value
			}
		case types.USER_ID:
			return {
				...state,
				userId: action.value
			}

		case types.STORE_ROUTE:
			return {
				...state,
				currentRoute: action.value
			}
		case types.COMMENT_OPEN:
			return {
				...state,
				commentOpen: action.value
			}
		case types.ORGANIC_PRODUCTS:
			return {
				...state,
				organicProducts: action.value
			}
		case types.ADD_FAV_PRODUCT:
			if (action.value) {
				return {
					...state,
					favProduct: [action.value]
				}
			} else {
				return {
					...state,
					favProduct: []
				}
			}

		case types.EDIT_CART:
			return {
				...state,
				isCartEdit: action.value
			}
		case types.COMMENTS_COUNT:
			return {
				...state,
				countComment: action.value
			}
		case types.USER_DETAILS:
			return {
				...state,
				userDetails: action.value
			}

		case types.POST_MESSAGE:
			return {
				...state,
				postTitle: action.value
			}
		case types.SEARCH_TEXT:
			return {
				...state,
				topSearch: action.value
			}
		default:
			return state
	}
}
