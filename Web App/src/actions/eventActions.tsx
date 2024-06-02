import * as types from './types'

export const addEvent = (payload: any) => {
    return {
        type: types.ADD_EVENT,
        value: payload
    }
}


export const clearEvent = () => {
    return {
        type: types.CLEAR_EVENT
    }
}