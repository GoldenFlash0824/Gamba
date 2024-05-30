
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
			if (index > -1) {
				return {
					...state,
					products: state.products.map((product, idx) =>
						idx === index ? { ...product, quantity: product.quantity + action.value.quantity } : product
					)
				}
			} else {
				return {
					...state,
					products: [...state.products, { ...action.value.content, quantity: action.value.quantity }]
				};
			}
		}
		case types.ADD_DIRECT_ITEM_IN_CART: {
			const index = state.products.findIndex((product) => product.id === action.value.id);

			if (index > -1) {
				return {
					...state,
					products: state.products.map((product, i) =>
						i === index ? { ...product, quantity: product.quantity + 1 } : product
					),
				};
			} else {
				return {
					...state,
					products: [...state.products, action.value],
				};
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
			return {
				...state,
				products: state.products.map((product) =>
					action.value.id === product.id
						? { ...product, quantity: action.value.quantity }
						: product
				)
			}
		case types.DECREMENT_ITEM:
			return {
				...state,
				products: state.products.map((product) =>
					action.value.id === product.id
						? { ...product, quantity: action.value.quantity }
						: product
				)
			}

		default:
			return state
	}
}
