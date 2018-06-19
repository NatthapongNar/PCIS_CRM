
import {
    LOAD_DOCUMENTSCAN_REQUEST,
    LOAD_DOCUMENTSCAN_SUCCESS,
    LOAD_DOCUMENTSCAN_FAILURE,

    LOAD_MISSINGDOC_REQUEST,
    LOAD_MISSINGDOC_SUCCESS,
    LOAD_MISSINGDOC_FAILURE
} from '../constants/actionType'

const initialGridData = []
const initialResponse = [{ Data: [], Status: false, Msg: [] }]

export const DOCUMENTSCAN_DASHBOARD = (state = initialGridData, action) => {
    switch (action.type) {
        case LOAD_DOCUMENTSCAN_SUCCESS:
            return action.payload
            break;
        default:
            return state
            break;
    }
}

export const DOCUMENTSCAN_MISSINGDOC = (state = initialResponse, action) => {
    switch (action.type) {
        case LOAD_MISSINGDOC_SUCCESS:
            return action.payload
            break;
        default:
            return state
            break;
    }
}
