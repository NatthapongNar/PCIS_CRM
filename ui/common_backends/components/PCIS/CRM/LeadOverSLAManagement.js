import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Modal, Form, Select, Button, Input, Icon, notification } from 'antd'

import { LeadChannelCreateOverContactSLA } from '../../../actions/pcis_lead'

import cls from '../styles/pcis_style.scss'

const FormItem  = Form.Item
const { TextArea } = Input
const Option = Select.Option
const confirm = Modal.confirm

const field_default_validate = {
    overcontact_reason: '',
    overcontact_note: ''
}

class LeadOverSLAManagement extends Component {

    state = {
        form_validate: field_default_validate,
        updateProfile: false
    }

    componentWillReceiveProps(props) {
        if(props) {

            if(this.state.updateProfile) {
                this.handleRefresh()
                this.setState({ updateProfile: false })
            }

        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.isOpen !== nextProps.isOpen ||
               this.props.data !== nextProps.data ||
               this.props.masterPlugin !== nextProps.masterPlugin ||
               this.props.form !== nextProps.form ||
               this.state.form_validate !== nextState.form_validate ||
               this.state.updateProfile !== nextState.updateProfile
    }
    
    render() {
        const { form_validate  } = this.state
        const { isOpen, masterPlugin, form } = this.props
        const { getFieldDecorator } = form
        
        // MASTER TEMPLORARY
        let master_oversla = (masterPlugin.referral && masterPlugin.referral.length > 0) ? _.filter(masterPlugin.referral, { Category: 'NotCloseCase' }) : []

        return (
            <Modal
                title={(<span className={cls['fg_white']}>โปรดระบุเหตุผล: สาเหตุที่ไม่ติดต่อลูกค้าในระยะเวลาที่กำหนด</span>)}
                visible={isOpen}
                closable={false}
                maskClosable={false}
                onOk={this.handleOk}
                footer={null}
                className={`${cls['modal_force_alert']} ${cls['hs1']}`}
            >
                <Form className={`${cls['form_container']}`} onSubmit={this.handleSubmit}>
                    <Row>
                        <Col span={24}>
                            <FormItem label={(<span className={`${cls['f1_0']}`}>เหตุผลที่ไม่ติดต่อลูกค้าในระยะเวลาที่กำหนด<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.overcontact_reason} hasFeedback>
                                {
                                    getFieldDecorator('overcontact_reason', {})
                                    (
                                        <Select size="small" onChange={this.handleSelectCriteriaPass.bind(this, 'overcontact_reason')}>
                                            {                                                                
                                                _.map(master_oversla, (v,i) => {
                                                    return (<Option key={`OVER-${i}`} value={v.ReasonCode}>{v.ReasonName}</Option>) 
                                                })
                                            }
                                        </Select>
                                    )
                                }
                            </FormItem> 
                        </Col>
                        <Col span={24}>
                            <FormItem label={(<span className={`${cls['f1_0']}`}>หมายเหตุ</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.overcontact_note} hasFeedback>
                                {
                                    getFieldDecorator('overcontact_note', {})
                                    (<TextArea rows={2} />)
                                }
                            </FormItem>
                        </Col>
                        <Col span={24}>
                            <Button className="fr mt1" type="primary" htmlType="submit">
                                <Icon type="save" /> SUBMIT
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }

    handleSelectCriteriaPass = (attrName, dataVal) => {
        let data = (typeof dataVal == 'number') ? `${dataVal}` : dataVal
        if(!_.isEmpty(data)) {
            this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { [attrName]: 'success' })  })
        } else {
            this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { [attrName]: 'error' })  })
        }
    }

    
    handleRefresh = () => {
        const { handleClose } = this.props
        this.props.form.resetFields()
        this.setState({ form_validate: field_default_validate })
        handleClose()
    }


    handleSubmit = (e) => {
        e.preventDefault();

        const { form: { validateFields } } = this.props

        validateFields((err, fieldData) => {
            if(!err) {
                const title_notify = 'แจ้งเตือนจากระบบ'

                // CHANNEL VALIDATION
                if(!fieldData.overcontact_reason) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { overcontact_reason: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดเลือกเหตุผลที่ไม่ติดต่อลูกค้าในระยะเวลาที่กำหนด')
                    return false
                } 

                if(fieldData.overcontact_reason && fieldData.overcontact_reason == '03') {
                    if(!fieldData.overcontact_note) {
                        this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { overcontact_note: 'error' })  })
                        this.handleNotify('error', title_notify, 'โปรดระบุข้อมูลเพื่อเติมในช่องหมายเหตุ')
                        return false
                    } 

                    if(fieldData.overcontact_note && fieldData.overcontact_note.length <= 5) {
                        this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { overcontact_note: 'error' })  })
                        this.handleNotify('error', title_notify, 'โปรดระบุข้อมูลไม่น้อยกว่า 5 ตัวอักษร')
                        return false
                    } 

                }

                // FIELD ALL PASS VALIDATION                
                let handleCreate = this.handleCreateDataSubmit
                confirm({
                    title: 'กรุณายืนยันการบันทึกข้อมูล',
                    content: 'โปรดตรวจสอบข้อมูลให้ถูกก่อนยืนยันการบันทึกข้อมูล กรุณาข้อมูลถูกต้อง คลิก OK หรือ Cancel เพื่อยกเลิก',
                    onOk() { handleCreate(fieldData) },
                    onCancel() {},
                })

            }

        })
    }

    handleCreateDataSubmit = (fieldData) => {
        const { authen, data } = this.props

        let create_id = (authen && !_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null 
        let create_name = (authen && !_.isEmpty(authen.Auth)) ? authen.Auth.EmpName_EN.replace('+', ' ') : null

        if(create_id && !_.isEmpty(create_id)) {
            let requestData = {
                LeadDocID: (data.LeadDocID) ? data.LeadDocID : null,
                ResponseCode: 'O',
                ActionID: (fieldData.overcontact_reason && !_.isEmpty(fieldData.overcontact_reason)) ? fieldData.overcontact_reason : null,                   
                ActionNote: (fieldData.overcontact_note && !_.isEmpty(fieldData.overcontact_note)) ? fieldData.overcontact_note : null,
                CreateID: create_id,
                CreateName: create_name
            }

            this.handleCreateOverContactReason(requestData)

        } else {
            this.handleNotify('error', 'แจ้งเตือนจากระบบ', 'ขออภัย, เกิดข้อผิดพลาดในการบันทึกข้อมูล เนื่องจากเซคชั่นหมดอายุ กรุณารีเฟรชหน้าจอใหม่')
        }

    }

    handleCreateOverContactReason = (data) => {
        const { CREATE_ACTION_OVERCONTACT } = this.props
        CREATE_ACTION_OVERCONTACT(data)  
        this.setState({ updateProfile: true })
    }
    
    handleNotify = (noti_type, str_msg, str_content) => {
        let notify_type = null
        let msg_title = null
        
        if(str_msg && str_msg !== '') msg_title = str_msg
        else msg_title = 'Notice information'

        if(str_msg && str_msg !== '') notify_type = noti_type
        else notify_type = 'success'

        notification[notify_type]
        ({
            message: msg_title,
            description: str_content
        })
    }

}

const LeadOverSLAManagementWrapper = Form.create()(LeadOverSLAManagement)
export default connect(
    (state) => ({
        lead_overcontact: state.LEAD_ACTION_OVERCONTACTSLA        
    }), 
    {    
        CREATE_ACTION_OVERCONTACT: LeadChannelCreateOverContactSLA
    }
)(LeadOverSLAManagementWrapper)