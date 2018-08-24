import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'
import { Table, Icon, Form, Input, Checkbox, Row, Col, Collapse, Modal, Button, Tooltip, Popover } from 'antd'
import Scrollbar from 'react-smooth-scrollbar'
import _ from 'lodash'

import { getBasicInformation, setUpdateReturnCode } from '../../../actions/master'
import { config } from '../config'
import { in_array } from '../config/functional';

import { return_columns, return_hist_columns } from '../config/columns'
import cls from '../style/index.scss'

const { TextArea } = Input
const ButtonGroup = Button.Group
const Panel = Collapse.Panel
const confirm = Modal.confirm

class ReturnDashboard extends Component {

    constructor(props) {
        super(props)

        const { match, GET_BASIC_INFO } = props
        if(match && !_.isEmpty(match.params.ApplicationNo)) {
            GET_BASIC_INFO(match.params.ApplicationNo)
        }   
        
        this.state = {
            return_items: [],
            return_reply: [],
            return_selection: {
                key: null,
                data: [],
                hasReturn: false
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.isOpen !== nextProps.isOpen ||
               this.props.info.basic !== nextProps.info.basic ||
               this.props.recentReturnData !== nextProps.recentReturnData ||
               this.state.return_items !== nextState.return_items ||
               this.state.return_reply !== nextState.return_reply ||
               this.state.return_selection !== nextState.return_selection
    }

    componentWillReceiveProps(props) {
        const { return_items } = this.state
        const { recentReturnData } = props

        // INITIAL DATA STATE
        if(!_.isEmpty(recentReturnData) && _.isEmpty(return_items)) {
            let clone_data = _.clone(recentReturnData, true)
            let return_list = _.filter(clone_data, (v) => { return in_array(v.ReturnStatus, ['2', '3'])  })
            let reply_list = _.filter(recentReturnData, (v) => { return v.ReplyNote !== null &&  v.ReplyNote !== '' })

            // KEY BUNDLE FOR ROW SELECTION
            let return_customize = !_.isEmpty(return_list) ? _.map(return_list, (v) => {
                v.ReplyTo = null
                v.Visible = false
                v.ConfirmSucc = false
                v.Key = v.SysNO
                return v
            }) : []

            this.setState({ return_items: return_customize, return_reply: reply_list })            
        }
        
    }

    handleRowKey = (records, i) => { 
        return (records && records.SysNO) ? `${records.SysNO}` : 0 
    }

    handleRowKeyHist = (records, i) => { 
        return (records && records.ReturnCode) ? `ReturnHist_${records.ReturnCode}_${(i + 1)}` : 0 
    }

    render() {
        const { return_items, return_reply, return_selection } = this.state
        const { isOpen, info: { basic }, handleClose } = this.props

        if(!_.isEmpty(return_items) && return_items.length > 0) {
            _.map(return_items, (data) => {
                let popover_config = {                    
                    title: "REPLY RETURN",
                    trigger:  "click",
                    placement: 'left',
                    visible: data.Visible,
                    content: (
                        <div  style={{ width: '300px' }}>
                            <div>
                                <label className="pa1 ttu">Reply To:</label> 
                                <Input value="RM" disabled={true} />
                            </div>
                            <div className={`${cls['mt1']}`}>
                                <label className="pa1 ttu">Description:</label> 
                                <Input value={data.ReturnDescription} disabled={true} />
                            </div>
                            <div className={`${cls['mt1']}`}>
                                <label className="pa1 ttu">Return Remark:</label> 
                                <TextArea 
                                    value={data.ReturnNote}
                                    maxLength={config.textArea.maxLength}
                                    autosize={config.textArea.autosize}
                                    disabled={true}
                                />
                             </div>
                            <div className={`${cls['mt1']}`}>
                                <label className="pa1 ttu">Reply Remark:</label> 
                                <TextArea 
                                    id={`${data.SysNO}`} 
                                    value={data.ReplyNote}                                    
                                    placeholder="กรุณาระบุรายละเอียด" 
                                    maxLength={config.textArea.maxLength}
                                    autosize={config.textArea.autosize}
                                    onChange={this.handleReplyMessage}
                                />
                            </div>
                            <div className={`${cls['mt2']}`}>
                                <Checkbox value={data.ConfirmSucc} onChange={this.handleConfirmSuccess.bind(this, data)} className="ttu">แก้ไขเรียบร้อย</Checkbox>
                            </div>
                            <div className={`${cls['mt2']}`}>
                                <ButtonGroup>
                                    <Button type="primary" onClick={this.handleSaveReplyNote.bind(this, data)} disabled={(!_.isEmpty(data.ReplyNote) || data.ConfirmSucc) ? false : true}>บันทึกข้อมูล</Button>
                                    <Button onClick={this.handleCancelReplyNote.bind(this, data.SysNO)}>ปิด/ยกเลิกข้อมูล</Button>                                   
                                </ButtonGroup>
                            </div>
                        </div>
                    )
                }
                data.ReplyIcon = (
                    <Popover {...popover_config}>
                        <Icon type="form" className={`${ (data.Visible) ? cls['hide'] : '' } pointer`}  onClick={this.handleVisibleChange.bind(this, data)} />
                        <Icon type="form" className={`${ (!data.Visible) ? cls['hide'] : '' } pointer`} />
                    </Popover>
                )
                return data
            })
        }

        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                let is_return = (selectedRows && selectedRows.length > 0) ? true : false
                this.setState({ 
                    return_selection: _.assign({}, this.setState.return_selection, {
                        key: selectedRowKeys,
                        data: selectedRows,
                        hasReturn: is_return
                    })
                })  
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            })
          }

        return (
            <Modal
                wrapClassName={`${cls['modal_wrapper']} ${cls['modal_toEase90']}`}
                visible={isOpen}
                title={<span className="ttu">Information</span>}
                maskClosable={false}
                onOk={null}
                onCancel={handleClose}
                footer={(<div />)}
                width="80%"
            >
                <Collapse defaultActiveKey="1" className={cls['team_conatainer']}>
                    <Panel key="1" header="Basic Information" className="ttu">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Row gutter={24}>
                                    <Col span={12}><b>Application No</b></Col>
                                    <Col span={12}>{`${(basic && !_.isEmpty(basic.ApplicationNo)) ? basic.ApplicationNo : ''}`}</Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={12}><b>{`${(basic && basic.Onbehalf_Type === 'บุคคลธรรมดา') ? 'ID Card' : 'Business Registration'}`}</b></Col>
                                    <Col span={12}>{`${(basic && !_.isEmpty(basic.ID_Card)) ? basic.ID_Card : ''}`}</Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={12}><b>Customer</b></Col>
                                    <Col span={12}>{`${(basic && !_.isEmpty(basic.BorrowerName)) ? basic.BorrowerName : ''}`}</Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={12}><b>Registration</b></Col>
                                    <Col span={12}>{`${(basic && !_.isEmpty(basic.Onbehalf_Type)) ? basic.Onbehalf_Type : ''}`}</Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row gutter={24}>
                                    <Col span={12}><b>Region</b></Col>
                                    <Col span={12}>{`${(basic && !_.isEmpty(basic.RegionNameEng)) ? basic.RegionNameEng : ''}`}</Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={12}><b>Team</b></Col>
                                    <Col span={12}>{`${(basic && !_.isEmpty(basic.BranchName)) ? basic.BranchName : ''}`}</Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={12}><b>Application Owner</b></Col>
                                    <Col span={12}>{`${(basic && !_.isEmpty(basic.RMName)) ? basic.RMName : ''}`}</Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={12}><b>Mobile</b></Col>
                                    <Col span={12}>{`${(basic && !_.isEmpty(basic.RMMobile)) ? basic.RMMobile : ''}`}</Col>
                                </Row>
                            </Col>
                        </Row>
                    </Panel>
                </Collapse>

                <div className={`${cls['upload_tools']} mt2`}>
                    <div className={cls['tools']}>
                        <h4 className="ttu">Return Arrears Information</h4>
                    </div>
                    <div className={cls['tools']}></div>
                </div>

                <Scrollbar>
                    <div style={{ maxHeight: '300px'}}>
                        <Table
                            className={cls['grid_table']}
                            rowKey={this.handleRowKey}
                            columns={return_columns}
                            dataSource={return_items}
                            rowSelection={rowSelection}
                            size="small"
                            pagination={{
                                size: 'small',
                                pageSize: 50,
                            }}
                            bordered
                        />
                    </div>
                </Scrollbar>

                <div className={`${cls['upload_tools']} mt2`}>
                    <div className={cls['tools']}></div>
                    <div className={cls['tools']}>
                        <ButtonGroup>
                            <Button type="primary" disabled={true} disabled={!return_selection.hasReturn}>
                                ส่งงานกลับ <Icon type="mail" className="f5" />
                            </Button>
                        </ButtonGroup>
                    </div>
                </div>

                <Collapse bordered={false} defaultActiveKey={[]} className={`${cls['collapse_hist_conainer']}`}>
                    <Panel header="Return History" key="1" className="ttu">
                        <Scrollbar>
                            <div style={{ maxHeight: '300px'}}>
                                <Table
                                    className={cls['grid_table']}
                                    rowKey={this.handleRowKeyHist}
                                    columns={return_hist_columns}
                                    dataSource={return_reply}
                                    size="small"
                                    pagination={{
                                        size: 'small',
                                        pageSize: 50,
                                    }}
                                    bordered
                                />
                            </div>
                        </Scrollbar>
                    </Panel>
                </Collapse>

            </Modal>
        )
    }

    handleVisibleChange = (data) => {
        let return_code = _.clone(this.state.return_items, true)
        if(!_.isEmpty(data)) {
            let updateVisible = _.assign({}, data, { Visible: !data.Visible })           
            _.set(return_code, _.findIndex(return_code, { SysNO: data.SysNO }), updateVisible)

            this.setState({ return_items: return_code })
        }
    }

    handleCancelReplyNote = (sysno) => {
        const { recentReturnData } = this.props
        
        let recent_return = _.clone(recentReturnData, true)
        let return_list = _.filter(recent_return, (v) => { return in_array(v.ReturnStatus, ['2', '3'])  })

        let findData = _.filter(return_list, { SysNO: sysno })[0]

        if(!_.isEmpty(findData)) {
            let updateNote = _.assign({}, findData, { ReplyNote: null, Visible: false })           
            _.set(return_list, _.findIndex(return_list, { SysNO: sysno }), updateNote)

            this.setState({ return_items: return_list })
        }   
        
    }

    handleReplyMessage = (e) => {
        let sysno = parseInt(e.target.id)
        let return_code = _.clone(this.state.return_items, true)
        let findData = _.filter(this.state.return_items, { SysNO: sysno })[0]

        if(!_.isEmpty(findData)) {
            let updateNote = _.assign({}, findData, { ReplyNote: e.target.value })           
            _.set(return_code, _.findIndex(return_code, { SysNO: sysno }), updateNote)

            this.setState({ return_items: return_code })
        }     
    }

    handleConfirmSuccess = (data, e) => {
        let return_code = _.clone(this.state.return_items, true)
        let findData = _.filter(this.state.return_items, { SysNO: data.SysNO })[0]

        if(!_.isEmpty(findData)) {
            let updateNote = _.assign({}, findData, { ConfirmSucc: e.target.checked })           
            _.set(return_code, _.findIndex(return_code, { SysNO: data.SysNO }), updateNote)

            this.setState({ return_items: return_code })
        }     
    }

    handleSaveReplyNote = (data) => {
        const { authen } = this.props
        if(!_.isEmpty(data.ReplyNote) || data.ConfirmSucc) {

            const employee_code = (!_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null
            const employee_name = (!_.isEmpty(authen.Auth)) ? authen.Auth.EmpName_TH : null

            let request_data = _.map(data_create, (v) => {
                return {
                    SysNO: v.SysNO,
                    ApplicationNo: v.ApplicationNo,
                    Status: (v.ConfirmSucc) ? 4 : v.Status, 
                    ReturnCode: v.ReturnCode,
                    ReturnStatus: v.ReturnStatus,
                    ReturnReasonCode: v.ReturnReasonCode,
                    Note: v.Note,
                    ReturnNote: v.ReturnNote,
                    ReplyNote: v.ReplyNote,
                    UpdateBy: employee_code,
                    UpdateByName: (!_.isEmpty(employee_name)) ? employee_name.replace('+', ' ') : employee_name
                }
            })    

            // "SysNO": 1,
            // "ApplicationNo":"02-61-002856",
            // "ReturnCode":"RE003",
            // "Status":"MISSING",
            // "Note":"test note from postman",
            // "ReturnNote":"test update note from postman",
            // "ReplyNote":"test update reply note from postman",
            // "UpdateBy":"58385",
            // "UpdateByName":"เจนวิทย์ เลิศสินอธิชัย"

            console.log(data)
        } else {
            notification.warning({
                message: 'ข้อมูลไม่ถูกต้อง',
                description: 'โปรดตรวจสอบข้อมูลใหม่อีกครั้ง เนื่องจากไม่',
            })
        }
        
    }

}

const ReturnDashboardWithCookies = withCookies(ReturnDashboard)
const ReturnDashboardManagement = Form.create()(ReturnDashboardWithCookies)
export default connect(
    (state) => ({
        info: {
            basic: (state.DOCUMENTSCAN_GET_BAISCINFO && state.DOCUMENTSCAN_GET_BAISCINFO.Status) ? state.DOCUMENTSCAN_GET_BAISCINFO.Data[0]: []
        }
    }),
    {
        GET_BASIC_INFO: getBasicInformation,
        SET_UPDATE_RETURN: setUpdateReturnCode
    }
)(ReturnDashboardManagement)

