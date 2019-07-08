import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal } from 'antd'
import _ from 'lodash'

import cls from '../../styles/pcis_style.scss'

class GridChannelCustProfile extends Component {

    render() {
        const { isOpen, data, handleClose } = this.props

        let owner_code  = (data && !_.isEmpty(data)) ? data.SaleCode : ''
        let branch_code = (data && !_.isEmpty(data)) ? data.TeamCode : ''
        let is_owner    = (data && !_.isEmpty(data.IsOwner)) ? data.IsOwner : ''
        let custname    = (data && !_.isEmpty(data.CustomerName)) ? data.CustomerName : ''
        let corpname    = (data && !_.isEmpty(data.CompanyName)) ? data.CompanyName : ''
        let custmobile  = (data && data.Tel) ? _.padStart(data.Tel, 10, '0').trim() : ''
        let custhome    = (data && data.TelHome) ? data.TelHome : ''
        let sourceCode  = (data && !_.isEmpty(data.ApplicationNo)) ? data.ApplicationNo : ''
        let sourceChannel  = 'Loan Top Up'//(data && !_.isEmpty(data.SourceChannel)) ? data.SourceChannel : ''

        let pcis_url = 'http://tc001pcis1p:8099'// (process.env.NODE_ENV === 'production') ? 'http://tc001pcis1p:8099' : 'http://localhost'
                
        let qs = `?eid=${owner_code}&br=${branch_code}&owner=${is_owner}&cth=${custname}&corp=${corpname}&mno=${(custmobile && !_.isEmpty(custmobile)) ? custmobile : custhome}&sid=${sourceCode}&sch=${sourceChannel}`

        return (
            <Modal
                wrapClassName={`${cls['modal_container']}`}
                visible={isOpen}
                title={null}
                maskClosable={false}
                onOk={null}
                onCancel={handleClose}
                footer={null}
                width="100%"
            >
                <div style={{ height: '100%', width: '100%', display: 'flex' }}>
                    <iframe 
                        id="pcis_form"
                        src={`${pcis_url}/pcis/index.php/create_data/profile${qs}`} 
                        className={cls['iframe']}
                        frameBorder="0"
                        marginHeight="0"
                        style={{ width: '100%', flex: 1 }}
                    />
                </div>                
            </Modal>
        )
    }

}

export default GridChannelCustProfile