import { notification } from 'antd'
import {
    LOAD_DOCUMENTSCAN_SUCCESS,
    LOAD_MISSINGDOC_SUCCESS,  
    LOAD_DOCUMENTSCAN_RETURNCODE_SUCCESS,
    // LOAD_DOCUMENTSCAN_CREATE_RETURNCODE_SUCCESS,
    // LOAD_DOCUMENTSCAN_CREATE_MESSAGE_SUCCESS,
    // LOAD_DOCUMENTSCAN_GRID_MESSAGE_SUCCESS,
    DOCUMENTSCAN_CREATE_RETURNCODE_SUCCESS,
    DOCUMENTSCAN_CREATE_RETURNCODE_FAILURE,
    DOCUMENTSCAN_LOAD_RETURNCODE_SUCCESS,

    LOAD_MASTER_RETURNCODE_SUCCESS,
    LOAD_MASTER_RETURNREASON_SUCCESS,
    LOAD_MASTER_STATUSCODE_SUCCESS,

    LOAD_BAISC_INFO_SUCCESS,
    LOAD_BORROWER_INFO_SUCCESS

} from '../constants/actionType'

const initialGridData = []
const initialResponse = { Data: [], Status: false, Msg: [] }

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

export const DOCUMENTSCAN_GET_BAISCINFO = (state = initialResponse, action) => {
    switch (action.type) {
        case LOAD_BAISC_INFO_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const DOCUMENTSCAN_GET_BORROWER = (state = initialResponse, action) => {
    switch (action.type) {
        case LOAD_BORROWER_INFO_SUCCESS:
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

export const LOAD_MASTER_RETURNREASON = (state = initialResponse, action) => {
    switch (action.type) {
        case LOAD_MASTER_RETURNREASON_SUCCESS:
            return action.payload            
        default:
            return state
    }
}

// export const DOCUMENTSCAN_CREATE_RETURNCODE = (state = initialResponse, action) => {
//     switch (action.type) {
//         case LOAD_DOCUMENTSCAN_CREATE_RETURNCODE_SUCCESS:
//             return action.payload
//         default:
//             return state
//     }
// }

// export const DOCUMENTSCAN_CREATE_MESSAGE = (state = initialResponse, action) => {
//     switch (action.type) {
//         case LOAD_DOCUMENTSCAN_CREATE_MESSAGE_SUCCESS:
//             return action.payload
//         default:
//             return state
//     }
// }

// export const DOCUMENTSCAN_GRID_MESSAGE = (state = initialResponse, action) => {
//     switch (action.type) {
//         case LOAD_DOCUMENTSCAN_GRID_MESSAGE_SUCCESS:
//             return action.payload
//         default:
//             return state
//     }
// }

export const DOCUMENTSCAN_RETURNCODE_VERIFY = (state = initialResponse, action) => {
    switch (action.type) {
        case LOAD_DOCUMENTSCAN_RETURNCODE_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const LOAD_RETURNCODE_BUNDLE = (state = initialResponse, action) => {
    switch (action.type) {
        case DOCUMENTSCAN_LOAD_RETURNCODE_SUCCESS:
            return action.payload            
        default:
            return state
    }
}

export const CREATE_RETURNCODE_BUNDLE = (state = initialResponse, action) => {
    switch (action.type) {
        case DOCUMENTSCAN_CREATE_RETURNCODE_SUCCESS:
            notification.success({
                message: 'ระบบบันทึกข้อมูลสำเร็จ',
                description: 'ระบบตรวจสอบและบันทึกข้อมูลสำเร็จ',
            })
            return action.payload    
        case DOCUMENTSCAN_CREATE_RETURNCODE_FAILURE:        
            notification.error({
                message: 'ระบบบันทึกข้อมูลไม่สำเร็จ',
                description: 'โปรดตรวจสอบข้อมูลอีกครั้งหรือติดต่อผู้ดูแลระบบ',
            })
        default:
            return state
    }
}

export const LOAD_MASTER_RETURNSTATUS = (state = initialResponse, action) => {
    switch (action.type) {
        case LOAD_MASTER_STATUSCODE_SUCCESS:
            return action.payload            
        default:
            return state
    }
}