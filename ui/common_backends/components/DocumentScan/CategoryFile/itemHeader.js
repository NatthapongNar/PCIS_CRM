import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Radio,Tag, Icon, Button, Badge, Tooltip } from 'antd'

import ReturnCodeVerify from '../ReturnComponent/return_verifycode'
import ReturnDashboard from '../ReturnComponent/grid_returncode'

import { in_array } from '../config/functional';
import cls from './header.scss'

const ButtonGroup = Button.Group
const RadioGroup = Radio.Group

const department_config = [
    { label: (<Tag color="gold">RM</Tag>), value: 'RM', disabled: true },
    { label: (<Tag color="cyan">CA Admin</Tag>), value: 'CAAdmin', disabled: true },
    { label: (<Tag color="blue">CA</Tag>), value: 'CA', disabled: true },
    { label: (<Tag color="red">AP</Tag>), value: 'AP', disabled: true }
  ]

class CategoryFileHeader extends Component {

    state = {
        verify: {
            enable: false,
            checkpass: false
        },
        verifyPass: false,
        modal: {
            modal_verify: false,
            return_dahsboard: false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.authen !== nextProps.authen ||
               this.props.masters !== nextProps.masters ||
               this.props.recentReturnData !== nextProps.recentReturnData ||
               this.state.modal.modal_verify !== nextState.modal.modal_verify ||
               this.state.modal.return_dahsboard !== nextState.modal.return_dahsboard ||
               this.state.verify !== nextState.verify
    }

    componentWillReceiveProps(props) {
        const { return_code } = props.data[0]
        if(!_.isEmpty(return_code) && return_code.length > 0) {
            this.setState({ verify: _.assign({}, this.state.verify, { enable: true }) })
        }
        
    }

    render() {
        const { authen, match, masters, recentReturnData } = this.props
        const { verify, modal } = this.state

        let data_returncode = (!_.isEmpty(recentReturnData)) ? _.filter(recentReturnData, (v) => { return in_array(v.ReturnStatus, ['2', '3'])  }) : []

        return (
            <div className={cls['header_container']}>
                <div className={cls['header_item']}>
                    <Link to="/documentscan/Document">
                        <Button type="primary" shape="circle" icon="rollback" />
                    </Link>
                </div>
                <div className={cls['header_item']}>     

                    <span className={`${cls['department_group']}`}>  
                        <span className="ttu mr3">Filter :</span>
                        <RadioGroup options={department_config} />
                    </span>
                
                    <span className="mr3" onClick={this.handleReturnDashboardModal}>   
                        <Tooltip title="รายการคืนงาน" placement="left">
                            <Badge count={data_returncode.length} showZero>                            
                                <Button type="primary" shape="circle" icon="notification" />  
                            </Badge>
                        </Tooltip>    
                    </span>
                    <ButtonGroup size="small">
                        <Button type="primary" onClick={this.handleVerifyModal} disabled={!verify.enable}>
                            <Icon type="search" />ตรวจสอบข้อมูล
                        </Button>
                        <Button type="primary" className="ttu" disabled={!verify.checkpass}>
                            <Icon type="check-square-o" />ส่งเอกสาร
                        </Button>
                    </ButtonGroup>
                </div>

                <ReturnCodeVerify 
                    authen={authen}
                    match={match}
                    isOpen={modal.modal_verify}
                    masters={masters}
                    handleClose={this.handleVerifyModal}
                />

                <ReturnDashboard
                    authen={authen}
                    match={match}
                    isOpen={modal.return_dahsboard}
                    recentReturnData={recentReturnData}
                    handleClose={this.handleReturnDashboardModal}
                />

            </div>
        )
    }

    handleVerifyModal = () => {
        this.setState({ modal: _.assign({}, this.state.modal, { modal_verify: !this.state.modal.modal_verify}) })
    }

    handleReturnDashboardModal = () => {
        this.setState({ modal: _.assign({}, this.state.modal, { return_dahsboard: !this.state.modal.return_dahsboard}) })
    }

}

export default connect(
    (state) => ({
        data: [{
            return_code: (state.DOCUMENTSCAN_RETURNCODE_VERIFY && state.DOCUMENTSCAN_RETURNCODE_VERIFY.Status) ? state.DOCUMENTSCAN_RETURNCODE_VERIFY.Data: []
        }]
    }),
    {}
)(CategoryFileHeader)