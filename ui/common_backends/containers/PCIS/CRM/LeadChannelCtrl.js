import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'
import bluebird from 'bluebird'

import { GridChannel } from '../../../Components/PCIS/CRM'
import {
    getMasterRegionFilter,
    getMasterAreaFilter,
    getMasterTeamFilter,
    getMasterEmployeeFilter

} from '../../../actions/pcis'

import { app_config } from '../../../components/App/config'
import { config } from '../config'
import { columns } from '../config/columns'
import { notification, Icon } from 'antd'

class LeadChannelCtrl extends Component {

    constructor(props) {
        super(props)

        const { cookies } = this.props
        const { cookieConfig } = config        
        const ck_info = cookies.get(cookieConfig.name.authen, { path: cookieConfig.path })

        this.state = {
            authen: (!_.isEmpty(ck_info)) ? ck_info : []
        }

    }

    componentDidMount() {
        const { cookies } = this.props

        let msg_notice = cookies.get('lead_channel_notice')
        if(!msg_notice) {
            notification.info({
                message: 'แจ้งเตือนจากระบบ',
                description: (
                    <div>
                        กรณีมีลูกค้าสนใจสินเชื่อและต้องการเข้ากระบวนการขอสินเชื่อ สามารถสร้างข้อมูลลูกค้าในระบบ PCIS ได้ 
                        โดยการเปิด <Icon type="desktop" /> CUSTOMER PROFILE ของลูกค้าและเลือกสร้างข้อมูลโดยการกดคลิกที่&nbsp;
                        <span style={{ backgroundColor: '#4682b4', color: '#FFF', padding: '0 5px', textAlign: 'center', borderStyle: 'dashed' }}>CREATE</span>  
                        &nbsp;เพื่อสร้าง Profile ของลูกค้าที่ PCIS P1
                    </div>
                ),
                duration: 20,
                placement: 'bottomRight'
            })
            cookies.set('lead_channel_notice', 1, { path: '/' })
        }

    }

    render() {
        const { masters } = this.props
       
        return (
            <GridChannel 
                appConfig={app_config}
                config={config}                
                columns={columns.grid_channelv2}
                lead_columns={columns.crm_leadsummary}
                gridData={[]}
                masterData={masters}
                authen={this.state.authen}
            />
        )
    }

}

const LeadChannelControllerWithCookies = withCookies(LeadChannelCtrl)
export default connect(
    (state) => ({
        masters: {
            region: state.PCIS_MASTER_REGION,
            area: state.PCIS_MASTER_AREA,
            team: state.PCIS_MASTER_TEAM,
            emps: state.PCIS_MASTER_EMPLOYEE
        }
    }), 
    {
        GET_MASTER_REGION: getMasterRegionFilter,
        GET_MASTER_AREA: getMasterAreaFilter,
        GET_MASTER_TEAM: getMasterTeamFilter,
        GET_MASTER_EMPS: getMasterEmployeeFilter
    }
)(LeadChannelControllerWithCookies)