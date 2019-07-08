import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'
import { Row, Col, Popover, Modal, Icon, Form, Select, Radio, Button, Checkbox, Tooltip, notification  } from 'antd'
import { getFindEmpInArea, assignApplicationNewOwner } from '../../../actions/pcis'
import {} from '../../../containers/PCIS/config/funcitonal'
import _ from 'lodash'

const FormItem = Form.Item
const Option = Select.Option
const ButtonGroup = Button.Group
const confirm = Modal.confirm

import cls from '../styles/pcis_style.scss'

class GridChannelAssignment extends Component {

    constructor(props) {
        super(props)

        const { cookies } = props
        const cookieData = cookies.get('authen_info', { path: '/' })

        this.state = {
            authen: (!cookieData) ? { Session: [] } : cookieData,
            assignForm: {
                visible: false
            },
            appOwnerEnable: false,
            confirmAppOwner: false
        }

    }

    render() {
        const { assignForm } = this.state
        const { employee_list  } = this.props
        const { getFieldDecorator, getFieldValue } = this.props.form
 
        let checkConfirm = getFieldValue('CheckConfirm')

        const content = (
            <div style={{ width: '200px' }}>
                <Form className={`${cls['modal_form_container']}`} onSubmit={this.handleAssignSubmit}>
                    <div className={cls['ma0']} style={{ fontWeight: '600', fontSize: '0.85em' }}>เลือกเจ้าหน้าที่ผู้ดูแลข้อมูล</div>
                    <FormItem className={cls['form_item']}>
                        {
                            getFieldDecorator('Employee', {})
                            (
                                <Select size="small" onChange={this.handleSelectAppOwner}>
                                    <Option key={0} value={null}>--- โปรดเลือก ---</Option>
                                    {
                                        (employee_list && employee_list.Status && employee_list.Data.length > 0) &&
                                        _.map(employee_list.Data, (v) => {
                                            return (<Option key={v.EmployeeCode} value={v.EmployeeCode}>{`${v.FullNameTh} ${(v.ZoneValue) ? `(Period: ${v.WorkPeriod})` : ''}`}</Option>)
                                        })
                                    }
                                </Select>
                            )
                        }
                    </FormItem>     
                    <FormItem className={cls['form_item']} style={{ maxHeight: '30px', marginTop: '-13px' }}>
                        {
                            getFieldDecorator('CheckConfirm', {})
                            (
                                <Checkbox checked={this.state.confirmAppOwner} onChange={this.onCheckboxChange} size="small" disabled={!this.state.appOwnerEnable}>
                                    <span style={{ fontSize: '0.85em', color: 'gray' }}>เช็ค <i className="fa fa-check" /> เพื่อยืนยันความถูกต้อง</span>
                                </Checkbox>                                
                            )
                        }
                    </FormItem>
                    <FormItem className={cls['form_item']}>
                        <Row>
                            <Col span={24}>
                                <ButtonGroup className="fr" size="small">
                                    <Button className="ttu" onClick={this.handleCancel}>Cancel</Button>
                                    <Button className="ttu" type="primary" htmlType="submit" disabled={!checkConfirm}>Assignment</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </FormItem>               
                </Form>
            </div>
        )

        return ( 
            <div>
                <Popover visible={assignForm.visible} content={content} trigger="click" placement="right" onClick={this.handleOpen}>
                    <Tooltip placement="right" title={`รอเลือกเจ้าหน้าที่ผู้ดูแลข้อมูล`}>
                        <div>
                            <i className="fa fa-user-plus pointer" aria-hidden="true"></i>
                        </div>
                    </Tooltip>               
                </Popover>
            </div>
        )
    }

    handleSelectAppOwner = (data) => {
        if(data) {
            this.setState({ appOwnerEnable: true })
        } else {
            this.setState({ appOwnerEnable: false })
        }
    }

    handleOpen = () => {
        const { data } = this.props
        const { authen, LOAD_EMPLOYEE_CUSTAREA } = this.props
        
        let is_transfer = (data && data.IsTransfer == "Y") ? true : false
        if(is_transfer) {
            let auth_data = (authen && !_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null
            let transfer_newcode = (data && data.TransferAt) ? data.TransferAt : null

            let requestData = {
                AuthCode: auth_data,
                TeamCode: transfer_newcode
            }

            LOAD_EMPLOYEE_CUSTAREA(requestData)
        }
     
        this.setState({ assignForm: _.assignIn({}, this.state.assignForm, { visible: true }) })
    }

    onCheckboxChange = (e) => {
        if(e.target.checked) {
            confirm({
                title: 'แจ้งเตือนจากระบบ',
                content: 'กรุณายืนยันการเลือกข้อมูล',
                onOk: () => {
                    this.setState({ confirmAppOwner: e.target.checked })
                },
                onCancel: () => {},
                width: '270px'
            })        
        } else {
            this.setState({ confirmAppOwner: e.target.checked })
        }
        
        
    }

    handleCancel = () => {
        confirm({
            title: 'แจ้งเตือนจากระบบ',
            content: 'ยืนยันการยกเลิกใช่หรือไม่?',
            onOk: () => {
                this.props.form.resetFields()
                this.setState({ 
                    assignForm: _.assignIn({}, this.state.assignForm, { visible: false }), 
                    appOwnerEnable: false,
                    confirmAppOwner: false 
                })
            },
            onCancel: () => {},
            width: '270px'
        })        
    }

    handleAssignSubmit = (e) => {
        e.preventDefault()
        
        const { authen, data, handleLoadTrigger, ASSIGNMENT_NEWOWNER } = this.props

        this.props.form.validateFields((err, fieldsValue) => {
            if (!err) {

                let auth_code = (authen && !_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null
                let auth_name = (authen && !_.isEmpty(authen.Auth)) ? (authen.Auth.EmpName_TH).replace('+', ' ') : null

                let requestData = {
                    ReferID: (data && !_.isEmpty(data.RabbitFinanceID)) ? data.RabbitFinanceID : null,
                    AssignID: (fieldsValue && fieldsValue.CheckConfirm && fieldsValue.Employee) ? `${fieldsValue.Employee}` : null,
                    AssignByID: auth_code,
                    AssignByName: auth_name
                }

                if(requestData && requestData.AssignID) {
                    let UPDATE_NEWOWNER_APPL = ASSIGNMENT_NEWOWNER
                    let RELOAD_GRID = handleLoadTrigger
                    confirm({
                        title: `แจ้งเตือนจากระบบ`,
                        content: 'กรุณายืนยันการบันทึกข้อมูล กรณียืนยันคลิก OK หรือ Cancel เพื่อยกเลิก',
                        onOk: () => { 
                            UPDATE_NEWOWNER_APPL(requestData)
                            this.props.form.resetFields()
                            this.setState({ 
                                assignForm: _.assignIn({}, this.state.assignForm, { visible: false }), 
                                appOwnerEnable: false,
                                confirmAppOwner: false 
                            })
                            RELOAD_GRID()
                        },
                        onCancel: () => {}
                    })

                } else {
                    notification.error({ message: 'แจ้งเตือนจากระบบ', description: 'เกิดข้อผิดพลาดในการเลือกผู้ดูแลข้อมูล กรุณาติดต่อผู้ดูแลระบบ 3618/3637' })
                }

                

            }
        })

    }

}

const GridChannelAssignmentWrapper = withCookies(GridChannelAssignment)
const GridFormAssignment = Form.create()(GridChannelAssignmentWrapper)
export default connect(
    (state) => ({
        employee_list: state.PCISCRM_FIND_EMPLOYEE_IN_CUSTAREA,
        lead_updated: state.PCISCRM_LEADCHANNEL_ASSIGNMENT_APPL_NEWOWNER
    }), 
    {
        LOAD_EMPLOYEE_CUSTAREA: getFindEmpInArea,
        ASSIGNMENT_NEWOWNER: assignApplicationNewOwner
    }
)(GridFormAssignment)
