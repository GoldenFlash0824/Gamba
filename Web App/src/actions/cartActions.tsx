import * as types from './types'

export const addItemInCart = (payload: any) => {
	return {
		type: types.ADD_ITEM_IN_CART,
		value: payload
	}
}

export const addDirectItemInCart = (payload: any) => {
	return {
		type: types.ADD_DIRECT_ITEM_IN_CART,
		value: payload
	}
}

export const removeFromCart = (payload: any) => {
	// debugger
	return {
		type: types.REMOVE_ITEM_IN_CART,
		value: payload
	}
}

export const clearCart = (payload: any) => {
	return {
		type: types.CLEAR_CART,
		value: payload
	}
}
export const incrementItem = (payload: any) => {
	return {
		type: types.INCREMENT_ITEM,
		value: payload
	}
}
export const decrementItem = (payload: any) => {
	return {
		type: types.DECREMENT_ITEM,
		value: payload
	}
}
