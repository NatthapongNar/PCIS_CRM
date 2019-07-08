import {CALL_API} from 'redux-api-middleware'
import _ from 'lodash'

import { 
    PCIS_MASTER_REGION_URL,
    PCIS_MASTER_AREA_URL,
    PCIS_MASTER_TEAM_URL,
    PCIS_MASTER_EMPLOYEE_URL,

    PCISCRM_MASTER_RESPONSE_URL,
    PCISCRM_MASTER_ACTION_URL,

    PCISCRM_LEADTOPUP_HEADER_URL,
    PCISCRM_LOT_LEADTOPUP_DASHBOARD_URL,
    PCISCRM_LEADTOPUP_DASHBOARD_URL,
    PCISCRM_LEADTOPUP_SUMMARY_URL,

    PCISCRM_LOAD_ACTIONNOTE_URL,
    PCISCRM_CREATE_ACTIONNOTE_URL,

    // LEAD RABBIT & SALE ACT & OTHER
    PCISCRM_LEADTCHANNEL_AUTHEN_USER_PROFILE_URL,

    PCISCRM_LEADTCHANNEL_DASHBOARD_URL,
    PCISCRM_LEADTCHANNEL_DASHBOARD_SUMMARY_URL,
    PCISCRM_LEADTCHANNEL_DASHBOARD_SUMMARY_SUB_URL,
    PCISCRM_LEADTCHANNEL_PRODUCT_TRANSFER_URL,
    PCISCRM_CREATE_REFER_LEADCHANEL_ACTIONNOTE_URL,
    PCISCRM_LOAD_REFER_LEADCHANEL_ACTIONNOTE_URL,
    PCISCRM_UPDATE_REFER_LEADCHANEL_CUSTPROFILE_URL,
    PCISCRM_HISTORY_REFER_LEADCHANEL_CUSTPROFILE_URL,
    PCISCRM_LEADTCHANNEL_ASSIGNMENT_APPL_OWNER_URL,

    PCISCRM_LEADTCHANNEL_FINDBRANCH_IN_AREA_URL,
    PCISCRM_LEADTCHANNEL_FINDEMPLOYEE_IN_AREA_URL,

    PCISCRM_MASTER_LEADCHANEL_RANK_SCORE_URL,
    PCISCRM_MASTER_LEADCHANEL_SOURCE_CHANNEL_URL,
    PCISCRM_MASTER_LEADCHANEL_SUBSOURCE_CHANNEL_URL,
    PCISCRM_MASTER_LEADCHANEL_PRODUCT_GROUP_URL,

    // NEW LEAD TOP UP
    PCISCRM_NEWLEAD_TOPUP_DASHBOARD_URL,
    PCISCRM_NEWLEAD_TOPUP_DASHBOARD_SUMMARY_URL,
    PCISCRM_NEWLEAD_TOPUP_DASHBOARD_SUBSUMMARY_URL,
    PCISCRM_CREATE_PROHIBITE_CUSTOMER_URL,
    PCISCRM_LOAD_MASTERLOT_URL
    
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

    PCISCRM_LOAD_LEADTOPUP_HEADER_REQUEST,
    PCISCRM_LOAD_LEADTOPUP_HEADER_SUCCESS,
    PCISCRM_LOAD_LEADTOPUP_HEADER_FAILURE,

    PCISCRM_LOAD_LOT_LEADTOPUP_SUMMARY_REQUEST,
    PCISCRM_LOAD_LOT_LEADTOPUP_SUMMARY_SUCCESS,
    PCISCRM_LOAD_LOT_LEADTOPUP_SUMMARY_FAILURE,
 
    PCISCRM_LOAD_LEADTOPUP_DASHBOARD_REQUEST,
    PCISCRM_LOAD_LEADTOPUP_DASHBOARD_SUCCESS,
    PCISCRM_LOAD_LEADTOPUP_DASHBOARD_FAILURE,

    PCISCRM_LOAD_ACTIONNOTE_LEADTOPUP_REQUEST,
    PCISCRM_LOAD_ACTIONNOTE_LEADTOPUP_SUCCESS,
    PCISCRM_LOAD_ACTIONNOTE_LEADTOPUP_FAILURE,

    PCISCRM_CREATE_ACTIONNOTE_LEADTOPUP_REQUEST,
    PCISCRM_CREATE_ACTIONNOTE_LEADTOPUP_SUCCESS,
    PCISCRM_CREATE_ACTIONNOTE_LEADTOPUP_FAILURE,

    // REFER LEAND
    PCISCRM_LOAD_LEADCHANNEL_AUTHEN_USER_REQUEST,
    PCISCRM_LOAD_LEADCHANNEL_AUTHEN_USER_SUCCESS,
    PCISCRM_LOAD_LEADCHANNEL_AUTHEN_USER_FAILURE,

    PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_REQUEST,
    PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUCCESS,
    PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_FAILURE,

    PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_REQUEST,
    PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_SUCCESS,
    PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_FAILURE,

    PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_SUB_REQUEST,
    PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_SUB_SUCCESS,
    PCISCRM_LOAD_LEADCHANNEL_DASHBOARD_SUMMARY_SUB_FAILURE,

    PCISCRM_LEADCHANNEL_FIND_BRANCH_IN_AREA_REQUEST,
    PCISCRM_LEADCHANNEL_FIND_BRANCH_IN_AREA_SUCCESS,
    PCISCRM_LEADCHANNEL_FIND_BRANCH_IN_AREA_FAILURE,

    PCISCRM_LEADCHANNEL_FIND_EMPLOYEE_IN_AREA_REQUEST,
    PCISCRM_LEADCHANNEL_FIND_EMPLOYEE_IN_AREA_SUCCESS,
    PCISCRM_LEADCHANNEL_FIND_EMPLOYEE_IN_AREA_FAILURE,

    PCISCRM_LEADCHANNEL_ASSIGNMENT_APPL_OWNER_REQUEST,
    PCISCRM_LEADCHANNEL_ASSIGNMENT_APPL_OWNER_SUCCESS,
    PCISCRM_LEADCHANNEL_ASSIGNMENT_APPL_OWNER_FAILURE,

    PCISCRM_LEADCHANNEL_PRODUCT_TRANSFER_REQUEST,
    PCISCRM_LEADCHANNEL_PRODUCT_TRANSFER_SUCCESS,
    PCISCRM_LEADCHANNEL_PRODUCT_TRANSFER_FAILURE,

    PCISCRM_LOAD_LEADCHANNEL_ACTIONNOTE_REQUEST,
    PCISCRM_LOAD_LEADCHANNEL_ACTIONNOTE_SUCCESS,
    PCISCRM_LOAD_LEADCHANNEL_ACTIONNOTE_FAILURE,

    PCISCRM_CREATE_LEADCHANNEL_ACTIONNOTE_REQUEST,
    PCISCRM_CREATE_LEADCHANNEL_ACTIONNOTE_SUCCESS,
    PCISCRM_CREATE_LEADCHANNEL_ACTIONNOTE_FAILURE,

    PCISCRM_UPDATE_LEADCHANNEL_CUSTPROFILE_REQUEST,
    PCISCRM_UPDATE_LEADCHANNEL_CUSTPROFILE_SUCCESS,
    PCISCRM_UPDATE_LEADCHANNEL_CUSTPROFILE_FAILURE,

    PCISCRM_HISTORY_LEADCHANNEL_CUSTPROFILE_REQUEST,
    PCISCRM_HISTORY_LEADCHANNEL_CUSTPROFILE_SUCCESS,
    PCISCRM_HISTORY_LEADCHANNEL_CUSTPROFILE_FAILURE,

    PCISCRM_MASTER_LEADCHANNEL_RANK_SCORE_REQUEST,
    PCISCRM_MASTER_LEADCHANNEL_RANK_SCORE_SUCCESS,
    PCISCRM_MASTER_LEADCHANNEL_RANK_SCORE_FAILURE,

    PCISCRM_MASTER_LEADCHANNEL_SOURCE_CHANNEL_REQUEST,
    PCISCRM_MASTER_LEADCHANNEL_SOURCE_CHANNEL_SUCCESS,
    PCISCRM_MASTER_LEADCHANNEL_SOURCE_CHANNEL_FAILURE,

    PCISCRM_MASTER_LEADCHANNEL_SUBSOURCE_CHANNEL_REQUEST,
    PCISCRM_MASTER_LEADCHANNEL_SUBSOURCE_CHANNEL_SUCCESS,
    PCISCRM_MASTER_LEADCHANNEL_SUBSOURCE_CHANNEL_FAILURE,

    PCISCRM_LOAD_MASTER_PRODUCT_GROUP_REQUEST,
    PCISCRM_LOAD_MASTER_PRODUCT_GROUP_SUCCESS,
    PCISCRM_LOAD_MASTER_PRODUCT_GROUP_FAILURE,

    // NEW LEAD TOP UP
    PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_REQUEST,
    PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUCCESS,
    PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_FAILURE,

    PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUMMARY_REQUEST,
    PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUMMARY_SUCCESS,
    PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUMMARY_FAILURE,

    PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUBSUMMARY_REQUEST,
    PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUBSUMMARY_SUCCESS,
    PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUBSUMMARY_FAILURE,
    
    PCISCRM_CREATE_PROHIBITE_CUSTOMER_REQUEST,
    PCISCRM_CREATE_PROHIBITE_CUSTOMER_SUCCESS,
    PCISCRM_CREATE_PROHIBITE_CUSTOMER_FAILURE,

    PCISCRM_LOAD_MASTER_LOT_REQUEST,
    PCISCRM_LOAD_MASTER_LOT_SUCCESS,
    PCISCRM_LOAD_MASTER_LOT_FAILURE

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
                                    title: `${region}`,
                                    value: f_region.map(item => item.RegionID).join(','),
                                    className: `ttu`,
                                    children: _.orderBy(f_region, ['GroupRegion', 'SeqRpt'], ['asc', 'asc']).map((item) => {
                                        return ({
                                            key: `${item.RegionID}`,
                                            title: `${item.RegionNameEng}`,
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
                            
                            let departcategory = _.map(data, (v) => { return v.GroupRegion })     
                            let data_items = _.map(_.uniqWith(departcategory, _.isEqual), (department) => {
                                let f_department = _.filter(data, { GroupRegion: department })   

                                let region_category = _.map(f_department, (v) => { return { RegionID: v.RegionID, RegionNameEng: v.RegionNameEng,} })  
                                let region_list =  _.uniqWith(region_category, _.isEqual)
                                return {                                   
                                    key: `${department}`,
                                    title: `${department}`,
                                    value: _.uniqWith(region_list.map(item => item.RegionID), _.isEqual).join(','),
                                    className: `ttu`,
                                    children: region_list.map((region) => {  
                                        let f_area = _.filter(data, { RegionID: region.RegionID }) 

                                        let area_category = _.map(f_area, (v) => { return { AreaCode: v.AreaCode, AreaName: v.AreaName } })  
                                        let area_list =  _.uniqWith(area_category, _.isEqual)
                                        
                                        return ({
                                            key: `${region.RegionID}`,
                                            title: `${region.RegionNameEng}`,
                                            value: `${_.uniqWith(f_area.map(item => item.AreaName), _.isEqual).join(',')}`,                                           
                                            className: `ttu`,
                                            children: _.orderBy(area_list, ['AreaName'], ['asc']).map((item) => {
                                                return ({
                                                    key: `${item.AreaName}`,
                                                    title: `${item.AreaName}`,
                                                    value: `${item.AreaName}`,                                           
                                                    className: `ttu`
                                                })
                                            })
                                        })

                                    })
                                }

                            })
                            
                            // let category = _.map(data, (v) => { return v.RegionNameEng })                 
                            // let area_items = _.map(_.uniqWith(category, _.isEqual), (region) => {
                            //     let f_area = _.filter(data, { RegionNameEng: region })          
                            //     return {                                   
                            //         key: `${region}`,
                            //         title: `${region}`,
                            //         value: f_area.map(item => item.AreaName).join(','),
                            //         className: `ttu`,
                            //         children: (f_area && f_area.length > 1) ? _.orderBy(f_area, ['AreaName'], ['asc']).map((item) => {
                            //             return ({
                            //                 key: `${item.AreaName}`,
                            //                 title: `${item.AreaName}`,
                            //                 value: `${item.AreaName}`,                                           
                            //                 className: `ttu`
                            //             })
                            //         }) : []
                            //     }
                            // })

                            return data_items
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

                            let departcategory = _.map(data, (v) => { return v.GroupRegion })     
                     
                            let data_items = _.map(_.uniqWith(departcategory, _.isEqual), (department) => {
                                let f_department = _.filter(data, { GroupRegion: department })   

                                let region_category = _.map(f_department, (v) => { return { RegionID: v.RegionID, RegionNameEng: v.RegionNameEng } })  
                                let region_list =  _.uniqWith(region_category, _.isEqual)

                                return {                                   
                                    key: `${department}`,
                                    title: `${department}`,
                                    value: _.uniqWith(f_department.map(item => item.BranchCostCenter), _.isEqual).join(','),
                                    className: `ttu`,
                                    children: region_list.map((region) => {  
                                        let f_area = _.filter(data, { RegionID: region.RegionID }) 

                                        let zone_category = _.map(f_area, (v) => { return { RegionID: parseInt(v.RegionID), ZoneText: v.ZoneText, Seq: parseInt(v.Seq) } })  
                                        let zone_list =  _.uniqWith(zone_category, _.isEqual)
     
                                        return ({
                                            key: `${region.RegionID}`,
                                            title: `${region.RegionNameEng}`,
                                            value: `${_.uniqWith(f_area.map(item => item.BranchCostCenter), _.isEqual).join(',')}`,                                           
                                            className: `ttu`,
                                            children: _.orderBy(zone_list, ['RegionID', 'Seq'], ['asc', 'asc']).map((zone) => {
                                                let f_brnach = _.filter(data, { ZoneText: zone.ZoneText }) 
                                                
                                                let branch_category = _.map(f_brnach, (v) => { return { BranchCode: v.BranchCode, BranchCostCenter: v.BranchCostCenter, BranchName: v.BranchName } })  
                                                let branch_list =  _.uniqWith(branch_category, _.isEqual)
                                                
                                                return ({
                                                    key: `${zone.ZoneText}`,
                                                    title: `${zone.ZoneText}`,
                                                    value: `${_.uniqWith(f_brnach.map(item => item.BranchCostCenter), _.isEqual).join(',')}`,                                           
                                                    className: `ttu`,
                                                    children: _.orderBy(branch_list, ['BranchCode', 'Seq'], ['asc', 'asc']).map((br_item) => {
                                                        return {
                                                            key: `${br_item.BranchCostCenter}`,
                                                            title: `${br_item.BranchName}`,
                                                            value: `${br_item.BranchCostCenter}`,                                           
                                                            className: `ttu`
                                                        }
                                                    })
                                                })
                                            })
                                        })
                                        
                                    })
                                }

                            })

                            return data_items

                            // let category = _.map(data, (v) => { return v.AreaName })
                            // let team_items = _.map(_.uniqWith(category, _.isEqual), (area) => {     
                            //     let f_team = _.filter(data, { AreaName: area })       
                            //     return {                                   
                            //         key: `${area}`,
                            //         title: `${area}`,
                            //         value: f_team.map(item => item.BranchCode).join(','),
                            //         className: `ttu`,
                            //         children: _.orderBy(f_team, ['BranchCode'], ['asc']).map((item) => {
                            //             return {
                            //                 key: `${item.BranchCode}`,
                            //                 title: `${item.BranchName}`,
                            //                 value: `${item.BranchCode}`,                                           
                            //                 className: `ttu`
                            //             }
                            //         })
                            //     }
                            // }) 
                            // return team_items
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

                            let departcategory = _.map(data, (v) => { return v.GroupRegion })  

                            let data_items = _.map(_.uniqWith(departcategory, _.isEqual), (department) => {
                                let f_department = _.filter(data, { GroupRegion: department })   
    
                                let region_category = _.map(f_department, (v) => { return { RegionID: v.RegionID, RegionNameEng: v.RegionNameEng } })  
                                let region_list =  _.uniqWith(region_category, _.isEqual)  

                                return {                                   
                                    key: `${department}`,
                                    title: `${department}`,
                                    value: _.uniqWith(f_department.map(item => item.EmployeeCode), _.isEqual).join(','),
                                    className: `ttu`,
                                    children: region_list.map((region) => {  
                                        let f_area = _.filter(data, { RegionID: region.RegionID }) 

                                        let branch_category = _.map(f_area, (v) => { return { BranchCostCenter: v.BranchCostCenter, BranchName: v.BranchName } })  
                         
                                        return ({
                                            key: `${region.RegionID}`,
                                            title: `${region.RegionNameEng}`,
                                            value: `${_.uniqWith(f_area.map(item => item.EmployeeCode), _.isEqual).join(',')}`,                                           
                                            className: `ttu`,
                                            children: _.map(_.uniqWith(branch_category, _.isEqual), (objData) => {
                                                let f_employee = _.filter(data, { BranchCostCenter: objData.BranchCostCenter })          
                                                return {                                   
                                                    key: `${objData.BranchCostCenter}`,
                                                    title: `${objData.BranchName}`,
                                                    value: f_employee.map(item => item.EmployeeCode).join(','),
                                                    className: `ttu`,
                                                    children: (f_employee && f_employee.length > 0) ? _.orderBy(f_employee, ['PositionFlag'], ['asc']).map((item) => {
                                                        return ({
                                                            key: `${item.EmployeeCode}`,
                                                            title: `(${item.PositionTitle}) ${item.FullNameTh}`,
                                                            value: `${item.EmployeeCode}`,                                           
                                                            className: `ttu`
                                                        })
                                                    }) : [],
                                                    disabled: (f_employee && f_employee.length > 0) ? false : true
                                                }
                                            })
                                        })
                                    })
                                    
                                }
                            })
        
                            return data_items

                            // let category = _.map(data, (v) => { return { BranchCode: v.BranchCode, BranchName: v.BranchName } })   
                            // let employee_items = _.map(_.uniqWith(category, _.isEqual), (objData) => {
                            //     let f_employee = _.filter(data, { BranchCode: objData.BranchCode })          
                            //     return {                                   
                            //         key: `${objData.BranchCode}`,
                            //         title: `${objData.BranchName}`,
                            //         value: f_employee.map(item => item.EmployeeCode).join(','),
                            //         className: `ttu`,
                            //         children: (f_employee && f_employee.length > 0) ? _.orderBy(f_employee, ['PositionFlag'], ['asc']).map((item) => {
                            //             return ({
                            //                 key: `${item.EmployeeCode}`,
                            //                 title: `(${item.PositionShortTitle}) ${item.FullNameTh}`,
                            //                 value: `${item.EmployeeCode}`,                                           
                            //                 className: `ttu`
                            //             })
                            //         }) : [],
                            //         disabled: (f_employee && f_employee.length > 0) ? false : true
                            //     }
                            // })
                            // return employee_items
                        })
                    }
                },
                PCIS_LOAD_MASTER_EMPLOYEE_FAILURE
            ]
        }
    })
})

// -- CRM MASTER
export const getCRMUserAuthenication = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_LEADTCHANNEL_AUTHEN_USER_PROFILE_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                {
                    type: PCISCRM_LOAD_LEADCHANNEL_AUTHEN_USER_REQUEST,
                    payload: { Data: [], Status: false, Loading: true, Msg: 'Request items' }
                },
                {
                    type: PCISCRM_LOAD_LEADCHANNEL_AUTHEN_USER_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {
                            return { Data: data, Status: true, Loading: false, Msg: 'Success' }
                        })
                    }
                },
                {
                    type: PCISCRM_LOAD_LEADCHANNEL_AUTHEN_USER_FAILURE,
                    payload: { Data: [], Status: false, Loading: false, Msg: 'Not found items' }
                }
            ]
        }
    })
})

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

export const getFindBranchInArea = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_LEADTCHANNEL_FINDBRANCH_IN_AREA_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                {
                    type: PCISCRM_LEADCHANNEL_FIND_BRANCH_IN_AREA_REQUEST,
                    payload: { Data: [], Status: false, Loading: true, Msg: 'Request items' }
                },
                {
                    type: PCISCRM_LEADCHANNEL_FIND_BRANCH_IN_AREA_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {
                            return { Data: data, Status: true, Loading: false, Msg: 'Success' }
                        })
                    }
                },
                {
                    type: PCISCRM_LEADCHANNEL_FIND_BRANCH_IN_AREA_FAILURE,
                    payload: { Data: [], Status: false, Loading: false, Msg: 'Not found items' }
                }
            ]
        }
    })
})


export const getFindEmpInArea = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_LEADTCHANNEL_FINDEMPLOYEE_IN_AREA_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                {
                    type: PCISCRM_LEADCHANNEL_FIND_EMPLOYEE_IN_AREA_REQUEST,
                    payload: { Data: [], Status: false, Loading: true, Msg: 'Request items' }
                },
                {
                    type: PCISCRM_LEADCHANNEL_FIND_EMPLOYEE_IN_AREA_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {
                            return { Data: data, Status: true, Loading: false, Msg: 'Success' }
                        })
                    }
                },
                {
                    type: PCISCRM_LEADCHANNEL_FIND_EMPLOYEE_IN_AREA_FAILURE,
                    payload: { Data: [], Status: false, Loading: false, Msg: 'Not found items' }
                }
            ]
        }
    })
})

export const assignApplicationNewOwner = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_LEADTCHANNEL_ASSIGNMENT_APPL_OWNER_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                {
                    type: PCISCRM_LEADCHANNEL_ASSIGNMENT_APPL_OWNER_REQUEST,
                    payload: { Data: [], Status: false, Loading: true, Msg: 'Request items' }
                },
                {
                    type: PCISCRM_LEADCHANNEL_ASSIGNMENT_APPL_OWNER_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {
                            return { Data: data, Status: true, Loading: false, Msg: 'Success' }
                        })
                    }
                },
                {
                    type: PCISCRM_LEADCHANNEL_ASSIGNMENT_APPL_OWNER_FAILURE,
                    payload: { Data: [], Status: false, Loading: false, Msg: 'Not found items' }
                }
            ]
        }
    })
})

// -- CRM API
export const getLeadTopUpHeader = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_LEADTOPUP_HEADER_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                PCISCRM_LOAD_LEADTOPUP_HEADER_REQUEST,
                {
                    type: PCISCRM_LOAD_LEADTOPUP_HEADER_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                PCISCRM_LOAD_LEADTOPUP_HEADER_FAILURE
            ]
        }
    })
})

export const getLotLeadTopUpByPCISCRM = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_LOT_LEADTOPUP_DASHBOARD_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                {
                    type: PCISCRM_LOAD_LOT_LEADTOPUP_SUMMARY_REQUEST,
                    payload: { Data: [], Status: false, Msg: 'Request items'}
                },
                {
                    type: PCISCRM_LOAD_LOT_LEADTOPUP_SUMMARY_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {
                            return { Data: data, Status: true, Msg: 'Success'}
                        })
                    }
                },
                {
                    type: PCISCRM_LOAD_LOT_LEADTOPUP_SUMMARY_FAILURE,
                    payload: { Data: [], Status: false, Msg: 'Not found items'}
                }                  
            ]
        }
    })
})

export const getLeadTopUpByPCISCRM = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_LEADTOPUP_DASHBOARD_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                {
                    type: PCISCRM_LOAD_LEADTOPUP_DASHBOARD_REQUEST,
                    payload: { Data: [], Status: false, Msg: 'Request items'}
                },
                {
                    type: PCISCRM_LOAD_LEADTOPUP_DASHBOARD_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {
                            return { Data: data, Status: true, Msg: 'Success'}
                        })
                    }
                },
                {
                    type: PCISCRM_LOAD_LEADTOPUP_DASHBOARD_FAILURE,
                    payload: { Data: [], Status: false, Msg: 'Not found items'}
                }                  
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

// REFERRAL LEAD CHANNEL API
export const getMasterRankScore = () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_MASTER_LEADCHANEL_RANK_SCORE_URL}`,
            method: 'GET',
            types: [
                PCISCRM_MASTER_LEADCHANNEL_RANK_SCORE_REQUEST, 
                {
                    type: PCISCRM_MASTER_LEADCHANNEL_RANK_SCORE_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                PCISCRM_MASTER_LEADCHANNEL_RANK_SCORE_FAILURE
            ]
        }
    })
})

export const getMasterSourceChannel = () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_MASTER_LEADCHANEL_SOURCE_CHANNEL_URL}`,
            method: 'GET',
            types: [
                PCISCRM_MASTER_LEADCHANNEL_SOURCE_CHANNEL_REQUEST, 
                {
                    type: PCISCRM_MASTER_LEADCHANNEL_SOURCE_CHANNEL_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                PCISCRM_MASTER_LEADCHANNEL_SOURCE_CHANNEL_FAILURE
            ]
        }
    })
})

export const getMasterSubSourceChannel = () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_MASTER_LEADCHANEL_SUBSOURCE_CHANNEL_URL}`,
            method: 'GET',
            types: [
                PCISCRM_MASTER_LEADCHANNEL_SUBSOURCE_CHANNEL_REQUEST, 
                {
                    type: PCISCRM_MASTER_LEADCHANNEL_SUBSOURCE_CHANNEL_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                PCISCRM_MASTER_LEADCHANNEL_SUBSOURCE_CHANNEL_FAILURE
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

export const productTransfer = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_LEADTCHANNEL_PRODUCT_TRANSFER_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                {
                    type: PCISCRM_LEADCHANNEL_PRODUCT_TRANSFER_REQUEST,
                    payload: { Data: [], Status: false, Loading: true, Msg: 'Request items' }
                },
                {
                    type: PCISCRM_LEADCHANNEL_PRODUCT_TRANSFER_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {
                            return { Data: data, Status: true, Loading: false, Msg: 'Success' }
                        })
                    }
                },
                {
                    type: PCISCRM_LEADCHANNEL_PRODUCT_TRANSFER_FAILURE,
                    payload: { Data: [], Status: false, Loading: false, Msg: 'Not found items' }
                }
            ]
        }
    })
})

export const createLeadChannelActionNote = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_CREATE_REFER_LEADCHANEL_ACTIONNOTE_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                PCISCRM_CREATE_LEADCHANNEL_ACTIONNOTE_REQUEST, 
                {
                    type: PCISCRM_CREATE_LEADCHANNEL_ACTIONNOTE_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                PCISCRM_CREATE_LEADCHANNEL_ACTIONNOTE_FAILURE
            ]
        }
    })
})

export const loadLeadChannelActionNote = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_LOAD_REFER_LEADCHANEL_ACTIONNOTE_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                PCISCRM_LOAD_LEADCHANNEL_ACTIONNOTE_REQUEST, 
                {
                    type: PCISCRM_LOAD_LEADCHANNEL_ACTIONNOTE_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                PCISCRM_LOAD_LEADCHANNEL_ACTIONNOTE_FAILURE
            ]
        }
    })
})

export const updateLeadChannelCustProfile = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_UPDATE_REFER_LEADCHANEL_CUSTPROFILE_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                PCISCRM_UPDATE_LEADCHANNEL_CUSTPROFILE_REQUEST, 
                {
                    type: PCISCRM_UPDATE_LEADCHANNEL_CUSTPROFILE_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                PCISCRM_UPDATE_LEADCHANNEL_CUSTPROFILE_FAILURE
            ]
        }
    })
})

export const getLeadChannelCustProfileHistory = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_HISTORY_REFER_LEADCHANEL_CUSTPROFILE_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                PCISCRM_HISTORY_LEADCHANNEL_CUSTPROFILE_REQUEST, 
                {
                    type: PCISCRM_HISTORY_LEADCHANNEL_CUSTPROFILE_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                PCISCRM_HISTORY_LEADCHANNEL_CUSTPROFILE_FAILURE
            ]
        }
    })
})

export const getMasterProductGroup = () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_MASTER_LEADCHANEL_PRODUCT_GROUP_URL}`,
            method: 'GET',
            types: [
                PCISCRM_LOAD_MASTER_PRODUCT_GROUP_REQUEST,
                {
                    type: PCISCRM_LOAD_MASTER_PRODUCT_GROUP_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                PCISCRM_LOAD_MASTER_PRODUCT_GROUP_FAILURE
            ]
        }
    })
})

// NEW LEAD TOP-UP API
export const getNewLeadTopupDashboard = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_NEWLEAD_TOPUP_DASHBOARD_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                {
                    type: PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_REQUEST,
                    payload: { Data: [], Status: false, Loading: true, Msg: 'Request items' }
                },
                {
                    type: PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {
                            return { Data: data, Status: true, Loading: false, Msg: 'Success' }
                        })
                    }
                },
                {
                    type: PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_FAILURE,
                    payload: { Data: [], Status: false, Loading: false, Msg: 'Not found items' }
                }                  
            ]
        }
    })
})

export const getNewLeadTopupDashboardSummary = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_NEWLEAD_TOPUP_DASHBOARD_SUMMARY_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                {
                    type: PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUMMARY_REQUEST,
                    payload: { Data: [], Status: false, Loading: true, Msg: 'Request items' }
                },
                {
                    type: PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUMMARY_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {
                            return { Data: data, Status: true, Loading: false, Msg: 'Success' }
                        })
                    }
                },
                {
                    type: PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUMMARY_FAILURE,
                    payload: { Data: [], Status: false, Loading: false, Msg: 'Not found items' }
                }                  
            ]
        }
    })
})

export const getNewLeadTopupDashboardSubSummary = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_NEWLEAD_TOPUP_DASHBOARD_SUBSUMMARY_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                {
                    type: PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUBSUMMARY_REQUEST,
                    payload: { Data: [], Status: false, Loading: true, Msg: 'Request items' }
                },
                {
                    type: PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUBSUMMARY_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {
                            return { Data: data, Status: true, Loading: false, Msg: 'Success' }
                        })
                    }
                },
                {
                    type: PCISCRM_LOAD_NEWLEAD_TOPUP_DASHBOARD_SUBSUMMARY_FAILURE,
                    payload: { Data: [], Status: false, Loading: false, Msg: 'Not found items' }
                }                  
            ]
        }
    })
})

export const createCustProhibitLog = (param) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_CREATE_PROHIBITE_CUSTOMER_URL}`,
            headers: json_header,
            method: 'POST',
            body: JSON.stringify(param),
            types: [
                PCISCRM_CREATE_PROHIBITE_CUSTOMER_REQUEST, 
                {
                    type: PCISCRM_CREATE_PROHIBITE_CUSTOMER_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => {
                            return { Data: data, Status: true, Loading: false, Msg: 'Success' }
                        })
                    }
                },
                PCISCRM_CREATE_PROHIBITE_CUSTOMER_FAILURE
            ]
        }
    })
})

export const getNewLeadTopupMasterLot = () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${PCISCRM_LOAD_MASTERLOT_URL}`,
            method: 'GET',
            types: [
                PCISCRM_LOAD_MASTER_LOT_REQUEST, 
                {
                    type: PCISCRM_LOAD_MASTER_LOT_SUCCESS,
                    payload: (_action, _state, res) => {
                        return res.json().then((data) => data)
                    }
                },
                PCISCRM_LOAD_MASTER_LOT_FAILURE
            ]
        }
    })
})