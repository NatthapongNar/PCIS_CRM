import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'
import bluebird from 'bluebird'

import { LeadNewTopupDashboard } from '../../../Components/PCIS/CRM'
import {
    getMasterRegionFilter,
    getMasterAreaFilter,
    getMasterTeamFilter,
    getMasterEmployeeFilter,
    getMasterResponse,
    getMasterActionReason

} from '../../../actions/pcis'

import { app_config } from '../../../components/App/config'
import { config } from '../config'
import { in_array } from '../config/funcitonal'
import { columns } from '../config/columns'

class LeadNewTopupCtrl extends Component {

    constructor(props) {
        super(props)

        const { cookies } = this.props
        const { cookieConfig } = config        
        const ck_info = cookies.get(cookieConfig.name.authen, { path: cookieConfig.path })

        this.state = {
            authen: (!_.isEmpty(ck_info)) ? ck_info : []
        }

    }


    componentWillMount() {
        const { authen } = this.state
        const {  GET_MASTER_REGION, GET_MASTER_AREA, GET_MASTER_TEAM, GET_MASTER_EMPS, GET_MASTER_RESPONSE, GET_MASTER_ACTION } = this.props

        const API_DEFAULT_CALL = [
            GET_MASTER_RESPONSE, 
            GET_MASTER_ACTION,
            GET_MASTER_REGION,
            GET_MASTER_AREA,
            GET_MASTER_TEAM,
            GET_MASTER_EMPS            
        ]

        let auth_data = { AuthCode: (authen && !_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null }
        bluebird.all(API_DEFAULT_CALL).each((f, i) => { 
            if(in_array(i, [0, 1])) f()
            else f(auth_data) 
        })
    }

    render() {
        const { authen } = this.state
        const { masters, filters } = this.props
       
        return (
            <LeadNewTopupDashboard
                authen={authen}
                appConfig={app_config}
                config={config}                
                columns={columns.grid_new_topup}
                summary_columns={columns.crm_topupsummary}            
                masters={masters}
                filters={filters}
                handleResetFilter={this.handleResetFilter}
                apifilter={{
                    GET_MASTER_REGION: this.props.GET_MASTER_REGION,
                    GET_MASTER_AREA: this.props.GET_MASTER_AREA,
                    GET_MASTER_TEAM: this.props.GET_MASTER_TEAM,
                    GET_MASTER_EMPS: this.props.GET_MASTER_EMPS
                }}
            />
        )
    }

    handleResetFilter = () => {
        const { authen, GET_MASTER_REGION, GET_MASTER_AREA, GET_MASTER_TEAM, GET_MASTER_EMPS } = this.props
        
        let auth_data = { AuthCode: (authen && !_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null }
        let API_CALL = [
            GET_MASTER_REGION,
            GET_MASTER_AREA,
            GET_MASTER_TEAM,
            GET_MASTER_EMPS
        ]

        bluebird.all(API_CALL).each(f => f(auth_data))
    }

}

const LeadNewTopupCtrlWithCookies = withCookies(LeadNewTopupCtrl)
export default connect(
    (state) => ({
        filters: {
            region: state.PCIS_MASTER_REGION,
            area: state.PCIS_MASTER_AREA,
            team: state.PCIS_MASTER_TEAM,
            emps: state.PCIS_MASTER_EMPLOYEE,
            optional: {
                response_list: state.PCISCRM_MASTER_RESPONSE
            }
        },
        masters: {
            response_list: state.PCISCRM_MASTER_RESPONSE,
            action_list: state.PCISCRM_MASTER_ACTION
        }  
    }), 
    {
        GET_MASTER_REGION: getMasterRegionFilter,
        GET_MASTER_AREA: getMasterAreaFilter,
        GET_MASTER_TEAM: getMasterTeamFilter,
        GET_MASTER_EMPS: getMasterEmployeeFilter,
        GET_MASTER_RESPONSE: getMasterResponse,
        GET_MASTER_ACTION: getMasterActionReason
    }
)(LeadNewTopupCtrlWithCookies)