import _ from 'lodash'
import { notification } from 'antd'

import 
{
    LEAD_MASTER_REFERRAL_REASON_SUCCESS,
    LEAD_MASTER_CUSTOMER_PREFIX_SUCCESS,
    LEAD_MASTER_CUSTOMER_GROUP_SUCCESS,
    LEAD_MASTER_CUSTOMER_TYPE_SUCCESS,
    LEAD_MASTER_CHANNEL_GROUP_SUCCESS,
    LEAD_MASTER_CHANNEL_SOURCE_SUCCESS,
    LEAD_MASTER_PROVINCE_SUCCESS,
    LEAD_MASTER_AMPHOE_SUCCESS,
    LEAD_MASTER_DISTRICT_SUCCESS,

    LEAD_MASTER_CAMPAIGNS_SUCCESS,

    LEAD_DATA_CREATE_CUSTOMER_SUCCESS,
    LEAD_DATA_UPDATE_CUSTOMER_SUCCESS,

    LEAD_ACTION_OVERCONTACT_SLA_SUCCESS

} from '../constants/actionType'


const initialData = []

// LEAD CHANNEL - MASTER DATA
export const LEAD_MASTER_REFERRAL_LIST = (state = initialData, action) => {
    switch (action.type) {
        case LEAD_MASTER_REFERRAL_REASON_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const LEAD_MASTER_CUSTOMER_PREFIX = (state = initialData, action) => {
    switch (action.type) {
        case LEAD_MASTER_CUSTOMER_PREFIX_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const LEAD_MASTER_CUSTOMER_GROUP = (state = initialData, action) => {
    switch (action.type) {
        case LEAD_MASTER_CUSTOMER_GROUP_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const LEAD_MASTER_CUSTOMER_TYPE = (state = initialData, action) => {
    switch (action.type) {
        case LEAD_MASTER_CUSTOMER_TYPE_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const LEAD_MASTER_CHANNEL_GROUP = (state = initialData, action) => {
    switch (action.type) {
        case LEAD_MASTER_CHANNEL_GROUP_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const LEAD_MASTER_CHANNEL_SOURCE = (state = initialData, action) => {
    switch (action.type) {
        case LEAD_MASTER_CHANNEL_SOURCE_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const LEAD_MASTER_PROVINCE = (state = initialData, action) => {
    switch (action.type) {
        case LEAD_MASTER_PROVINCE_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const LEAD_MASTER_AMPHOE = (state = initialData, action) => {
    switch (action.type) {
        case LEAD_MASTER_AMPHOE_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const LEAD_MASTER_DISTRICT = (state = initialData, action) => {
    switch (action.type) {
        case LEAD_MASTER_DISTRICT_SUCCESS:
            return action.payload
        default:
            return state
    }
}

export const LEAD_MASTER_CAMPAIGNS = (state = initialData, action) => {
    switch (action.type) {
        case LEAD_MASTER_CAMPAIGNS_SUCCESS:
            return action.payload
        default:
            return state
    }
}

// LEAD CHAHNNEL - ADD CUSTOMER  & UPDATE
export const LEAD_DATA_CREATE_CUSTOMER = (state = initialData, action) => {
    switch (action.type) {
        case LEAD_DATA_CREATE_CUSTOMER_SUCCESS:
            if(!_.isEmpty(action.payload)) {
                notification.success({ message: 'แจ้งเตือนจากระบบ', description: 'ระบบตรวจสอบและบันทึกข้อมูลสำเร็จ' })
            }            
            return action.payload
        default:
            return state
    }
}
 
export const LEAD_DATA_UPDATE_CUSTOMER = (state = initialData, action) => {
    switch (action.type) {
        case LEAD_DATA_UPDATE_CUSTOMER_SUCCESS:
            if(!_.isEmpty(action.payload)) {
                notification.success({ message: 'แจ้งเตือนจากระบบ', description: 'ระบบอัพเดทดำเนินการเปลี่ยนแปลงข้อมูลสำเร็จ' })
            }            
            return action.payload
        default:
            return state
    }
}

export const LEAD_ACTION_OVERCONTACTSLA = (state = initialData, action) => {
    switch (action.type) {
        case LEAD_ACTION_OVERCONTACT_SLA_SUCCESS:
            if(!_.isEmpty(action.payload)) {
                notification.success({ message: 'แจ้งเตือนจากระบบ', description: 'ระบบตรวจสอบและบันทึกข้อมูลสำเร็จ' })
            }            
            return action.payload
        default:
            return state
    }
}