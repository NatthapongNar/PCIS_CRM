
import {
    LOAD_DOCUMENTSCAN_SUCCESS,
    LOAD_MISSINGDOC_SUCCESS,
    LOAD_MASTER_RETURNCODE_SUCCESS

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

export const DOCUMENTSCAN_RETURNCODE = (state = initialResponse, action) => {
    switch (action.type) {
        case LOAD_MASTER_RETURNCODE_SUCCESS:
            return action.payload
            break;
        default:
            return state
            break;
    }
}