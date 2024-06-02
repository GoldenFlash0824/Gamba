import * as types from '../actions/types'

const initialState: any = {
    event: {}
}

export default function eventReducer(state = initialState, action: any) {
    switch (action.type) {
        case types.ADD_EVENT:
            return {
                ...state,
                event: action.value
            }
        case types.CLEAR_EVENT:
            return {
                ...state,
                event: {}
            }
        default:
            return state
    }
}