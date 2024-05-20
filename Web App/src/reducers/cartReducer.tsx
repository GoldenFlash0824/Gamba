
import * as types from '../actions/types'

interface Cart {
	products: any[]
}

const initialState: Cart = {
	products: []
}

export default function cartReducer(state = initialState, action: any) {
	switch (action.type) {
		
		case types.ADD_ITEM_IN_CART: {
			const index = state.products.findIndex((d) => d.id === action.value.content.id)

			if ( index > -1) {			
				state.products[index].quantity += action.value.quantity
			} else {
				action.value.content.quantity=action.value.quantity
				state.products.push(action.value.content)
			}
			return {
				...state,
				products: state.products
			}
		}
		case types.ADD_DIRECT_ITEM_IN_CART: {
			const index = state.products.findIndex((d) => d.id === action.value.id)

			if ( index > -1) {
				state.products[index].quantity++
			} else {
				state.products.push(action.value)
			}
			return {
				...state,
				products: state.products
			}
		}
		case types.REMOVE_ITEM_IN_CART:
			return {
				...state,
				products: state.products.filter((d) => action.value !== d.id)
			}
		case types.CLEAR_CART:
			return {
				...state,
				products: []
			}
		case types.INCREMENT_ITEM:
			state.products.map((d) => (action.value.id === d.id ? (d.quantity = action.value.quantity) : ''))
			return {
				...state,
				products: state.products
			}
		case types.DECREMENT_ITEM:
			state.products.map((d) => (action.value.id === d.id ? (d.quantity = action.value.quantity) : ''))
			return {
				...state,
				products: state.products
			}
		default:
			return state
	}
}
