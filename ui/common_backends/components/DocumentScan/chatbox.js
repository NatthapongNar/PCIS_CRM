import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withCookies } from 'react-cookie'
import { Table, Icon, Form, Row, Col, Collapse, Input, Select, Checkbox, Modal, Button } from 'antd'
import Scrollbar from 'react-smooth-scrollbar'
import _ from 'lodash'

import TimelineActicity from './chatbox_timeline'

import { team_columns } from './config/columns'
import cls from './style/index.scss'

const FormItem = Form.Item
const Option = Select.Option
const Panel = Collapse.Panel
const ButtonGroup = Button.Group

const { TextArea } = Input

class ChatComponent extends Component {

    state = {
        addMessage: false,
        formData: {
            topic: '',
            reason: '',
            note: ''
        },
        file_add: false,
        timeline: false,
        returncode: false
    }

    handleFileAddEnable = () => {
        this.setState({ file_add: !this.state.file_add })
    }

    handleTimelineEnable = () => {
        this.setState({ timeline: !this.state.timeline })
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.modal.chatbox !== nextProps.modal.chatbox ||
            this.props.form !== nextProps.form ||
            this.props.data !== nextProps.data ||
            this.state.addMessage !== nextState.addMessage ||
            this.state.formData !== nextState.formData ||
            this.state.file_add !== nextState.file_add ||
            this.state.timeline !== nextState.timeline ||
            this.state.returncode !== nextState.returncode
    }

    render() {
        const { data, modal, handleClose } = this.props

        return (
            <Modal
                wrapClassName={cls['modal_wrapper']}
                visible={modal.chatbox}
                title={<span className="ttu">Team Tracking</span>}
                maskClosable={false}
                onOk={null}
                onCancel={handleClose}
                footer={null}
                width="65%"
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
                                    <Col span={12}><b>{`${(!_.isEmpty(data.Onbehalf_Type) && data.Onbehalf_Type == 'บุคคลธรรมดา"') ? 'ID Card' : 'Business Registration'}`}</b></Col>
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
                        <h4 className="ttu">Team Arrears History</h4>
                    </div>
                    <div className={cls['tools']}>
                        <ButtonGroup className={`${cls['tools']}`}>                            
                            <Button type="dashed" icon="clock-circle-o" onClick={this.handleTimelineEnable} />
                            <Button type="primary" icon="plus" onClick={this.handleUseNote} />
                        </ButtonGroup>
                        {this.formNoteControl()}
                    </div>
                </div>

                <Scrollbar>
                    <Table
                        className={cls['grid_table']}
                        columns={team_columns}
                        dataSource={[]}
                        size="small"
                        bordered
                    />
                </Scrollbar>

                <TimelineActicity
                    isOpen={this.state.timeline}
                    handleClose={this.handleTimelineEnable}
                />
            
                <MissingDocManagement
                    isOpen={this.state.file_add}
                    handleClose={this.handleFileAddEnable}
                />

            </Modal>
        )
    }

    handleReset = () => {
        this.props.form.resetFields();
    }

    handleUseNote = () => {
        this.setState({ addMessage: !this.state.addMessage })
    }

    handleReturnEnable = () => {
        this.setState({ returncode: !this.state.returncode })
    }

    formNoteControl = () => {
        const { formData } = this.state
        const { getFieldDecorator } = this.props.form

        return (
            <div className={`${cls['message_container']} ${cls['fadein']} ${(!this.state.addMessage) && cls['hide']}`}>
                <h4 className="ttu">Create Message</h4>
                <Form layout="horizontal" onSubmit={this.handleNoteSave}>
                    <FormItem className={`${cls['margin_none']} ttu`}>
                        {
                            getFieldDecorator('returncode', { valuePropName: 'checked', initialValue: this.state.returncode })(<Checkbox onClick={this.handleReturnEnable}>Create Return Code</Checkbox>)
                        }
                    </FormItem>
                    <div className={cls['return_container']}>
                        <div className={`${cls['items']} ${(!this.state.returncode) ? cls['disable']:''}`}></div>
                        <div className={`${cls['items']}`}>
                            <Button type="dashed" icon="file-add" className="fl mr1" onClick={this.handleFileAddEnable} disabled={!this.state.returncode} />
                        </div>
                    </div>
                    <FormItem label="Action Note" className={`ttu fw5`}>
                        {
                            getFieldDecorator('reason_remark', { rules: [{ initialValue: formData.note, required: false }] })(<TextArea rows={4} />)
                        }
                    </FormItem>
                    <FormItem>
                        <Button shape="circle" icon="close" className="fl" onClick={this.handleUseNote} />
                        <Button type="primary" shape="circle" icon="check-square-o" className="fr" htmlType="submit" />
                    </FormItem>
                </Form>
            </div>
        )

    }

    handleNoteSave = (e) => {
        e.preventDefault()

        const { form } = this.props

        form.validateFields((err, objField) => {
            console.log(err, objField)
            
        })

    }

}

class MissingDocManagement extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.isOpen !== nextProps.isOpen
    }

    render() {
        const { isOpen, handleClose } = this.props

        return (
            <Modal
                wrapClassName={`${cls['modal_wrapper']} ${cls['modal_tonav']}`}
                visible={isOpen}
                title={<span className="ttu">Return Management</span>}
                maskClosable={false}
                onOk={null}
                onCancel={handleClose}
                footer={null}
                width="80%"
            >
                <p>Test</p>
            </Modal>
        )
    }
}

const ChatComponentWithCookies = withCookies(ChatComponent)
const ChatComponentManagement = Form.create()(ChatComponentWithCookies)
export default connect(
    (state) => ({}),
    {}
)(ChatComponentManagement)

