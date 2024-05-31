import * as types from '../actions/types'

interface Event {
    event: {}
}

const initialState: Event = {
    event: {}
}

export default function EventReducer(state = initialState, action: any) {
    switch (action.type) {
        default:
            return state
    }
}