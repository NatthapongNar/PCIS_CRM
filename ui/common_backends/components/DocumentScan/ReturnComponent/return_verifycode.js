import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs, Table, Modal, Input, Select, Button, Popover, Icon, notification } from 'antd'
import _ from 'lodash'

import { setDocumentReturnVerify, setCreateReturnCode, setCreateResponeReturnCode } from '../../../actions/master'
import { config } from '../config'
import { return_job_columns, document_checklist_columns } from '../config/columns'
import cls from '../style/index.scss'
import { in_array } from '../config/functional';

const { TextArea } = Input
const Option = Select.Option
const TabPane = Tabs.TabPane
const ButtonGroup = Button.Group
const confirm = Modal.confirm

class ReturnCodeVerify extends Component {

    state = {
        tab_mode: 1,
        isUpdate: false
    }

    componentWillReceiveProps(props) {
        if(!_.isEmpty(props)) {
            const { isUpdate } = this.state
            if(isUpdate) {
                const { resp } = props
                if(resp[0] && !_.isEmpty(resp[0].return_code)) {
                    props.SET_CREATE_RETURNCODE_RESPONSE(resp[0].return_code)
                    this.setState({ isUpdate: false })
                }            
            }            
        }
    }

    render() {
        const { tab_mode } = this.state
        const { 
            isOpen, 
            data, 
            masters: { return_reason },
            handleClose

        } = this.props

        let data_returncode = _.filter(data[0].return_code, (v) => { 
            if(v.SysNO === null) {
                return (in_array(v.ReturnStatus, ['2', '3'])) 
            }           
        })

        let popover_info_config = {                    
            title: "ICON INFORMATION",
            trigger:  "hover",
            placement: 'left',
            content: (
                <div>
                    <div><Icon type="check" className="green f5" /> Completed</div>
                    <div><Icon type="close" className="red f5" /> Incompleted</div>
                    <div><Icon type="file-unknown" className="silver f5" /> Not Found</div>
                    <div>&nbsp;&nbsp;&nbsp; No Action</div>
                </div>
            )
        }
      
        if(!_.isEmpty(data_returncode) && data_returncode.length > 0) {
            _.map(data_returncode, (data) => {
                let popover_config = {                    
                    title: "UPDATE INFORMATION",
                    trigger:  "click",
                    placement: 'left',
                    content: (
                        <div>
                            <div>
                                <label className={`${cls['w100']} pa1 ttu`}>Return Reason:</label> 
                                <Select 
                                    defaultValue=""
                                    value={data.ReturnReasonCode} 
                                    className={`${cls['w100']}`} 
                                    disabled={(data.ReturnStatus == 3) ? true : false}
                                    onChange={this.handleUpdateReason.bind(this, data.ReturnCode)}
                                >
                                    <Option value="">โปรดเลือก</Option>
                                    {
                                        (data.ReturnStatus == 3) && _.map(_.filter(return_reason, (o) => { return o.ReturnReasonDescription == 'Not Found' }), (v, k) => {
                                            return (<Option key={`${v.ReturnReasonDescription}_${(k + 1)}`} value={v.ReturnReasonCode}>{v.ReturnReasonDescription}</Option>)
                                        })
                                    }
                                    {
                                        (data.ReturnStatus == 2) && _.map(_.filter(return_reason, (o) => { return o.ReturnReasonDescription !== 'Not Found' }), (v, k) => {
                                            return (<Option key={`${v.ReturnReasonCode}${(k + 1)}`} value={v.ReturnReasonCode}>{v.ReturnReasonDescription}</Option>)
                                        })
                                    }
                                </Select>
                            </div>
                            <div>
                                <label className="pa1 ttu">Recent Remark:</label> 
                                <TextArea 
                                    id={`${data.ReturnCode}`} 
                                    value={data.ReturnNote}                                    
                                    placeholder="กรุณาระบุรายละเอียด" 
                                    maxLength={config.textArea.maxLength}
                                    autosize={config.textArea.autosize}
                                    onChange={this.handleUpdateRemark}
                                />
                            </div>
                        </div>
                    )
                }
                data.Edit = (<Popover {...popover_config}><Icon type="form" className="pointer"/></Popover>)
                data.Delete = (<Icon type="delete" className="pointer" onClick={this.handleDeleteReturnCode.bind(this, data)} />)
                return data
            })
        }
        
        //let data_completed_code = _.filter(data[0].return_code, (v) => { return v.Status === 1 })'

        return (
            <Modal
                wrapClassName={`${cls['modal_wrapper']} ${cls['modal_tonav']}`}
                visible={isOpen}
                title={<span className="ttu">Return Code Verification</span>}
                maskClosable={false}
                onOk={null}
                onCancel={handleClose}
                footer={this.getFooter()}
                width={(tab_mode == 1) ? '50%':'70%'}
            >  
                <Tabs type="card" animated={true} onChange={this.onTabActiveKeyChange}>
                    <TabPane tab="RETURN ONLY" key="1">
                        <div className={`${cls['upload_tools']} mt2`}>
                            <div className={cls['tools']}>
                                <h4 className="ttu">Return Code Report</h4>
                            </div>
                            <div className={cls['tools']}></div>
                        </div>
                        <Table
                            className={cls['grid_table']}
                            rowKey={this.handleRowKey}
                            columns={return_job_columns}
                            dataSource={data_returncode}
                            size="small"
                            pagination={{ size: 'small', pageSize: 15  }}
                            bordered
                        />
                    </TabPane>
                    <TabPane tab="OVERVIEWS" key="2">
                        <div className={`${cls['upload_tools']} mt2`}>
                                <div className={cls['tools']}>
                                    <h4 className="ttu">Document Checklist</h4>
                                </div>
                                <div className={cls['tools']}>
                                    <Popover {...popover_info_config}>
                                        <Button type="primary" shape="circle" icon="info" size="small" />
                                    </Popover>
                                </div>
                            </div>
                            <Table
                                className={cls['grid_table']}
                                rowKey={this.handleHistRowKey}
                                columns={document_checklist_columns}
                                dataSource={data[0].return_code}
                                size="small"
                                pagination={{ size: 'small', pageSize: 15  }}
                                bordered
                            />
                    </TabPane>
                </Tabs>
            </Modal>
        )
    }

    getFooter = () => {
        const { tab_mode } = this.state
        return (
            <div className={`${cls['division_half_container']} ${(in_array(tab_mode, [2])) && cls['hide']}`}>
                <div className={`${cls['division_items']} tl`}>
                    <Button type="primary" size="default" className="ttu" onClick={this.props.handleClose}>
                        <Icon type="close" className="f5" />ปิด
                    </Button>
                </div>
                <div className={cls['division_items']}>
                    <ButtonGroup size="default">
                        <Button type="dashed" className="ttu" onClick={this.handleCancelReturnCode}>
                            <Icon type="delete" className="f5" />ยกเลิกข้อมูล
                        </Button>
                        <Button type="primary"  className="ttu" onClick={this.handleSaveReturnCode}>
                            บันทึกข้อมูล<Icon type="save" className="f5" />
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        )
    }

    handleRowKey = (records, i) => { 
        return (records && records.SysNo) ? `${records.ReturnCode}_${(!_.isEmpty(records.SysNo)) ? records.SysNo : (i)}_${(i + 1)}` : (i * i)
    }

    handleHistRowKey = (records, i) => { 
        return (records && records.CategoryCode) ? `${records.CategoryCode}_${(i + 1)}` : 0 
    }

    
    handleUpdateReason = (id, val) => {
        const { data, masters: { return_reason } } = this.props

        let return_list = data[0].return_code
        let findData = _.filter(return_list, { ReturnCode: id })[0]
        let master_reason = _.filter(return_reason, { ReturnReasonCode: val })[0]
    
        if(!_.isEmpty(findData)) {
            let return_code = _.clone(return_list, true)
            let updateNote = _.assign({}, findData, { ReturnReasonCode: val, ReturnReasonDescription: master_reason.ReturnReasonDescription })           
            _.set(return_code, _.findIndex(return_code, { ReturnCode: id }), updateNote)

             this.handleUpdateCommit(return_code)
        } 
    }

    handleUpdateRemark = (e) => {
        const { data } = this.props
        let return_list = data[0].return_code

        if(!_.isEmpty(return_list)) {            
            let return_code = _.clone(return_list, true)
            let findData = _.filter(return_list, { ReturnCode: e.target.id })[0]

            if(!_.isEmpty(findData)) {
                let updateNote = _.assign({}, findData, { ReturnNote: e.target.value })           
                _.set(return_code, _.findIndex(return_code, { ReturnCode: e.target.id }), updateNote)

                this.handleUpdateCommit(return_code)
            }
        }
    }

    handleDeleteReturnCode = (val) => {
        const { data } = this.props
        let return_list = data[0].return_code
        let commit = this.handleUpdateCommit

        confirm({
            title: 'คุณต้องการลบข้อมูลรายการนี้?',
            content: (<div>กรุณายืนยันการลบข้อมูล กรณียืนยันการลบข้อมูล<br/>โปรดคลิก OK หรือ Cancel เพื่อยกเลิก</div>),
            onOk() {
                if(!_.isEmpty(return_list)) {            
                    let return_code = _.clone(return_list, true)
                    let findData = _.filter(return_list, { ReturnCode: val.ReturnCode })[0]

                    if(!_.isEmpty(findData)) {
                        let updateNote = _.assign({}, findData, { Note: null, ReturnNote: null, ReturnStatus: null })           
                        _.set(return_code, _.findIndex(return_code, { ReturnCode: val.ReturnCode }), updateNote)

                        notification.success({
                            message: 'ระบบลบรายการคืนงานสำเร็จ',
                            description: 'ระบบลบรายการคืนงานสำเร็จ โปรดตรวจสอบข้อมูลใหม่อีกครั้ง',
                        })

                        commit(return_code)
                    }
                }
            },
            onCancel() {}
        })

    }

    handleCancelReturnCode = () => {
        const { data, handleClose } = this.props
        let commit = this.handleUpdateCommit
        let return_list = data[0].return_code

        confirm({
            title: 'คุณต้องการยกเลิกการทำข้อมูลนี้?',
            content: (<div>กรุณายืนยันการยกเลิกข้อมูล กรณียืนยันโปรดคลิก OK หรือ Cancel เพื่อยกเลิก</div>),
            onOk() {
                if(!_.isEmpty(return_list)) {            
                    let return_code = _.clone(return_list, true)
                    let result_return = _.map(return_code, (data) => { 
                        data.ReturnStatus = null
                        data.Note = null
                        data.ReturnNote = null
                        return data
                    })  

                    notification.success({
                        message: 'ระบบยกเลิกรายการคืนงานสำเร็จ',
                        description: 'ระบบยกเลิกรายการคืนงานสำเร็จ โปรดตรวจสอบข้อมูลใหม่อีกครั้ง',
                    })

                    commit(result_return)
                    handleClose()
                }
            },
            onCancel() {}
        })

    }

    handleSaveReturnCode = () => {
        const { authen, data, match: { params }, handleClose, CREATE_RETURNCODE } = this.props
    
        const appno = params.ApplicationNo
        const employee_code = (!_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null
        const employee_name = (!_.isEmpty(authen.Auth)) ? authen.Auth.EmpName_TH : null

        const return_list = _.filter(data[0].return_code, (v) => { return v.ReturnStatus !== null })
        let data_create = _.filter(return_list, (v) => { return v.SysNo == null })
        let data_change = _.filter(return_list, (v) => { })

        let return_group_verify = _.filter(return_list, (v) => { return in_array(v.ReturnStatus, [2, 3]) && v.ReturnType == "M" && v.ReturnReasonCode == null })
        if(!_.isEmpty(return_group_verify) && return_group_verify.length > 0) {

            notification.error({
                duration: 5,
                message: 'ข้อมูลไม่ครบถ้วน',
                description: (<div>ขออภัย! ท่านระบุข้อมูลไม่ครบ กรุณาตรวจสอบข้อมูลใหม่อีกครั้ง<br/><br/><Icon type="bulb" style={{ color: '#faad14' }} /> TIP: โปรดตรวจสอบเหตุผลของการ Return ระบุครบถ้วนหรือไม่</div>),
            })

        } else {
            this.setState({ isUpdate: true })

            confirm({
                title: 'คุณต้องการบันทึกข้อมูลนี้?',
                content: (<div>กรุณายืนยันการตรวจสอบข้อมูล กรณียืนยัน<br/>โปรดคลิก OK หรือ Cancel เพื่อยกเลิก</div>),
                onOk() {

                    if(!_.isEmpty(data_create)) {
                        let request_data = _.map(data_create, (v) => {
                            return {
                                ApplicationNo: appno,
                                ReturnCode: v.ReturnCode,
                                ReturnStatus: v.ReturnStatus,
                                ReturnReasonCode: v.ReturnReasonCode,
                                Note: v.Note,
                                ReturnNote: v.ReturnNote,
                                CreateBy: employee_code,
                                CreateByName: (!_.isEmpty(employee_name)) ? employee_name.replace('+', ' ') : employee_name
                            }
                        })    
                        CREATE_RETURNCODE(appno, request_data)
                    }

                    handleClose()
                },
                onCancel() {}
            })
        }

    }

    handleUpdateCommit = (return_code) => {
        const { SET_VERIFY_RETURNCODE } = this.props
        SET_VERIFY_RETURNCODE(return_code)
    }

    onTabActiveKeyChange = (activeKey) => {
        this.setState({ tab_mode: activeKey });
    }

}


export default connect(
    (state) => ({
        data: [{
            return_code: (state.DOCUMENTSCAN_RETURNCODE_VERIFY && state.DOCUMENTSCAN_RETURNCODE_VERIFY.Status) ? state.DOCUMENTSCAN_RETURNCODE_VERIFY.Data: []
        }],
        resp: [{
            return_code: (state.CREATE_RETURNCODE_BUNDLE && state.CREATE_RETURNCODE_BUNDLE.Status) ? state.CREATE_RETURNCODE_BUNDLE.Data: []
        }]
    }),
    {
        SET_VERIFY_RETURNCODE: setDocumentReturnVerify,  
        SET_CREATE_RETURNCODE_RESPONSE: setCreateResponeReturnCode,      
        CREATE_RETURNCODE: setCreateReturnCode        
    }
)(ReturnCodeVerify)