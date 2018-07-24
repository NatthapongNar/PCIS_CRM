
import {
    LOAD_DOCUMENTSCAN_SUCCESS,
    LOAD_MISSINGDOC_SUCCESS,
    LOAD_MASTER_RETURNCODE_SUCCESS,
    LOAD_DOCUMENTSCAN_RETURNCODE_SUCCESS,
    LOAD_DOCUMENTSCAN_CREATE_RETURNCODE_SUCCESS,
    LOAD_DOCUMENTSCAN_CREATE_MESSAGE_SUCCESS,
    LOAD_DOCUMENTSCAN_GRID_MESSAGE_SUCCESS

} from '../constants/actionType'

const initialGridData = []
const initialResponse = [{ Data: [], Status: false, Msg: [] }]

export const DOCUMENTSCAN_DASHBOARD = (state = initialGridData, action) => {
    switch (action.type) {
        case LOAD_DOCUMENTSCAN_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const DOCUMENTSCAN_MISSINGDOC = (state = initialResponse, action) => {
    switch (action.type) {
        case LOAD_MISSINGDOC_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const DOCUMENTSCAN_RETURNCODE = (state = initialResponse, action) => {
    switch (action.type) {
        case LOAD_MASTER_RETURNCODE_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const DOCUMENTSCAN_CREATE_RETURNCODE = (state = initialResponse, action) => {
    switch (action.type) {
        case LOAD_DOCUMENTSCAN_CREATE_RETURNCODE_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const DOCUMENTSCAN_CREATE_MESSAGE = (state = initialResponse, action) => {
    switch (action.type) {
        case LOAD_DOCUMENTSCAN_CREATE_MESSAGE_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const DOCUMENTSCAN_GRID_MESSAGE = (state = initialResponse, action) => {
    switch (action.type) {
        case LOAD_DOCUMENTSCAN_GRID_MESSAGE_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const DOCUMENTSCAN_RETURNCODE_VERIFY = (state = initialResponse, action) => {
    switch (action.type) {
        case LOAD_DOCUMENTSCAN_RETURNCODE_SUCCESS:
            return action.payload
        default:
            return state
    }
}