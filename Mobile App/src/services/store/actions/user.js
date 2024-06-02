import {LOG_IN_OR_LOG_OUT, USER_DATA, CART_DATA, PRODUCT_SELL_DATA, CATEGORY_DATA, CEHMICAL_DATA, TOKEN, DISABLE_REASON, LOG_OUT, REMOVE_CART_DATA, EMPTY_CART_DATA, LINKING, CHAT_TOKEN, CHANGE_CARD, REMOVE_CART_ITEM, NOTI_COUNT} from '../actionTypes'

export const storeLogInOrLogOut = (data) => {
    return {
        type: LOG_IN_OR_LOG_OUT,
        payload: data
    }
}
export const changeCardHandeler = (data) => {
    return {
        type: CHANGE_CARD,
        payload: data
    }
}
export const storeUserData = (data) => {
    return {
        type: USER_DATA,
        payload: data
    }
}
export const storeNotification = (data) => {
    return {
        type: NOTI_COUNT,
        payload: data
    }
}
export const storeCartData = (data) => {
    return {
        type: CART_DATA,
        payload: data
    }
}

export const storeCategoryData = (data) => {
    return {
        type: CATEGORY_DATA,
        payload: data
    }
}

export const storeCehmicalData = (data) => {
    return {
        type: CEHMICAL_DATA,
        payload: data
    }
}

export const storeProductData = (data) => {
    return {
        type: PRODUCT_SELL_DATA,
        payload: data
    }
}

export const removeCartData = (data) => {
    return {
        type: REMOVE_CART_DATA,
        payload: data
    }
}
export const removeCartItem = (data) => {
    return {
        type: REMOVE_CART_ITEM,
        payload: data
    }
}
export const emptyCartData = () => {
    return {
        type: EMPTY_CART_DATA
    }
}
export const storeToken = (data) => {
    return {
        type: TOKEN,
        payload: data
    }
}

export const storeLinkUrl = (data) => {
    return {
        type: LINKING,
        payload: data
    }
}

export const storeChatToken = (data) => {
    return {
        type: CHAT_TOKEN,
        payload: data
    }
}
export const storeDisableData = (data) => {
    return {
        type: DISABLE_REASON,
        payload: data
    }
}
