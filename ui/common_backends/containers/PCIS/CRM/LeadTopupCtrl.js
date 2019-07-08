import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'

import { LeadToupUpCtrl } from '../../../Components/PCIS/CRM'

import { app_config } from '../../../components/App/config'
import { config } from '../config'
import { columns } from '../config/columns'

class LeadTopupCtrl extends Component {

    constructor(props) {
        super(props)

        const { cookies } = this.props
        const { cookieConfig } = config        
        const ck_info = cookies.get(cookieConfig.name.authen, { path: cookieConfig.path })

        this.state = {
            authen: (!_.isEmpty(ck_info)) ? ck_info : []
        }
    }

    render() {
       
        return (
            <LeadToupUpCtrl 
                appConfig={app_config}
                config={config}                
                columns={columns}
                authen={this.state.authen}
            />
        )
    }

}

const LeadTopupControllerWithCookies = withCookies(LeadTopupCtrl)
export default connect(
    (state) => ({}), 
    {}
)(LeadTopupControllerWithCookies)