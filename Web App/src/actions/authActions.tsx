import * as types from './types'

interface SwitchThemeProps {
	payload: boolean
}

export const switchTheme = (payload: any) => {
	return {
		type: types.SWITCH_THEME,
		value: payload
	}
}
export const setCommentOpen = (payload: any) => {
	return {
		type: types.COMMENT_OPEN,
		value: payload
	}
}

export const setIsLoading = (payload: any) => {
	return {
		type: types.IS_LOADING,
		value: payload
	}
}

export const randerGambaNetworkList = (payload: any) => {
	return {
		type: types.RANDER_GAMBA_NETWORKLIST,
		value: payload
	}
}

export const setAuthToken = (payload: any) => {
	return {
		type: types.AUTH_TOKEN,
		value: payload
	}
}
export const setSelectedTab = (payload: any) => {
	return {
		type: types.SELECTED_TAB,
		value: payload
	}
}
export const setSelectedCategory = (payload: any) => {
	return {
		type: types.SELECTED_CATEGORY,
		value: payload
	}
}
export const setUserId = (payload: any) => {
	return {
		type: types.USER_ID,
		value: payload
	}
}
export const setOrganicProducts = (payload: any) => {
	return {
		type: types.ORGANIC_PRODUCTS,
		value: payload
	}
}

export const saveRoute = (payload: any) => {
	return {
		type: types.STORE_ROUTE,
		value: payload
	}
}

export const addFav = (payload: any) => {
	return {
		type: types.ADD_FAV_PRODUCT,
		value: payload
	}
}

export const editCartBeforeCheckout = (payload: any) => {
	return {
		type: types.EDIT_CART,
		value: payload
	}
}

export const commentCount = (payload: any) => {
	return {
		type: types.COMMENTS_COUNT,
		value: payload
	}
}

export const saveUser = (payload: any) => {
	return {
		type: types.USER_DETAILS,
		value: payload
	}
}

export const savePostMessage = (payload: any) => {
	return {
		type: types.POST_MESSAGE,
		value: payload
	}
}

export const saveSearchText = (payload: any) => {
	return {
		type: types.SEARCH_TEXT,
		value: payload
	}
}
