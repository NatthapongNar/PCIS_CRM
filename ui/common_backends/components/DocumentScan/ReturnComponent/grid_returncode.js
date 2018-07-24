import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'
import { Table, Icon, Form, Row, Col, Collapse, Input, Radio, Checkbox, Modal, Button, Tooltip, Popover, Select, notification } from 'antd'
import Scrollbar from 'react-smooth-scrollbar'
import _ from 'lodash'

import { 
    OnCreateReturnCode,
    OnCreateMessage,
    getMessageInformation

} from '../../../actions/master'

import TimelineActicity from './chatbox_timeline'

import { return_columns, return_hist_columns } from '../config/columns'
import cls from '../style/index.scss'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const Panel = Collapse.Panel
const ButtonGroup = Button.Group
const confirm = Modal.confirm

const { TextArea } = Input

class ReturnDashboard extends Component {

    state = {
        addMessage: false,
        draftData: [{
            RootCategoryName: null,
            CategoryCode: null,
            CategoryName: null,
            ReturnCode: null,
            ReturnReason: null
        }],
        formData: {
            return_code: null, 
            return_optional: null,
            message_note: null
        },
        timeline: false,
        returncode: false,
        returnmodal: false,
        returnload: false,
        validation: {
            create_return: false,
            general_text: false
        }
    }

    componentWillReceiveProps(props) {
        const { result: { grid_message } } = props

        if(!_.isEmpty(grid_message.Data) && grid_message.Data.length > 0) {
            _.map(grid_message.Data, (v) => {
                v.addMessage = (<Icon type="message" className={`pointer`} onClick={this.handleReplyMessage.bind(this, v)} />)
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.modal.chatbox !== nextProps.modal.chatbox ||
            this.props.form !== nextProps.form ||
            this.props.data !== nextProps.data ||
            this.props.grid_message !== nextProps.grid_message ||
            this.props.master !== nextProps.master ||
            this.props.result.create_returncode !== nextProps.result.create_returncode ||
            this.props.result.create_message !== nextProps.result.create_message ||
            this.state.addMessage !== nextState.addMessage ||
            this.state.draftData !== nextState.draftData ||
            this.state.formData !== nextState.formData ||
            this.state.timeline !== nextState.timeline ||
            this.state.returncode !== nextState.returncode ||
            this.state.returnmodal !== nextState.returnmodal ||
            this.state.returnload !== nextState.returnload ||
            this.state.validation !== nextState.validation 
    }

    handleRowKey = (records, i) => { 
        return (records && records.RowID) ? `${records.RowID}_${(i + 1)}` : 0 
    }

    render() {
        const { data, result: { grid_message }, master, modal, handleClose } = this.props

        return (
            <Modal
                wrapClassName={`${cls['modal_wrapper']} ${cls['modal_toEase90']}`}
                visible={modal.chatbox}
                title={<span className="ttu">Information</span>}
                maskClosable={false}
                onOk={null}
                onCancel={handleClose}
                footer={(<div />)}
                width="75%"
            >
                <Collapse defaultActiveKey="1" className={cls['team_conatainer']}>
                    <Panel key="1" header="Basic Information" className="ttu">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Row gutter={24}>
                                    <Col span={12}><b>Application No</b></Col>
                                    <Col span={12}>{`${(data && !_.isEmpty(data.ApplicationNo)) ? data.ApplicationNo : ''}`}</Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={12}><b>{`${(data && data.Onbehalf_Type === 'บุคคลธรรมดา') ? 'ID Card' : 'Business Registration'}`}</b></Col>
                                    <Col span={12}>{`${(data && !_.isEmpty(data.ID_Card)) ? data.ID_Card : ''}`}</Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={12}><b>Customer</b></Col>
                                    <Col span={12}>{`${(data && !_.isEmpty(data.BorrowerName)) ? data.BorrowerName : ''}`}</Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={12}><b>Registration</b></Col>
                                    <Col span={12}>{`${(data && !_.isEmpty(data.Onbehalf_Type)) ? data.Onbehalf_Type : ''}`}</Col>
                                </Row>
                            </Col>
                            <Col span={12}>
                                <Row gutter={24}>
                                    <Col span={12}><b>Region</b></Col>
                                    <Col span={12}>{`${(data && !_.isEmpty(data.RegionNameEng)) ? data.RegionNameEng : ''}`}</Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={12}><b>Team</b></Col>
                                    <Col span={12}>{`${(data && !_.isEmpty(data.BranchName)) ? data.BranchName : ''}`}</Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={12}><b>Application Owner</b></Col>
                                    <Col span={12}>{`${(data && !_.isEmpty(data.RMName)) ? data.RMName : ''}`}</Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={12}><b>Mobile</b></Col>
                                    <Col span={12}>{`${(data && !_.isEmpty(data.RMMobile)) ? data.RMMobile : ''}`}</Col>
                                </Row>
                            </Col>
                        </Row>
                    </Panel>
                </Collapse>

                <div className={`${cls['upload_tools']} mt2`}>
                    <div className={cls['tools']}>
                        <h4 className="ttu">Return Arrears Information</h4>
                    </div>
                    <div className={cls['tools']}>
                        <ButtonGroup className={`${cls['tools']}`}>                            
                            <Tooltip placement="top" title="Timeline Activity">
                                <Button type="dashed" icon="clock-circle-o" onClick={this.handleTimelineEnable} />
                            </Tooltip>
                        </ButtonGroup>
                    </div>
                </div>

                <Scrollbar>
                    <div style={{ maxHeight: '300px'}}>
                        <Table
                            className={cls['grid_table']}
                            rowKey={this.handleRowKey}
                            columns={return_columns}
                            dataSource={[]}
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
                    <div className={cls['tools']}>
                        <h4 className="ttu">Return History</h4>
                    </div>
                    <div className={cls['tools']}></div>
                </div>

                <Scrollbar>
                    <div style={{ maxHeight: '300px'}}>
                        <Table
                            className={cls['grid_table']}
                            rowKey={this.handleRowKey}
                            columns={return_hist_columns}
                            dataSource={[]}
                            size="small"
                            pagination={{
                                size: 'small',
                                pageSize: 50,
                            }}
                            bordered
                        />
                    </div>
                </Scrollbar>

                <TimelineActicity
                    isOpen={this.state.timeline}
                    handleClose={this.handleTimelineEnable}
                />
            
                <ReturnCodeManagement
                    isOpen={this.state.returnmodal}
                    master={master.return_code}
                    handleForm={this.getReturnCode}
                    handleClose={this.handleReturnModalEnable}
                />

            </Modal>
        )
    }

    handleUseNote = () => {
        this.setState({ addMessage: true })
    }

    handleReplyMessage = (info) => {
        console.log(info)
    }
   
    handleTimelineEnable = () => {
        this.setState({ timeline: !this.state.timeline })
    }

    handleReturnEnable = () => {
        if(!this.state.returncode == false) {
            this.setState({ 
                draftData: [{
                    RootCategoryName: null,
                    CategoryCode: null,
                    CategoryName: null,
                    ReturnCode: null,
                    ReturnReason: null
                }],
                formData: {
                    return_code: null, 
                    return_optional: null
                },
                validation: {
                    create_return: false,
                    general_text: false
                }  
            })              
        }

        this.setState({ returncode: !this.state.returncode }) 
    }

    handleReturnModalEnable = () => {
        this.setState({ returnmodal: !this.state.returnmodal })   
    }

    formNoteControl = () => {
        const { draftData, formData, validation } = this.state
        const { getFieldDecorator } = this.props.form

        return (
            <div className={`${cls['message_container']} ${cls['fadein']} ${(!this.state.addMessage) && cls['hide']}`}>
                <h4 className="ttu">Create Message</h4>
                <Form layout="horizontal" onSubmit={this.handleNoteSave}>
                    <FormItem className={`${cls['margin_none']} ttu`}>
                        {
                            getFieldDecorator('returncode', { valuePropName: 'checked' })
                            (<Checkbox onClick={this.handleReturnEnable} disabled={this.state.returnload}>Create Return Code</Checkbox>)
                        }
                    </FormItem>
                    <div className={cls['return_container']}>
                        <div className={`${cls['items']} ${(!this.state.returncode) ? cls['disable']:''}`}>
                        {
                            _.map(draftData, (v, i) => {
                                return (
                                    <p key={(i + 1)}>{`${(!_.isEmpty(v.ReturnCode)) ? v.ReturnCode:''} ${(!_.isEmpty(v.ReturnReason)) ? '- ' + v.ReturnReason : ''} ${(!_.isEmpty(v.ReturnText)) ? ' : ' + v.ReturnText : ''}`}</p>
                                )
                            })
                        }
                        </div>
                        <div className={`${cls['items']}`}>
                            <Button 
                                type="dash" 
                                icon="file-add" 
                                className={`fl mr1 ${(validation.create_return) ? cls['bg_red_validation']:''}`} 
                                onClick={this.handleReturnModalEnable} 
                                disabled={!this.state.returncode || this.state.returnload} 
                            />
                        </div>
                    </div>
                    <FormItem label="Action Note" className={`ttu fw5`}>
                        {
                            getFieldDecorator('reason_remark', { rules: [{ initialValue: formData.message_note, required: false }] })
                            (<TextArea rows={4} maxLength={255} className={`${(validation.general_text) ? cls['border_error']:''}`} disabled={this.state.returnload} />)
                        }
                        <small>Maximum of 255 characters</small>
                    </FormItem>
                    <FormItem>
                        <Button shape="circle" icon="close" className="fl" onClick={this.handleDismissNote} disabled={this.state.returnload} />
                        <Button type="primary" shape="circle" icon="check-square-o" className="fr" htmlType="submit" loading={this.state.returnload} disabled={this.state.returnload} />
                    </FormItem>
                </Form>
            </div>
        )

    }

    handleDismissNote = () => {
        this.props.form.resetFields()

        this.setState({ 
            addMessage: false,
            timeline: false,
            returncode: false,
            returnmodal: false,
            returnload: false,
            draftData: [{
                RootCategoryName: null,
                CategoryCode: null,
                CategoryName: null,
                ReturnCode: null,
                ReturnReason: null
            }],
            formData: {
                return_code: null, 
                return_optional: null,
                message_note: null
            }            
        })
    }

    getReturnCode = (param) => {
        const { master: { return_code } } = this.props

        let topic = (!_.isEmpty(param.returnCheck) && param.returnCheck == 'DC033') ? param.returnType : param.returnCheck
        let text  = (!_.isEmpty(param.returnDesc)) ? param.returnDesc : null

        let draftData = []
        if(!_.isEmpty(param.returnCheck) && param.returnCheck == 'DC033') {
            let findData = _.filter(return_code[0].other, { ReturnCode: topic })[0]            
            draftData = [{
                RootCategoryName: findData.RootCategoryName,
                CategoryCode: findData.CategoryCode,
                CategoryName: findData.CategoryName,
                ReturnCode: topic,
                ReturnReason: findData.ReturnReason,
                ReturnText: text
            }]

        } else {    
            let findData = _.filter(return_code[0].returnCode, { ReturnCode: topic })[0]
            draftData = [{
                RootCategoryName: findData.RootCategoryName,
                CategoryCode: findData.CategoryCode,
                CategoryName: findData.CategoryName,
                ReturnCode: topic,
                ReturnReason: findData.ReturnReason,
                ReturnText: null
            }]
        }

        this.setState({ 
            draftData: draftData,
            formData: _.assign({}, this.state.formData, {
                return_code: topic, 
                return_optional: text
            }),
            returnmodal: false
        })
        
        this.handleSetValidation('create_return_buttom', false)

    }

    handleNoteSave = (e) => {
        e.preventDefault()

        const { form } = this.props
        const { formData } = this.state

        form.validateFields((err, objField) => {
            let form_verify = false
            if(objField.returncode) {
                if(_.isEmpty(formData.return_code)) {
                    notification.error({
                        message: 'Invalid topic selection',
                        description: 'กรุณาเลือกรายการ Return Code ให้ถูกต้องก่อนบันทึกข้อมูล',
                    })

                    this.handleSetValidation('create_return_buttom', true)

                } else {
                    form_verify = true
                }
                  
            } else {
                if(_.isEmpty(objField.reason_remark)) {
                    notification.error({
                        message: 'Please enter action note',
                        description: 'กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนบันทึกข้อมูล',
                    })

                    this.handleSetValidation('general_text', true)
                } 
                else if(!_.isEmpty(objField.reason_remark) && objField.reason_remark.length <= 5) {
                    notification.error({
                        message: 'Incorrect information',
                        description: 'กรุณาตรวจสอบข้อมูลให้ถูกต้อง (ข้อความยาวอย่างน้อย 5 ตัวอักษร)',
                    })

                    this.handleSetValidation('general_text', true)
                }
                else {
                    form_verify = true
                    this.handleSetValidation('general_text', false)
                }

            }

            if(form_verify) {
                let fnSave = this.fetchDataSave
                confirm({
                    className: cls['ant-confirm-container'],
                    title: 'Do you want to save these data?',
                    content: (objField.returncode) ? 'กรุณายืนยันการสร้าง Return Code กรณีข้อมูลถูกต้องคลิก OK' : 'กรุณายืนยันการบันทึกข้อมูล กรณีข้อมูลถูกต้องคลิก OK',
                    onOk() { fnSave(objField) },
                    onCancel() {}
                })
            }

        })

    }

    fetchDataSave = (objField) => {
        const { data, authen, CREATE_RETURNCODE, CREATE_MESSAGE, GET_GRID_MESSAGE } = this.props
        const { formData } = this.state

        this.setState({ returnload: true })

        // CREATE IS NOT HAS RETURN CODE
        if(!objField.returncode) {

            let requestData = {
                ApplicationNo: data.ApplicationNo,
                CitizenID: data.ID_Card,
                ReturnNo: null,
                ReturnType: 'CREATE',
                ReturnCode: formData.return_code,
                ReturnOtherText: formData.return_optional,
                ReturnMessage: objField.reason_remark,
                CreateID: (!_.isEmpty(authen)) ? authen.Auth.EmployeeCode : null,
                CreateName: (!_.isEmpty(authen)) ? authen.Auth.EmpName_TH.replace('+', ' ') : null
            }

            CREATE_MESSAGE(requestData)

            let start_loading = 0
            const max_loading = 9
            var monitor = setInterval(() => {
                const { create_message } = this.props.result

                if(create_message.Status || start_loading == max_loading) {
                    clearInterval(monitor)

                    GET_GRID_MESSAGE({
                        EmpCode: requestData.CreateID,
                        ApplicationNo: requestData.ApplicationNo
                    })

                    notification.success({ message: 'Create new message successfully', description: 'ระบบดำเนินการบันทึกสำเร็จ' })
                    this.handleDismissNote()
                }

                start_loading++
            }, 500)

        } else {

            let createReturnCode = {
                ApplicationNo: data.ApplicationNo,
                CitizenID: data.ID_Card,           
                ReturnCode: formData.return_code,
                ReturnMessage: objField.reason_remark,
                CreateID: (!_.isEmpty(authen)) ? authen.Auth.EmployeeCode : null,
                CreateName: (!_.isEmpty(authen)) ? authen.Auth.EmpName_TH.replace('+', ' ') : null
            }

            CREATE_RETURNCODE(createReturnCode)

            let start_loading = 0
            const max_loading = 9
            var monitor_createreturn = setInterval(() => {
                const { create_returncode } = this.props.result

                if(create_returncode.Status || start_loading == max_loading) {
                    clearInterval(monitor_createreturn)

                    let resp_data = create_returncode.Data[0]

                    let requestData = {
                        ApplicationNo: data.ApplicationNo,
                        CitizenID: data.ID_Card,
                        ReturnNo: resp_data.ReturnNo,
                        ReturnType: 'CREATE',
                        ReturnCode: formData.return_code,
                        ReturnOtherText: formData.return_optional,
                        ReturnMessage: objField.reason_remark,
                        CreateID: (!_.isEmpty(authen)) ? authen.Auth.EmployeeCode : null,
                        CreateName: (!_.isEmpty(authen)) ? authen.Auth.EmpName_TH.replace('+', ' ') : null
                    }

                    CREATE_MESSAGE(requestData)

                    let message_loading = 0
                    var monitor = setInterval(() => {
                        const { create_message } = this.props.result
        
                        if(create_message.Status || message_loading == max_loading) {
                            clearInterval(monitor)

                            GET_GRID_MESSAGE({
                                EmpCode: requestData.CreateID,
                                ApplicationNo: requestData.ApplicationNo
                            })
        
                            notification.success({ message: 'Create return code successfully', description: 'ระบบดำเนินการสร้างข้อมูลสำเร็จ' })
                            this.handleDismissNote()
                        }
        
                        message_loading++
        
                    }, 500)

                }

                start_loading++
                
            }, 500)

        }

    }

    handleSetValidation = (key, status) => {
        if(!_.isEmpty(key)) {
            switch(key) {
                case 'create_return_buttom':
                    this.setState({ validation: _.assign({}, this.state.validation, { create_return: status }) })
                break
                case 'general_text':
                    this.setState({ validation: _.assign({}, this.state.validation, { general_text: status }) })
                break
            }
        }
    }

}

class ReturnCodeManagement extends Component {

    state = {
        returnCheck: null,
        returnType: null,
        returnDesc: null
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.isOpen !== nextProps.isOpen ||
               this.state.returnCheck !== nextState.returnCheck ||
               this.state.returnType !== nextState.returnType ||
               this.state.returnDesc !== nextState.returnDesc
    }

    render() {
        const { isOpen, master } = this.props

        let ms_category = (master[0] && master[0].folder_category.length > 0) ? master[0].folder_category : []
        let ms_returncode = (master[0] && master[0].returnCode.length > 0) ? master[0].returnCode : []
        let ms_othercode = (master[0] && master[0].other.length > 0) ? master[0].other : []

        return (
            <Modal
                wrapClassName={`${cls['modal_wrapper']} ${cls['modal_tonav']}`}
                visible={isOpen}
                title={<span className="ttu">Return Management</span>}
                maskClosable={false}
                onOk={null}
                onCancel={this.handleDismiss}
                footer={null}
                width="80%"
            >
                {
                    _.map(_.reject(ms_category, (o) => { return o.category_code == 'DC033' }), (categoryData, categoryIndex) => {
                        let master_reason = _.filter(ms_returncode, { RootCategory: categoryData.category_code })

                        return (
                            <div key={categoryIndex} className="ma2">
                                <Collapse key={(categoryIndex + 1)} bordered={true} defaultActiveKey={ (master_reason && master_reason.length > 0) ? ['1'] : []}>
                                    <Panel key="1" header={categoryData.category_reason} disabled={ (master_reason && master_reason.length > 0) ? false : true }>
                                        <RadioGroup key={`${categoryData.category_code}_${(categoryIndex + 1)}`} onChange={this.onRadioChange} value={this.state.returnCheck}>
                                            {
                                                _.map(master_reason, (v, i) => {
                                                    let character = (!_.isEmpty(v.ReturnReason)) ? v.ReturnReason.length : 0
                                                    let char_size = (6.5 * character)
                                                    if(char_size >= 325) {
                                                        return (
                                                            <Popover key={`${v.ReturnCode}_${v.ReturnReason}_${(i + 1)}`} placement="right" title="Return Code" content={<div className={cls['returncode_checker']}>{v.ReturnReason}</div>}>
                                                                <Radio key={`${v.ReturnReason}_${(i + 1)}`} value={v.ReturnCode} className={cls['returncode_ellipsis']}>{ v.ReturnReason }</Radio>
                                                            </Popover>
                                                        )
                                                    } else {
                                                        return (<Radio key={`${v.ReturnReason}_${(i + 1)}`} value={v.ReturnCode} className={cls['returncode_checker']}>{ v.ReturnReason }</Radio>)
                                                    }
                                                    
                                                })
                                            }
                                        </RadioGroup> 
                                    </Panel>
                                </Collapse>
                            </div>
                        )
                    })                    
                }

                    <div className="ma2">
                    <Collapse bordered={true} defaultActiveKey={['1']}>
                        <Panel key="1" header="อื่นๆ">
                            <Row gutter={24}>
                                <Col span={2}>
                                    <RadioGroup onChange={this.onRadioChange} value={this.state.returnCheck}>
                                        <Radio value="DC033">อื่นๆ</Radio>
                                    </RadioGroup>
                                </Col>
                                <Col span={5} className={cls['padding_none']}>
                                    <Select onChange={this.onSelectChange} disabled={ (!_.isEmpty(this.state.returnCheck) && this.state.returnCheck == 'DC033') ? false : true } style={{ width: '100%' }}>
                                        <Option value="">&nbsp;</Option>
                                        { 
                                            _.map(ms_othercode, (v, i) => { 
                                                return (<Option key={(i+1)} value={v.ReturnCode}>{ v.CategoryName }</Option>) 
                                            }) 
                                        }
                                    </Select>
                                </Col>
                                <Col span={5} className={`${cls['padding_none']} ${cls['ml1']}`}>
                                    <Input onChange={this.onInputChange} disabled={ (!_.isEmpty(this.state.returnType)) ? false : true } />
                                </Col>
                            </Row>
                        </Panel>
                    </Collapse>
                </div>      

                <div className={`${cls['container_floating']} ${(!isOpen) ? cls['hide']: ''}`}>
                    <div className={`${cls['floating_button']} ${cls['two_menu']}`} onClick={this.handleFormSubmit}>
                        <Popover placement="left" title="SAVE FORM" content="กดบันทึกข้อมูลเพื่อสร้างข้อมูล Return Code">
                            <Icon type="save" className={`${cls['menu']}`} />
                        </Popover>
                    </div>
                    <div className={`${cls['floating_button']} ${cls['bg_white']}`} onClick={this.handleDismiss}>
                        <Popover placement="left" title="CLOSE MENU" content="กดปุ่มเพื่อปิดการใช้งาน หรือยกเลิกการทำรายการ">
                            <Icon type="close" className={`${cls['menu']}`} />
                        </Popover>
                    </div>
                </div>

            </Modal>
        )
    }

    onRadioChange = (e) => {
        this.setState({ returnCheck: e.target.value })
    }

    onSelectChange = (value) => {
        this.setState({ returnType: value })
    }

    onInputChange = (e) => {
        this.setState({ returnDesc: e.target.value })
    }

    handleFormSubmit = () => {
        const { handleForm } = this.props
        let data = this.state

        if(_.isEmpty(data.returnCheck)) {
            notification.error({
                message: 'Invalid topic selection',
                description: 'กรุณาเลือกรายการ Return Code ให้ถูกต้องก่อนบันทึกข้อมูล',
            })

        } else {

            if(!_.isEmpty(data.returnCheck) && data.returnCheck == 'DC033') {
                if(!_.isEmpty(data.returnType) && !_.isEmpty(data.returnDesc)) {
                    this.setState({ returnCheck: null, returnType: null, returnDesc: null })
                    handleForm(data)                    

                } else {                   
                    if(_.isEmpty(data.returnType)) {
                        notification.error({
                            message: 'Unknown other type',
                            description: 'กรุณาเลือกรายการประเภทของหัวข้ออื่นๆ ให้ถูกต้องก่อนบันทึกข้อมูล',
                        })
                    }

                    if(!_.isEmpty(data.returnType) && _.isEmpty(data.returnDesc)) {
                        notification.error({
                            message: 'Incorrect information',
                            description: 'กรุณากรอกรายละเอียดข้อมูล ให้ถูกต้องก่อนบันทึกข้อมูล ',
                        })
                    }

                }

            } else {
                handleForm(data)
                this.setState({ returnCheck: null, returnType: null, returnDesc: null })
            }

        }

    }

    handleDismiss = () => {
        const { handleClose } = this.props
        this.setState({ returnCheck: null, returnType: null, returnDesc: null })
        handleClose()
    }


}

const ReturnDashboardWithCookies = withCookies(ReturnDashboard)
const ReturnDashboardManagement = Form.create()(ReturnDashboardWithCookies)
export default connect(
    (state) => ({
        result: {
            grid_message: state.DOCUMENTSCAN_GRID_MESSAGE,
            create_returncode: state.DOCUMENTSCAN_CREATE_RETURNCODE,
            create_message: state.DOCUMENTSCAN_CREATE_MESSAGE
        }
    }),
    {
        GET_GRID_MESSAGE: getMessageInformation,
        CREATE_RETURNCODE: OnCreateReturnCode,
        CREATE_MESSAGE: OnCreateMessage
    }
)(ReturnDashboardManagement)

