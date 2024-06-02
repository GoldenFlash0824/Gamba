import {LOG_IN_OR_LOG_OUT, USER_DATA, CART_DATA, CATEGORY_DATA, PRODUCT_SELL_DATA, DISABLE_REASON, CEHMICAL_DATA, TOKEN, LOG_OUT, REMOVE_CART_DATA, EMPTY_CART_DATA, LINKING, CHAT_TOKEN, CHANGE_CARD, REMOVE_CART_ITEM, NOTI_COUNT} from '../actionTypes'

const INITIAL_STATE = {
    isLogedIn: false,
    token: null,
    userData: null,
    cartData: [],
    categoryData: [],
    productData: null,
    chemicalData: [],
    linkingUrl: null,
    chatToken: null,
    changeCard: false,
    notiCount: 0,
    disableReason: null
}

const userReducers = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOG_IN_OR_LOG_OUT:
            return {
                ...state,
                isLogedIn: action.payload
            }
        case USER_DATA:
            return {
                ...state,
                userData: action.payload
            }

        case CATEGORY_DATA:
            return {
                ...state,
                categoryData: action.payload
            }

        case CEHMICAL_DATA:
            return {
                ...state,
                chemicalData: action.payload
            }
        case PRODUCT_SELL_DATA:
            return {
                ...state,
                productData: action.payload
            }
        case CART_DATA:
            const _cartData = state.cartData
            const ind = _cartData.findIndex((i) => i.id == action.payload.id)
            ind > -1 ? (_cartData[ind].quantity += action.payload.quantity) : _cartData.push(action.payload)
            return {
                ...state,
                cartData: _cartData
            }
        case REMOVE_CART_DATA:
            const _cartDataR = state.cartData
            for (let i = 0; i < _cartDataR.length; i++) {
                if (_cartDataR[i].id == action.payload.id)
                    if (_cartDataR[i].quantity > 1) {
                        _cartDataR[i].quantity -= 1
                    } else {
                        _cartDataR.splice(i, 1)
                    }
            }
            return {
                ...state,
                cartData: _cartDataR ? _cartDataR : []
            }
        case REMOVE_CART_ITEM:
            const _filterCart = state.cartData.filter((item) => item.id != action.payload.id)
            return {
                ...state,
                cartData: _filterCart
            }
        case EMPTY_CART_DATA:
            return {
                ...state,
                cartData: []
            }
        case NOTI_COUNT:
            return {
                ...state,
                notiCount: action.payload
            }
        case TOKEN:
            return {
                ...state,
                token: action.payload
            }
        case LINKING:
            return {
                ...state,
                linkingUrl: action.payload
            }
        case CHAT_TOKEN:
            return {
                ...state,
                chatToken: action.payload
            }
        case CHANGE_CARD:
            return {
                ...state,
                changeCard: action.payload
            }
        case DISABLE_REASON:
            return {
                ...state,
                disableReason: action.payload
            }

        default:
            return state
    }
}

export default userReducers
