import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'
import bluebird from 'bluebird'

import { App } from '../../Components/PCIS'

import { 
    getMasterResponse,
    getMasterActionReason,
    getLeadTopUpByPCISCRM
    
} from '../../actions/pcis'

import { app_config } from '../../components/App/config'
import { config } from './config'
import { columns } from './config/columns'

class PCIS extends Component {

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
        const { authen: { Session } } = this.state
        const { GET_DATA_LEADTOPUP, GET_MASTER_RESPONSE, GET_MASTER_ACTION } = this.props

        const API_LIST_CALL = [
            GET_DATA_LEADTOPUP,
            GET_MASTER_RESPONSE,
            GET_MASTER_ACTION
        ]

        const params = {
            AuthCode: (Session && !_.isEmpty(Session.sess_empcode)) ? Session.sess_empcode : null
        }

        bluebird.all(API_LIST_CALL).each((fn, i) => {
            switch (i) {
                case 0:
                    fn(params)
                break
                default: 
                    fn()
                break 
            }
            
        })

    }

    render() {
        const { GET_DATA_LEADTOPUP  } = this.props
        return (
            <App 
                appConfig={app_config}
                config={config}                
                columns={columns}
                authen={this.state.authen}
                master={this.props.master}
                gridData={this.props.grid}
                fnCall={{
                    getLeadTopUp: GET_DATA_LEADTOPUP
                }}                
            />
        )
    }

}

const PCISAppWithCookies = withCookies(PCIS)
export default connect(
    (state) => ({
        grid: {
            CRM: {
                leadTopUp: state.PCISCRM_LEADTOPUP_DASHBOARD
            }
        },
        master: {
            response_list: state.PCISCRM_MASTER_RESPONSE,
            action_list: state.PCISCRM_MASTER_ACTION
        }
    }), 
    {
        GET_DATA_LEADTOPUP: getLeadTopUpByPCISCRM,
        GET_MASTER_RESPONSE: getMasterResponse,
        GET_MASTER_ACTION: getMasterActionReason
    }
)(PCISAppWithCookies)