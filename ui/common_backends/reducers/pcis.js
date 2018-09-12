import { notification } from 'antd'
import _ from 'lodash'

import {
    PCIS_LOAD_MASTER_REGION_SUCCESS,
    PCIS_LOAD_MASTER_AREA_SUCCESS,
    PCIS_LOAD_MASTER_TEAM_SUCCESS,
    PCIS_LOAD_MASTER_EMPLOYEE_SUCCESS,

    PCISCRM_LOAD_LEADTOPUP_DASHBOARD_SUCCESS,
    PCISCRM_LOAD_LEADTOPUP_SUMMARY_SUCCESS,

    PCISCRM_LOAD_ACTIONNOTE_LEADTOPUP_SUCCESS,
    PCISCRM_CREATE_ACTIONNOTE_LEADTOPUP_SUCCESS,

    PCISCRM_LOAD_MASTER_RESPONSE_SUCCESS,
    PCISCRM_LOAD_MASTER_ACTION_SUCCESS,
    PCISCRM_LOAD_LEADTOPUP_DASHBOARD_REQUEST

} from '../constants/actionType'

const initialGridData = []

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

export const PCISCRM_LEADTOPUP_DASHBOARD = (state = initialGridData, action) => {
    switch (action.type) {
        case PCISCRM_LOAD_LEADTOPUP_DASHBOARD_REQUEST:
            return []
        case PCISCRM_LOAD_LEADTOPUP_DASHBOARD_SUCCESS:
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