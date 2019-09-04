import { notification } from 'antd'
import _ from 'lodash'

import {
    PCIS_LOAD_MASTER_REGION_SUCCESS,
    PCIS_LOAD_MASTER_AREA_SUCCESS,
    PCIS_LOAD_MASTER_TEAM_SUCCESS,
    PCIS_LOAD_MASTER_EMPLOYEE_SUCCESS,

    PCISCRM_LOAD_LEADTOPUP_HEADER_SUCCESS,

    PCISCRM_LOAD_LOT_LEADTOPUP_SUMMARY_REQUEST,
    PCISCRM_LOAD_LOT_LEADTOPUP_SUMMARY_SUCCESS,

    PCISCRM_LOAD_LEADTOPUP_DASHBOARD_REQUEST,
    PCISCRM_LOAD_LEADTOPUP_DASHBOARD_SUCCESS,

    PCISCRM_LOAD_LEADTOPUP_SUMMARY_SUCCESS,

    PCISCRM_LOAD_ACTIONNOTE_LEADTOPUP_SUCCESS,
    PCISCRM_CREATE_ACTIONNOTE_LEADTOPUP_SUCCESS,

    PCISCRM_LOAD_MASTER_RESPONSE_SUCCESS,
    PCISCRM_LOAD_MASTER_ACTION_SUCCESS,

    // REFER LEAD
    PCISCRM_LOAD_LEADCHANNEL_AUTHEN_USER_REQUEST,
    PCISCRM_LOAD_LEADCHANNEL_AUTHEN_USER_SUCCESS,

    PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_REQUEST,
    PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUCCESS,

    PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_REQUEST,
    PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_SUCCESS,

    PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_SUB_REQUEST,
    PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_SUB_SUCCESS,

    PCISCRM_LEADCHANNEL_PRODUCT_TRANSFER_REQUEST,
    PCISCRM_LEADCHANNEL_PRODUCT_TRANSFER_SUCCESS,

    // ACTION NOTE V1
    PCISCRM_LOAD_LEADCHANNEL_ACTIONNOTE_SUCCESS,
    PCISCRM_CREATE_LEADCHANNEL_ACTIONNOTE_SUCCESS,
    // ACTION NOTE V2
    PCISCRM_LOAD_LEADCHANNEL_ACTIONNOTE_V2_SUCCESS,
    PCISCRM_CREATE_LEADCHANNEL_ACTIONNOTE_V2_SUCCESS,

    PCISCRM_UPDATE_LEADCHANNEL_CUSTPROFILE_SUCCESS,
    PCISCRM_HISTORY_LEADCHANNEL_CUSTPROFILE_SUCCESS,

    PCISCRM_MASTER_LEADCHANNEL_RANK_SCORE_SUCCESS,
    PCISCRM_MASTER_LEADCHANNEL_SOURCE_CHANNEL_SUCCESS,
    PCISCRM_MASTER_LEADCHANNEL_SUBSOURCE_CHANNEL_SUCCESS,
    PCISCRM_LOAD_MASTER_PRODUCT_GROUP_SUCCESS,

    PCISCRM_LEADCHANNEL_FIND_BRANCH_IN_AREA_REQUEST,
    PCISCRM_LEADCHANNEL_FIND_BRANCH_IN_AREA_SUCCESS,

    PCISCRM_LEADCHANNEL_FIND_EMPLOYEE_IN_AREA_REQUEST,
    PCISCRM_LEADCHANNEL_FIND_EMPLOYEE_IN_AREA_SUCCESS,

    PCISCRM_LEADCHANNEL_ASSIGNMENT_APPL_OWNER_REQUEST,
    PCISCRM_LEADCHANNEL_ASSIGNMENT_APPL_OWNER_SUCCESS,

    // NEW LEAD TOP UP
    PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_REQUEST,
    PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUCCESS,

    PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUMMARY_REQUEST,
    PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUMMARY_SUCCESS,
    PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUBSUMMARY_REQUEST,
    PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUBSUMMARY_SUCCESS,

    PCISCRM_CREATE_PROHIBITE_CUSTOMER_SUCCESS,
    PCISCRM_LOAD_MASTER_LOT_SUCCESS
   

} from '../constants/actionType'

const initialGridData = []
const initialJSONData = { Data: [], Status: false, Msg: '' }
const initialRespData = { Data: [], Status: false, Loading: true, Msg: '' }

export const PCIS_MASTER_REGION = (state = initialGridData, action) => {
    switch (action.type) {
        case PCIS_LOAD_MASTER_REGION_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCIS_MASTER_AREA = (state = initialGridData, action) => {
    switch (action.type) {
        case PCIS_LOAD_MASTER_AREA_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCIS_MASTER_TEAM = (state = initialGridData, action) => {
    switch (action.type) {
        case PCIS_LOAD_MASTER_TEAM_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCIS_MASTER_EMPLOYEE = (state = initialGridData, action) => {
    switch (action.type) {
        case PCIS_LOAD_MASTER_EMPLOYEE_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_MASTER_RESPONSE = (state = initialGridData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_MASTER_RESPONSE_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_MASTER_ACTION = (state = initialGridData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_MASTER_ACTION_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_LEADTOPUP_HEADER = (state = initialGridData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_LEADTOPUP_HEADER_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_LOT_LEADTOPUP_DASHBOARD = (state = initialJSONData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_LOT_LEADTOPUP_SUMMARY_REQUEST:
            return action.payload
        case PCISCRM_LOAD_LOT_LEADTOPUP_SUMMARY_SUCCESS:
            let e = action.payload
            if(e.Status && e.Data.length <= 0) {
                notification.error({ message: 'แจ้งเตือนจากระบบ', description: 'ขออภัย! ไม่พบข้อมูลของท่านในระบบ' })
            }
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_LEADTOPUP_DASHBOARD = (state = initialJSONData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_LEADTOPUP_DASHBOARD_REQUEST:
            return action.payload
        case PCISCRM_LOAD_LEADTOPUP_DASHBOARD_SUCCESS:
            let e = action.payload
            if(e.Status && e.Data.length <= 0) {
                notification.error({ message: 'แจ้งเตือนจากระบบ', description: 'ขออภัย! ไม่พบข้อมูลของท่านในระบบ' })
            }
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_LEADTOPUP_SUMMARY = (state = initialGridData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_LEADTOPUP_SUMMARY_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_LEADTOPUP_LOAD_ACTIONNOTE = (state = initialGridData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_ACTIONNOTE_LEADTOPUP_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_LEADTOPUP_CREATE_ACTIONNOTE = (state = initialGridData, action) => {
    switch (action.type) {
        case PCISCRM_CREATE_ACTIONNOTE_LEADTOPUP_SUCCESS:
            if(!_.isEmpty(action.payload)) {
                notification.success({ message: 'แจ้งเตือนจากระบบ', description: 'ระบบตรวจสอบและบันทึกข้อมูลสำเร็จ' })
            }            
            return action.payload
        default:
            return state
    }
}

// REFER LEAD REDUCER

export const PCISCRM_USER_AUTHEN_PROFILE = (state = initialRespData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_LEADCHANNEL_AUTHEN_USER_REQUEST:
            return action.payload
        case PCISCRM_LOAD_LEADCHANNEL_AUTHEN_USER_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_MASTER_LEADCHANNEL_RANK_SCORE = (state = initialGridData, action) => {
    switch (action.type) {
        case PCISCRM_MASTER_LEADCHANNEL_RANK_SCORE_SUCCESS:                   
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_MASTER_LEADCHANNEL_SOURCE_CHANNEL = (state = initialGridData, action) => {
    switch (action.type) {
        case PCISCRM_MASTER_LEADCHANNEL_SOURCE_CHANNEL_SUCCESS:                   
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_MASTER_LEADCHANNEL_SUBSOURCE_CHANNEL = (state = initialGridData, action) => {
    switch (action.type) {
        case PCISCRM_MASTER_LEADCHANNEL_SUBSOURCE_CHANNEL_SUCCESS:                   
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_LEADCHANNEL_DASHBOARD = (state = initialRespData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_REQUEST:
        case PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_LEADCHANNEL_DASHBOARD_SUMMARY = (state = initialRespData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_REQUEST:
            return action.payload
        case PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_LEADCHANNEL_DASHBOARD_SUMMARY_SUB = (state = initialRespData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_SUB_REQUEST:
            return action.payload
        case PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_SUB_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_LEADCHANNEL_PRODUCT_TRANSFER = (state = initialRespData, action) => {
    switch (action.type) {
        case PCISCRM_LEADCHANNEL_PRODUCT_TRANSFER_REQUEST:
            return action.payload
        case PCISCRM_LEADCHANNEL_PRODUCT_TRANSFER_SUCCESS:
            return action.payload
        default:
            return state
    }
}

// ACTION NOTE V1
export const PCISCRM_REFER_LEADCHANNEL_LOAD_ACTIONNOTE = (state = initialGridData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_LEADCHANNEL_ACTIONNOTE_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_REFER_LEADCHANNEL_CREATE_ACTIONNOTE = (state = initialGridData, action) => {
    switch (action.type) {
        case PCISCRM_CREATE_LEADCHANNEL_ACTIONNOTE_SUCCESS:
            if(!_.isEmpty(action.payload)) {
                notification.success({ message: 'แจ้งเตือนจากระบบ', description: 'ระบบตรวจสอบและบันทึกข้อมูลสำเร็จ' })
            }            
            return action.payload
        default:
            return state
    }
}

// ACTION NOTE V2
export const PCISCRM_REFER_LEADCHANNEL_LOAD_ACTIONNOTEV2 = (state = initialGridData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_LEADCHANNEL_ACTIONNOTE_V2_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_REFER_LEADCHANNEL_CREATE_ACTIONNOTEV2 = (state = initialGridData, action) => {
    switch (action.type) {
        case PCISCRM_CREATE_LEADCHANNEL_ACTIONNOTE_V2_SUCCESS:
            if(!_.isEmpty(action.payload)) {
                notification.success({ message: 'แจ้งเตือนจากระบบ', description: 'ระบบตรวจสอบและบันทึกข้อมูลสำเร็จ' })
            }            
            return action.payload
        default:
            return state
    }
}
 
export const PCISCRM_REFER_LEADCHANNEL_UPDATE_CUSTPROFILE = (state = initialGridData, action) => {
    switch (action.type) {
        case PCISCRM_UPDATE_LEADCHANNEL_CUSTPROFILE_SUCCESS:
            if(!_.isEmpty(action.payload)) {
                notification.success({ message: 'แจ้งเตือนจากระบบ', description: 'ระบบตรวจสอบและบันทึกข้อมูลสำเร็จ' })
            }            
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_REFER_LEADCHANNEL_HISTORY_CUSTPROFILE = (state = initialGridData, action) => {
    switch (action.type) {
        case PCISCRM_HISTORY_LEADCHANNEL_CUSTPROFILE_SUCCESS:                   
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_MASTER_PRODUCT_GROUP = (state = initialGridData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_MASTER_PRODUCT_GROUP_SUCCESS:                   
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_FIND_BRANCH_IN_CUSTAREA = (state = initialRespData, action) => {
    switch (action.type) {
        case PCISCRM_LEADCHANNEL_FIND_BRANCH_IN_AREA_REQUEST:
            return action.payload
        case PCISCRM_LEADCHANNEL_FIND_BRANCH_IN_AREA_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_FIND_EMPLOYEE_IN_CUSTAREA = (state = initialRespData, action) => {
    switch (action.type) {
        case PCISCRM_LEADCHANNEL_FIND_EMPLOYEE_IN_AREA_REQUEST:
            return action.payload
        case PCISCRM_LEADCHANNEL_FIND_EMPLOYEE_IN_AREA_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_LEADCHANNEL_ASSIGNMENT_APPL_NEWOWNER = (state = initialRespData, action) => {
    switch (action.type) {
        case PCISCRM_LEADCHANNEL_ASSIGNMENT_APPL_OWNER_REQUEST:
            return action.payload
        case PCISCRM_LEADCHANNEL_ASSIGNMENT_APPL_OWNER_SUCCESS:
            if(!_.isEmpty(action.payload)) {
                notification.success({ message: 'แจ้งเตือนจากระบบ', description: 'ระบบเปลี่ยนข้อมูลผู้ดูแลสำเร็จ' })
            }      
            return action.payload
        default:
            return state
    }
}

// NEW LEAD TOP UP
export const PCISCRM_NEWLEAD_TOPUP_DASHBOARD = (state = initialRespData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_REQUEST:
            return action.payload
        case PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_NEWLEAD_TOPUP_DASHBOARD_SUMMARY = (state = initialRespData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUMMARY_REQUEST:
            return action.payload
        case PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUMMARY_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_NEWLEAD_TOPUP_DASHBOARD_SUBSUMMARY = (state = initialRespData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUBSUMMARY_REQUEST:
            return action.payload
        case PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUBSUMMARY_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_CREATE_PROHIBITE_CUSTOMER = (state = initialRespData, action) => {
    switch (action.type) {
        case PCISCRM_CREATE_PROHIBITE_CUSTOMER_SUCCESS:
            if(!_.isEmpty(action.payload)) {
                notification.success({ message: 'แจ้งเตือนจากระบบ', description: 'ระบบตรวจสอบและบันทึกข้อมูลสำเร็จ' })
            }      
            return action.payload
        default:
            return state
    }
}

export const PCISCRM_MASTER_LOT_LIST = (state = initialGridData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_MASTER_LOT_SUCCESS:                   
            return action.payload
        default:
            return state
    }
}