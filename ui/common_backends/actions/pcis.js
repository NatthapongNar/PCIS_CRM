import {CALL_API} from 'redux-api-middleware'
import _ from 'lodash'

import { 
    PCIS_MASTER_REGION_URL,
    PCIS_MASTER_AREA_URL,
    PCIS_MASTER_TEAM_URL,
    PCIS_MASTER_EMPLOYEE_URL,

    PCISCRM_MASTER_RESPONSE_URL,
    PCISCRM_MASTER_ACTION_URL,

    PCISCRM_LEADTOPUP_DASHBOARD_URL,
    PCISCRM_LEADTOPUP_SUMMARY_URL,

    PCISCRM_LOAD_ACTIONNOTE_URL,
    PCISCRM_CREATE_ACTIONNOTE_URL

} from '../constants/endpoints'

import { 
    PCIS_LOAD_MASTER_REGION_REQUEST,
    PCIS_LOAD_MASTER_REGION_SUCCESS,
    PCIS_LOAD_MASTER_REGION_FAILURE,

    PCIS_LOAD_MASTER_AREA_REQUEST,
    PCIS_LOAD_MASTER_AREA_SUCCESS,
    PCIS_LOAD_MASTER_AREA_FAILURE,

    PCIS_LOAD_MASTER_TEAM_REQUEST,
    PCIS_LOAD_MASTER_TEAM_SUCCESS,
    PCIS_LOAD_MASTER_TEAM_FAILURE,

    PCIS_LOAD_MASTER_EMPLOYEE_REQUEST,
    PCIS_LOAD_MASTER_EMPLOYEE_SUCCESS,
    PCIS_LOAD_MASTER_EMPLOYEE_FAILURE,

    PCISCRM_LOAD_MASTER_RESPONSE_REQUEST,
    PCISCRM_LOAD_MASTER_RESPONSE_SUCCESS,
    PCISCRM_LOAD_MASTER_RESPONSE_FAILURE,

    PCISCRM_LOAD_MASTER_ACTION_REQUEST,
    PCISCRM_LOAD_MASTER_ACTION_SUCCESS,
    PCISCRM_LOAD_MASTER_ACTION_FAILURE,

    PCISCRM_LOAD_LEADTOPUP_SUMMARY_REQUEST,
    PCISCRM_LOAD_LEADTOPUP_SUMMARY_SUCCESS,
    PCISCRM_LOAD_LEADTOPUP_SUMMARY_FAILURE,

    PCISCRM_LOAD_LEADTOPUP_DASHBOARD_REQUEST,
    PCISCRM_LOAD_LEADTOPUP_DASHBOARD_SUCCESS,
    PCISCRM_LOAD_LEADTOPUP_DASHBOARD_FAILURE,

    PCISCRM_LOAD_ACTIONNOTE_LEADTOPUP_REQUEST,
    PCISCRM_LOAD_ACTIONNOTE_LEADTOPUP_SUCCESS,
    PCISCRM_LOAD_ACTIONNOTE_LEADTOPUP_FAILURE,

    PCISCRM_CREATE_ACTIONNOTE_LEADTOPUP_REQUEST,
    PCISCRM_CREATE_ACTIONNOTE_LEADTOPUP_SUCCESS,
    PCISCRM_CREATE_ACTIONNOTE_LEADTOPUP_FAILURE

} from '../constants/actionType'

const json_header = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

/**************************************** PCIS API ******************************************************/
export const getMasterRegionFilter = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCIS_MASTER_REGION_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                PCIS_LOAD_MASTER_REGION_REQUEST, 
                {
                    type: PCIS_LOAD_MASTER_REGION_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {
                            let category = _.map(data, (v) => { return v.GroupRegion })               
                            let region_items = _.map(_.uniqWith(category, _.isEqual), (region) => {
                                let f_region = _.filter(data, { GroupRegion: region })                                                     
                                return {                                   
                                    key: `${region}`,
                                    label: `${region}`,
                                    value: f_region.map(item => item.RegionID).join(','),
                                    className: `ttu`,
                                    children: _.orderBy(f_region, ['RegionID'], ['asc']).map((item) => {
                                        return ({
                                            key: `${item.RegionID}`,
                                            label: `${item.RegionNameEng}`,
                                            value: `${item.RegionID}`,                                           
                                            className: `ttu`
                                        })
                                    })
                                }
                            })                     
                            return region_items
                        })
                    }
                },
                PCIS_LOAD_MASTER_REGION_FAILURE
            ]
        }
    })
})

export const getMasterAreaFilter = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCIS_MASTER_AREA_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                PCIS_LOAD_MASTER_AREA_REQUEST, 
                {
                    type: PCIS_LOAD_MASTER_AREA_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {            
                            let category = _.map(data, (v) => { return v.RegionNameEng })                 
                            let area_items = _.map(_.uniqWith(category, _.isEqual), (region) => {
                                let f_area = _.filter(data, { RegionNameEng: region })          
                                return {                                   
                                    key: `${region}`,
                                    label: `${region}`,
                                    value: f_area.map(item => item.AreaName).join(','),
                                    className: `ttu`,
                                    children: (f_area && f_area.length > 1) ? _.orderBy(f_area, ['AreaName'], ['asc']).map((item) => {
                                        return ({
                                            key: `${item.AreaName}`,
                                            label: `${item.AreaName}`,
                                            value: `${item.AreaName}`,                                           
                                            className: `ttu`
                                        })
                                    }) : []
                                }
                            })
                            return area_items
                        })
                    }
                },
                PCIS_LOAD_MASTER_AREA_FAILURE
            ]
        }
    })
})

export const getMasterTeamFilter = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCIS_MASTER_TEAM_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                PCIS_LOAD_MASTER_TEAM_REQUEST, 
                {
                    type: PCIS_LOAD_MASTER_TEAM_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {
                            let category = _.map(data, (v) => { return v.AreaName })
                            let team_items = _.map(_.uniqWith(category, _.isEqual), (area) => {     
                                let f_team = _.filter(data, { AreaName: area })       
                                return {                                   
                                    key: `${area}`,
                                    label: `${area}`,
                                    value: f_team.map(item => item.BranchCode).join(','),
                                    className: `ttu`,
                                    children: _.orderBy(f_team, ['BranchCode'], ['asc']).map((item) => {
                                        return {
                                            key: `${item.BranchCode}`,
                                            label: `${item.BranchName}`,
                                            value: `${item.BranchCode}`,                                           
                                            className: `ttu`
                                        }
                                    })
                                }
                            }) 
                            return team_items
                        })
                    }
                },
                PCIS_LOAD_MASTER_TEAM_FAILURE
            ]
        }
    })
})

export const getMasterEmployeeFilter = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCIS_MASTER_EMPLOYEE_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                PCIS_LOAD_MASTER_EMPLOYEE_REQUEST, 
                {
                    type: PCIS_LOAD_MASTER_EMPLOYEE_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {
                            let category = _.map(data, (v) => { return { BranchCode: v.BranchCode, BranchName: v.BranchName } })   
                            let employee_items = _.map(_.uniqWith(category, _.isEqual), (objData) => {
                                let f_employee = _.filter(data, { BranchCode: objData.BranchCode })          
                                return {                                   
                                    key: `${objData.BranchCode}`,
                                    label: `${objData.BranchName}`,
                                    value: f_employee.map(item => item.EmployeeCode).join(','),
                                    className: `ttu`,
                                    children: (f_employee && f_employee.length > 0) ? _.orderBy(f_employee, ['PositionFlag'], ['asc']).map((item) => {
                                        return ({
                                            key: `${item.EmployeeCode}`,
                                            label: `(${item.PositionShortTitle}) ${item.FullNameTh}`,
                                            value: `${item.EmployeeCode}`,                                           
                                            className: `ttu`
                                        })
                                    }) : [],
                                    disabled: (f_employee && f_employee.length > 0) ? false : true
                                }
                            })
                            return employee_items
                        })
                    }
                },
                PCIS_LOAD_MASTER_EMPLOYEE_FAILURE
            ]
        }
    })
})

// -- CRM MASTER
export const getMasterResponse = () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_MASTER_RESPONSE_URL}`,
            method: 'GET',
            types: [
                PCISCRM_LOAD_MASTER_RESPONSE_REQUEST, 
                {
                    type: PCISCRM_LOAD_MASTER_RESPONSE_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                PCISCRM_LOAD_MASTER_RESPONSE_FAILURE
            ]
        }
    })
})

export const getMasterActionReason = () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_MASTER_ACTION_URL}`,
            method: 'GET',
            types: [
                PCISCRM_LOAD_MASTER_ACTION_REQUEST, 
                {
                    type: PCISCRM_LOAD_MASTER_ACTION_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                PCISCRM_LOAD_MASTER_ACTION_FAILURE
            ]
        }
    })
})

// -- CRM API
export const getLeadTopUpByPCISCRM = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_LEADTOPUP_DASHBOARD_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                PCISCRM_LOAD_LEADTOPUP_DASHBOARD_REQUEST,
                {
                    type: PCISCRM_LOAD_LEADTOPUP_DASHBOARD_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                PCISCRM_LOAD_LEADTOPUP_DASHBOARD_FAILURE
            ]
        }
    })
})

export const getLeadTopupSummary = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_LEADTOPUP_SUMMARY_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                PCISCRM_LOAD_LEADTOPUP_SUMMARY_REQUEST, 
                {
                    type: PCISCRM_LOAD_LEADTOPUP_SUMMARY_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                PCISCRM_LOAD_LEADTOPUP_SUMMARY_FAILURE
            ]
        }
    })
})

export const loadActionNote = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_LOAD_ACTIONNOTE_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                PCISCRM_LOAD_ACTIONNOTE_LEADTOPUP_REQUEST, 
                {
                    type: PCISCRM_LOAD_ACTIONNOTE_LEADTOPUP_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                PCISCRM_LOAD_ACTIONNOTE_LEADTOPUP_FAILURE
            ]
        }
    })
})

export const createActionNote = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_CREATE_ACTIONNOTE_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                PCISCRM_CREATE_ACTIONNOTE_LEADTOPUP_REQUEST, 
                {
                    type: PCISCRM_CREATE_ACTIONNOTE_LEADTOPUP_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                PCISCRM_CREATE_ACTIONNOTE_LEADTOPUP_FAILURE
            ]
        }
    })
})