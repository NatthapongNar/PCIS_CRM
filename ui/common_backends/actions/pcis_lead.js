import { CALL_API } from 'redux-api-middleware'
import _ from 'lodash'

const json_header = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

import {
    LEAD_MASTER_CUSTOMER_PREFIX_URL,

    LEAD_MASTER_CUSTOMER_GROUP_URL,
    LEAD_MASTER_CUSTOMER_TYPE_URL,

    LEAD_MASTER_CHANNEL_GROUP_URL,
    LEAD_MASTER_CHANNEL_SOURCE_URL,

    LEAD_MASTER_PROVINCE_URL,
    LEAD_MASTER_AMPHOE_URL,
    LEAD_MASTER_DISTRICT_URL,

    LEAD_DATA_CREATE_CUSTOMER_URL,
    
    // SCRIPT MIGRATE
    PCISCRM_LEADTCHANNEL_DASHBOARD_URL,
    PCISCRM_LEADTCHANNEL_DASHBOARD_SUMMARY_URL,
    PCISCRM_LEADTCHANNEL_DASHBOARD_SUMMARY_SUB_URL,

} from '../constants/endpoints'

import {
    LEAD_MASTER_CUSTOMER_PREFIX_REQUEST, LEAD_MASTER_CUSTOMER_PREFIX_SUCCESS, LEAD_MASTER_CUSTOMER_PREFIX_FAILURE,
    LEAD_MASTER_CUSTOMER_GROUP_REQUEST, LEAD_MASTER_CUSTOMER_GROUP_SUCCESS, LEAD_MASTER_CUSTOMER_GROUP_FAILURE,
    LEAD_MASTER_CUSTOMER_TYPE_REQUEST, LEAD_MASTER_CUSTOMER_TYPE_SUCCESS, LEAD_MASTER_CUSTOMER_TYPE_FAILURE,
    LEAD_MASTER_CHANNEL_GROUP_REQUEST, LEAD_MASTER_CHANNEL_GROUP_SUCCESS, LEAD_MASTER_CHANNEL_GROUP_FAILURE,
    LEAD_MASTER_CHANNEL_SOURCE_REQUEST, LEAD_MASTER_CHANNEL_SOURCE_SUCCESS, LEAD_MASTER_CHANNEL_SOURCE_FAILURE,
    LEAD_MASTER_PROVINCE_REQUEST, LEAD_MASTER_PROVINCE_SUCCESS, LEAD_MASTER_PROVINCE_FAILURE,
    LEAD_MASTER_AMPHOE_REQUEST, LEAD_MASTER_AMPHOE_SUCCESS, LEAD_MASTER_AMPHOE_FAILURE,
    LEAD_MASTER_DISTRICT_REQUEST, LEAD_MASTER_DISTRICT_SUCCESS, LEAD_MASTER_DISTRICT_FAILURE,

    LEAD_DATA_CREATE_CUSTOMER_REQUEST, LEAD_DATA_CREATE_CUSTOMER_SUCCESS, LEAD_DATA_CREATE_CUSTOMER_FAILURE,

    // SCRIPT MIGRATE
    PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_REQUEST, PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUCCESS, PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_FAILURE,
    PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_REQUEST, PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_SUCCESS, PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_FAILURE,
    PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_SUB_REQUEST, PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_SUB_SUCCESS,PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_SUB_FAILURE,

} from '../constants/actionType'


// NEW LEAD MANAGEMENT
export const getLeadMasterCustomerPrefix = () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${LEAD_MASTER_CUSTOMER_PREFIX_URL}`,
            method: 'GET',
            types: [
                LEAD_MASTER_CUSTOMER_PREFIX_REQUEST,
                {
                    type: LEAD_MASTER_CUSTOMER_PREFIX_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                LEAD_MASTER_CUSTOMER_PREFIX_FAILURE
            ]
        }
    })
})

export const getLeadMasterCustomerGroup = () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${LEAD_MASTER_CUSTOMER_GROUP_URL}`,
            method: 'GET',
            types: [
                LEAD_MASTER_CUSTOMER_GROUP_REQUEST,
                {
                    type: LEAD_MASTER_CUSTOMER_GROUP_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                LEAD_MASTER_CUSTOMER_GROUP_FAILURE
            ]
        }
    })
})

export const getLeadMasterCustomerType = () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${LEAD_MASTER_CUSTOMER_TYPE_URL}`,
            method: 'GET',
            types: [
                LEAD_MASTER_CUSTOMER_TYPE_REQUEST,
                {
                    type: LEAD_MASTER_CUSTOMER_TYPE_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                LEAD_MASTER_CUSTOMER_TYPE_FAILURE
            ]
        }
    })
})

// CHANNEL GROUP AND CHANNEL SOURCE
export const getLeadMasterChannelGroup = () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${LEAD_MASTER_CHANNEL_GROUP_URL}`,
            method: 'GET',
            types: [
                LEAD_MASTER_CHANNEL_GROUP_REQUEST,
                {
                    type: LEAD_MASTER_CHANNEL_GROUP_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                LEAD_MASTER_CHANNEL_GROUP_FAILURE
            ]
        }
    })
})

export const getLeadMasterChannelSource = () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${LEAD_MASTER_CHANNEL_SOURCE_URL}`,
            method: 'GET',
            types: [
                LEAD_MASTER_CHANNEL_SOURCE_REQUEST,
                {
                    type: LEAD_MASTER_CHANNEL_SOURCE_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                LEAD_MASTER_CHANNEL_SOURCE_FAILURE
            ]
        }
    })
})

// PROVINCE AND AMPHOE AND DISTRICT
export const getLeadMasterProvince = () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${LEAD_MASTER_PROVINCE_URL}`,
            method: 'GET',
            types: [
                LEAD_MASTER_PROVINCE_REQUEST,
                {
                    type: LEAD_MASTER_PROVINCE_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                LEAD_MASTER_PROVINCE_FAILURE
            ]
        }
    })
})

export const getLeadMasterAmphoe = () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${LEAD_MASTER_AMPHOE_URL}`,
            method: 'GET',
            types: [
                LEAD_MASTER_AMPHOE_REQUEST,
                {
                    type: LEAD_MASTER_AMPHOE_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                LEAD_MASTER_AMPHOE_FAILURE
            ]
        }
    })
})

export const getLeadMasterDistrict = () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${LEAD_MASTER_DISTRICT_URL}`,
            method: 'GET',
            types: [
                LEAD_MASTER_DISTRICT_REQUEST,
                {
                    type: LEAD_MASTER_DISTRICT_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                LEAD_MASTER_DISTRICT_FAILURE
            ]
        }
    })
})

export const getLeadChannelDashboard = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_LEADTCHANNEL_DASHBOARD_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                {
                    type: PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_REQUEST,
                    payload: { Data: [], Status: false, Loading: true, Msg: 'Request items' }
                },
                {
                    type: PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {
                            return { Data: data, Status: true, Loading: false, Msg: 'Success' }
                        })
                    }
                },
                {
                    type: PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_FAILURE,
                    payload: { Data: [], Status: false, Loading: false, Msg: 'Not found items' }
                }
            ]
        }
    })
})

export const LeadChannelAddCustomer = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${LEAD_DATA_CREATE_CUSTOMER_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                {
                    type: LEAD_DATA_CREATE_CUSTOMER_REQUEST,
                    payload: { Data: [], Status: false, Loading: true, Msg: 'Request items' }
                },
                {
                    type: LEAD_DATA_CREATE_CUSTOMER_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {
                            return { Data: data, Status: true, Loading: false, Msg: 'Success' }
                        })
                    }
                },
                {
                    type: LEAD_DATA_CREATE_CUSTOMER_FAILURE,
                    payload: { Data: [], Status: false, Loading: false, Msg: 'Not found items' }
                }                
            ]
        }
    })
})

/*
export const getLeadChannelDashboardSummary = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_LEADTCHANNEL_DASHBOARD_SUMMARY_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                {
                    type: PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_REQUEST,
                    payload: { Data: [], Status: false, Loading: true, Msg: 'Request items' }
                },
                {
                    type: PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {
                            return { Data: data, Status: true, Loading: false, Msg: 'Success' }
                        })
                    }
                },
                {
                    type: PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_FAILURE,
                    payload: { Data: [], Status: false, Loading: false, Msg: 'Not found items' }
                }                
            ]
        }
    })
})

export const getLeadChannelDashboardSummarySub = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_LEADTCHANNEL_DASHBOARD_SUMMARY_SUB_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                {
                    type: PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_SUB_REQUEST,
                    payload: { Data: [], Status: false, Loading: true, Msg: 'Request items' }
                },
                {
                    type: PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_SUB_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {
                            return { Data: data, Status: true, Loading: false, Msg: 'Success' }
                        })
                    }
                },
                {
                    type: PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_SUB_FAILURE,
                    payload: { Data: [], Status: false, Loading: false, Msg: 'Not found items' }
                }                
            ]
        }
    })
})
*/