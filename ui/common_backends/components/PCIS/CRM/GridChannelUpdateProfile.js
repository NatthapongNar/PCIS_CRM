import React, { Component } from 'react'
import { connect } from 'react-redux'
import bluebird from 'bluebird'
import { Form, Modal, Card, Input, InputNumber, Select, Checkbox, Radio, Button, Icon, Row, Col, Tooltip, notification } from 'antd'
import moment from 'moment'
import _ from 'lodash'

import {
    getLeadMasterCustomerPrefix, 
    getLeadMasterCustomerGroup,
    getLeadMasterCustomerType,
    getLeadMasterProvince,
    getLeadMasterAmphoe,
    getLeadMasterDistrict,

    LeadChannelAddCustomer

} from '../../../actions/pcis_lead'

import {
    master_occupation,
    master_purpose,
    master_mediachannel,
    master_businesstype,
    master_collateral
    
} from './data_config/master_config'

import cls from '../styles/pcis_style.scss'

const FormItem = Form.Item
const { TextArea } = Input
const InputGroup = Input.Group
const Option = Select.Option
const RadioGroup = Radio.Group
const ButtonGroup = Button.Group
const confirm = Modal.confirm

const field_default_validate = {            
    channel_group: '',
    channel_source: '',
    purpose_reason: '',
    request_prduct: '',
    request_campaign: '',
    request_loan: '',
    media_channel: '',
    customer_ordinarytype: '',
    customer_idcard: '',
    customer_group: '',
    customer_type: '',
    customer_prefix: '',                   
    customer_name: '',
    customer_surname: '',
    customer_occupation: '',
    customer_age: '',
    customer_revenue: '',
    customer_hometel: '',               
    customer_mobile: '',
    customer_email: '',
    customer_address: '',
    customer_province: '',
    customer_amphoe: '',
    customer_tumbon: '',
    customer_zipcode: '',
    business_registration: '',
    company_name: '',
    is_Owner: '',
    business_type: '',   
    business_description: '',
    yib: '',
    have_guarantor: '',
    is_collateral: '',
    collateral_type: ''  
}

class GridChannelUpdateProfile extends Component {

    state = {
        form_validate: {            
            channel_group: '',
            channel_source: '',

            purpose_reason: '',
            request_prduct: '',
            request_campaign: '',
            request_loan: '',

            media_channel: '',

            customer_ordinarytype: '',
            customer_idcard: '',
            customer_group: '',
            customer_type: '',
            customer_prefix: '',                   
            customer_name: '',
            customer_surname: '',
            customer_occupation: '',
            customer_age: '',
            customer_revenue: '',
            customer_hometel: '',               
            customer_mobile: '',
            customer_email: '',
            customer_address: '',
            customer_province: '',
            customer_amphoe: '',
            customer_tumbon: '',
            customer_zipcode: '',

            business_registration: '',
            company_name: '',
            is_Owner: '',
            business_type: '',   
            business_description: '',
            yib: '',
            have_guarantor: '',

            is_collateral: '',
            collateral_type: ''  
        }
    }

    componentWillMount() {
        const { 
            LOAD_MASTERCUST_PREFIX,
            LOAD_MASTERCUST_GROUP, 
            LOAD_MASTERCUST_TYPES, 
            LOAD_MASTER_PROVINCE, 
            LOAD_MASTER_AMPHOE, 
            LOAD_MASTER_DISTRICT 
        } = this.props

        const API_DEFAULT_CALL = [
            LOAD_MASTERCUST_PREFIX,
            LOAD_MASTERCUST_GROUP,
            LOAD_MASTERCUST_TYPES,
            LOAD_MASTER_PROVINCE, 
            LOAD_MASTER_AMPHOE, 
            LOAD_MASTER_DISTRICT
        ]

        bluebird.all(API_DEFAULT_CALL).each((f) => f())
    }
    

    hadnleCloseAfterSave = () => {
        const { handleClose } = this.props
        this.props.form.resetFields()
        this.setState({ form_validate: field_default_validate })
        handleClose()
    }

    handleCancel = () => {
        const { handleClose } = this.props
        this.props.form.resetFields()
        this.setState({ form_validate: field_default_validate })
        handleClose()
    }

    render() {
        const { form_validate } = this.state
        const { isOpen, masters, masterPlugin, data } = this.props
        const { getFieldDecorator, getFieldValue } = this.props.form

        console.log(data)

        // CUSTOMER GROUP >> CUSTOMER TYPE
        let master_custtype = []
        let custgroup_hasSel = true
        let sel_custgroup = getFieldValue('customer_group')
        if(sel_custgroup && sel_custgroup !== '') {
            let filter_custtype = _.filter(masters.customer_types, { IsDropdownEnable: 'Y', CustGroupID: sel_custgroup })
            master_custtype = filter_custtype
            custgroup_hasSel = false
        } else {
            master_custtype = masters.customer_types
            custgroup_hasSel = true
        }
        
        // CHANNEL GROUP >> CHANNEL SOURCE
        let master_channelsource = []
        let channelsource_has_sel = true
        let sel_channelsource = getFieldValue('channel_group')

        if(sel_channelsource && sel_channelsource !== '') {
            let filter_channelsource = _.filter(masterPlugin.channel_source, { ChannelID: sel_channelsource })
            master_channelsource = filter_channelsource
            channelsource_has_sel = false
        } else {
            master_channelsource = masterPlugin.channel_source
            channelsource_has_sel = true
        }

        // PROVINCE >> AMPHONE
        let master_amphoe = []
        let province_has_sel = true
        let sel_province = getFieldValue('customer_province')

        if(sel_province && sel_province !== '') {
            let filter_amphoe = _.filter(masters.amphoe, { ProvinceID: sel_province })
            master_amphoe = filter_amphoe
            province_has_sel = false
        } else {
            master_amphoe = masters.amphoe
            province_has_sel = true
        }

        // AMPHONE >> TUMBON
        let master_tumbon = []
        let amphoe_has_sel = true
        let sel_amphoe = getFieldValue('customer_amphoe')

        if(sel_amphoe && sel_amphoe !== '') {
            let filter_district = _.filter(masters.district, { AmphoeID: sel_amphoe })
            master_tumbon = filter_district
            amphoe_has_sel = false
        } else {
            master_tumbon = masters.district
            amphoe_has_sel = true
        }

        // COLLATERAL
        let iscollater_disable = true
        let sel_iscollateral = getFieldValue('is_collateral')
        if(sel_iscollateral && sel_iscollateral == 'Y') {
            iscollater_disable = false
        } else {
            iscollater_disable = true
        }
        
        return (
            <Modal
                wrapClassName={`${cls['modal_container']} ${cls['untop']} ${cls['full']} ${cls['modelcontent_bg_1']}`}
                visible={isOpen}
                title={null}
                keyboard={false}
                maskClosable={false}
                onOk={null}
                onCancel={this.handleCancel}
                footer={null}
                width="100%"
            >
                <Form className={`${cls['form_container']}`} onSubmit={this.handleSubmit}>  
                    <div className={`${cls['lead_title']} ttu`}>Update Profile Information</div>
                    <Row gutter={10}>
                        <Col span={8}>

                            <Card className={`${cls['m0']} ${cls['p0']}`}>
                                <div className={`ttu pl3 ${cls['pclr1']}`}>Application Owner Information</div>
                                <div className="pt0 pl3 pr3">
                                    <Row gutter={5}>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>Region</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('region', {})
                                                    (<Select size="small" className={`${cls['lh0']}`} disabled={true}></Select>)
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>Area</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('area', {})
                                                    (<Select size="small" className={`${cls['lh0']}`} disabled={true}></Select>)
                                                }
                                            </FormItem> 
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>Zone</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('zone', {})
                                                    (<Select size="small" className={`${cls['lh0']}`} disabled={true}></Select>)
                                                }
                                            </FormItem> 
                                        </Col>
                                    </Row>                                                                            
                                    <Row gutter={5}> 
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>Sales Channel</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('sale_channel', {})
                                                    (<Select size="small" className={`${cls['lh0']}`} disabled={true}></Select>)
                                                }
                                            </FormItem>   
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>Team</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('branch', {})
                                                    (<Select size="small" className={`${cls['lh0']}`} disabled={true}></Select>)
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>Employee</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('employee', {})
                                                    (<Select size="small" className={`${cls['lh0']}`} disabled={true}></Select>)
                                                }
                                            </FormItem>   
                                        </Col>
                                    </Row>
                                    <Row gutter={5}> 
                                        
                                    </Row>
                                </div>
                            </Card> 

                            <Card className={`${cls['mt0']} ${cls['p0']}`}>
                                <div className={`ttu pl3 ${cls['pclr6']}`}>{`Application Information`}</div>
                                <div className="pt0 pl3 pr3">
                                    <FormItem label={(<span className={`${cls['f0_9']}`}>Application No</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('employee', {})
                                            (<Input size="small" className={`${cls['lh0']}`} />)
                                        }
                                    </FormItem>
                                </div>
                            </Card>

                            <Card className={`${cls['mt0']} ${cls['p0']}`}>
                                <div className={`ttu pl3 ${cls['pclr6']}`}>{`Channel Information`}</div>
                                <div className="pt0 pl3 pr3">
                                    <Row gutter={5}>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>Channel Group</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.channel_group} hasFeedback>
                                                {
                                                    getFieldDecorator('channel_group', { initialValue: (data && data.ChannelID) ? `${data.ChannelID}` : null })
                                                    (
                                                        <Select size="small" onChange={this.handleSelectCriteriaPass.bind(this, 'channel_group')}>
                                                            <Option value="">โปรดเลือกรายการ</Option>
                                                            {
                                                                _.map(masterPlugin.channel_group, (v) => {
                                                                    return (<Option key={v.ChannelCode} value={v.ChannelID}>{v.ChannelName}</Option>) 
                                                                })
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem> 
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>Channel Source</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.channel_source} hasFeedback>
                                                {
                                                    getFieldDecorator('channel_source', { initialValue: (data && data.SourceID) ? `${data.SourceID}` : null })
                                                    (
                                                        <Select size="small" onChange={this.handleSelectCriteriaPass.bind(this, 'channel_source')} disabled={channelsource_has_sel}>
                                                            {
                                                                _.map(master_channelsource, (v,i) => {
                                                                    return (<Option key={v.SourceID} value={v.SourceID} disabled={(v.IsDropdownEnable == 'Y') ? false : true}>{v.SourceName}</Option>) 
                                                                })
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem> 
                                        </Col>
                                    </Row>
                                </div>
                            </Card>

                            <Card className={`${cls['mt10a0']} ${cls['p0']}`}>
                                <div className={`ttu pl3 ${cls['pclr2']}`}>Purpose Information</div>
                                <div className="pt0 pl3 pr3">
                                    <Row gutter={5}>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>Purpose Reason</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.purpose_reason} hasFeedback>
                                                {
                                                    getFieldDecorator('purpose_reason', { initialValue: (data && data.PurposeReason) ? data.PurposeReason : null })
                                                    (
                                                        <Select size="small" onChange={this.handleSelectCriteriaPass.bind(this, 'purpose_reason')}>
                                                            {
                                                                _.map(master_purpose, (v,i) => {
                                                                    return (<Option key={`PP-${i}`} value={v.purpose_code}>{v.purpose_reason}</Option>) 
                                                                })
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem> 
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>Product Group</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('request_prduct', { initialValue: (data && data.ProductGroup) ? data.ProductGroup : null })
                                                    (
                                                        <Select size="small">
                                                            {
                                                                _.map(masterPlugin.product_transfer, (v,i) => {
                                                                    return (<Option key={`RQP-${i}`} value={v.PGCode} disabled={(v.DropdownEnable == 'Y') ? false : true}>{v.PGLabel}</Option>) 
                                                                })
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem> 
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>Campaign</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('request_campaign', {})
                                                    (
                                                        <Select size="small" disabled={true} placeholder="Unavaliable"></Select>
                                                    )
                                                }
                                            </FormItem> 
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>Request Loan</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.request_loan} hasFeedback>
                                                {
                                                    getFieldDecorator('request_loan', { initialValue: (data && data.RequestLoan) ? data.RequestLoan : null })
                                                    (<InputNumber min={0} max={9999999999} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} size="small" className={`${cls['lh0']} ${cls['wfscreen']}`} onKeyUp={this.handleInputCriteriaPass.bind(this, 'request_loan')} />)
                                                }
                                            </FormItem> 
                                        </Col>
                                    </Row>
                                </div>
                            </Card>

                            <Card className={`${cls['mt10a0']} ${cls['p0']}`}>
                                <div className={`ttu pl3 ${cls['pclr5']}`}>Media Channel Information</div>
                                <div className="pt0 pl3 pr3">
                                
                                    <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>Media Channel</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.media_channel} hasFeedback>
                                        {
                                            getFieldDecorator('media_channel', { initialValue: (data && data.SubMediaChannel) ? data.SubMediaChannel : null })
                                            (   <Select size="small" onChange={this.handleSelectCriteriaPass.bind(this, 'media_channel')}>
                                                    {
                                                          _.map(_.uniqWith(master_mediachannel, _.isEqual), (v,i) => {
                                                            return (<Option key={`MCH-${i}-${moment().format('dmYHis')}`} value={v.media_ch_code}>{v.media_ch_name}</Option>) 
                                                        })
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                    <span className={`${cls['text_notice']}`}>(ลูกค้ารับรู้สื่อของธนาคารผ่านช่องทางใด)</span>
                                </div>
                            </Card>

                            <Card className={`${cls['mt10a0']} ${cls['p0']}`}>
                                <div className={`ttu pl3 ${cls['pclr8']}`}>Appointment  Information</div>
                                <div className="pt0 pl3 pr3">
                                    <span style={{ fontSize: '0.8em' }}>ยังไม่พร้อมใช้งาน</span>
                                </div>
                            </Card>

                        </Col>
                        <Col span={8}>
                            <Card className={`${cls['m0']} ${cls['p0']}`}>
                                <div className={`ttu pl3 ${cls['pclr3']}`}>Personal Information</div>
                                <div className="pt0 pl3 pr3">

                                    <FormItem className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_ordinarytype} hasFeedback>
                                        <span className={`${cls['f0_9']} ttu fw5`} style={{ marginRight: '10px', color: 'rgba(0,0,0,.85)' }}>Ordinary Type:</span>
                                        {
                                            getFieldDecorator('customer_ordinarytype', { initialValue: (data && data.OrdinaryType) ? data.OrdinaryType : null })
                                            (
                                                <RadioGroup onChange={this.handleSelectCriteriaPass.bind(this, 'customer_ordinarytype')} style={{ width: '240px' }}>
                                                    <Radio value="1" className={`${cls['f0_9']}`}>บุคคลธรรมดา</Radio>
                                                    <Radio value="2" className={`${cls['f0_9']}`}>นิติบุคคล</Radio>
                                                </RadioGroup>
                                            )
                                        }
                                    </FormItem>

                                    <FormItem label={(<span className={`${cls['f0_9']}`}>ID Card</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('customer_idcard', { initialValue: (data && data.CitizenID) ? data.CitizenID : null })
                                            (<Input size="small" className={`${cls['lh0']}`} />)
                                        }
                                    </FormItem> 

                                    <Row gutter={5}>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>Customer Group</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_group} hasFeedback>
                                                {
                                                    getFieldDecorator('customer_group', { initialValue: (data && data.CustomerGroup) ? `${data.CustomerGroup}` : null })
                                                    (
                                                        <Select size="small" onChange={this.handleCustGroup.bind(this, 'customer_group')}>
                                                            <Option value="">โปรดระบุข้อมูล</Option>
                                                            {
                                                                _.map(masters.customer_groups, (v) => {
                                                                    return ( <Option key={v.CustGroupCode} value={v.CustGroupID}>{v.CustGroupName}</Option>)
                                                                })                                                                
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem> 
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>Customer Type</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_type} hasFeedback>
                                                {
                                                    getFieldDecorator('customer_type', { initialValue: (data && data.CustomerType) ? data.CustomerType : null })
                                                    (
                                                        <Select size="small" onChange={this.handleSelectCriteriaPass.bind(this, 'customer_type')} disabled={custgroup_hasSel}>
                                                            {
                                                                _.map(master_custtype, (v) => {
                                                                    return ( <Option key={v.CustTypeCode} value={v.CustTypeCode}>{v.CustTypeName}</Option>)
                                                                })                                                                
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem> 
                                        </Col>
                                    </Row>
                                   
                                   <Row gutter={5}>
                                        <Col span={6}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>Prefix</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_prefix} hasFeedback>
                                                {
                                                    getFieldDecorator('customer_prefix', { initialValue: (data && data.CustomerPrefix) ? data.CustomerPrefix : null })
                                                    (
                                                        <Select size="small" onChange={this.handleSelectCriteriaPass.bind(this, 'customer_prefix')}>
                                                            { 
                                                                _.map(masters.customer_prefix, (v, i) => { 
                                                                    return (<Option key={v.PrefixCode} value={v.PrefixCode}>{v.PrefixShortName}</Option>) 
                                                                }) 
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={9}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>Name</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_name} hasFeedback>
                                                {
                                                    getFieldDecorator('customer_name', { initialValue: (data && data.ChannelName) ? data.ChannelName : null })
                                                    (<Input size="small" className={`${cls['lh0']}`} onKeyUp={this.handleInputCriteriaPass.bind(this, 'customer_name')} />)
                                                }
                                            </FormItem> 
                                        </Col>
                                        <Col span={9}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>Surname</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}  validateStatus={form_validate.customer_surname} hasFeedback>
                                                {
                                                    getFieldDecorator('customer_surname', { initialValue: (data && data.CustomerSurname) ? data.CustomerSurname : null })
                                                    (<Input size="small" className={`${cls['lh0']}`} onKeyUp={this.handleInputCriteriaPass.bind(this, 'customer_surname')} />)
                                                }
                                            </FormItem>
                                        </Col>
                                   </Row>
                                   
                                   <Row gutter={5}>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>Occupation</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_occupation} hasFeedback>
                                                {
                                                    getFieldDecorator('customer_occupation', { initialValue: (data && data.Occupation) ? data.Occupation : null })
                                                    (
                                                        <Select size="small" className={`${cls['lh0']}`} onChange={this.handleSelectCriteriaPass.bind(this, 'customer_occupation')}>                                                            
                                                            { 
                                                                _.map(master_occupation, (v, i) => {
                                                                    return (<Option key={`OC-${i}`} value={v.occupation_code}>{v.occupation_name}</Option>)
                                                                }) 
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>Age</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} style={{ marginTop: '5px' }} validateStatus={form_validate.customer_age} hasFeedback>
                                                {
                                                    getFieldDecorator('customer_age', { initialValue: (data && data.CustomerAge) ? data.CustomerAge : null })
                                                    (<InputNumber min={0} max={150} maxLength={3} size="small" className={`${cls['lh0']}  ${cls['wfscreen']}`} onChange={this.handleNumberCriteriaPass.bind(this, 'customer_age')} />)
                                                }
                                            </FormItem> 
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>Salaray</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('customer_revenue', { initialValue: (data && data.Revenue) ? data.Revenue : null })
                                                    (<InputNumber min={0} max={9999999999} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} size="small" className={`${cls['lh0']} ${cls['wfscreen']}`} />)
                                                }
                                            </FormItem> 
                                        </Col>
                                   </Row>

                                   <Row gutter={5}>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>Mobile Number</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('customer_mobile', { initialValue: (data && data.Mobile) ? data.Mobile : null })
                                                    (<Input size="small" className={`${cls['lh0']}`} />)
                                                } 
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>Home Number</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('customer_hometel', { initialValue: (data && data.HomeTel) ? data.HomeTel : null })
                                                    (<Input size="small" className={`${cls['lh0']}`}  />)
                                                }
                                            </FormItem>
                                        </Col>
                                       
                                    </Row>   
                       
                                    <FormItem label={(<span className={`${cls['f0_9']}`}>Email</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('customer_email', { initialValue: (data && data.Email) ? data.Email : null })
                                            (<Input size="small" className={`${cls['lh0']}`} />)
                                        }
                                    </FormItem> 

                                    <FormItem label={(<span className={`${cls['f0_9']}`}>Address</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('customer_address', { initialValue: (data && data.Address) ? data.Address : null })
                                            (<TextArea rows={1} />)
                                        }
                                    </FormItem> 

                                    <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>Province</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['mb0']} ttu fw5`} style={{ marginTop: '5px' }} validateStatus={form_validate.customer_province} hasFeedback>
                                        {
                                            getFieldDecorator('customer_province', { initialValue: (data && data.ProvinceID) ? data.ProvinceID : null })
                                            (
                                                <Select size="small" onChange={this.handleSelectCriteriaPass.bind(this, 'customer_province')}>
                                                    <Option value="">โปรดเลือกข้อมูลจังหวัด</Option>
                                                    { 
                                                        _.map(masters.province, (v, i) => {
                                                            return (<Option key={`PROV-${i}`} value={v.ProvinceID}>{v.ProvinceNameTh}</Option>)
                                                        }) 
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem> 
                                    <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>Amphoe</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_amphoe} hasFeedback>
                                        {
                                            getFieldDecorator('customer_amphoe', { initialValue: (data && data.AmphoeID) ? data.AmphoeID : null })
                                            (
                                                <Select size="small" onChange={this.handleSelectCriteriaPass.bind(this, 'customer_amphoe')} disabled={province_has_sel}>
                                                    { 
                                                        _.map(master_amphoe, (v, i) => {
                                                            return (<Option key={`AMPH-${i}`} value={v.AmphoeID}>{v.AmphoeNameTh}</Option>)
                                                        }) 
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                    <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>Tumbon</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_tumbon} hasFeedback>
                                        {
                                            getFieldDecorator('customer_tumbon', { initialValue: (data && data.TumbonID) ? data.TumbonID : null })
                                            (
                                                <Select size="small" onChange={this.handleDistrict.bind(this, 'customer_tumbon')} disabled={amphoe_has_sel}>
                                                    { 
                                                        _.map(master_tumbon, (v, i) => {
                                                            return (<Option key={`AMPH-${i}`} value={v.TumbonID}>{`${v.TumbonNameTh} (${v.ZipCode})`}</Option>)
                                                        }) 
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                    <FormItem label={(<span className={`${cls['f0_9']}`}>Zipcode</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_zipcode} hasFeedback>
                                        {
                                            getFieldDecorator('customer_zipcode', { initialValue: (data && data.Postcode) ? data.Postcode : null })
                                            (<Input size="small" className={`${cls['lh0']}`} disabled={true} />)
                                        }
                                    </FormItem> 
                                   
                                </div>                       
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className={`${cls['m0']} ${cls['p0']}`}>
                                <div className={`ttu pl3 ${cls['pclr4']}`}>Company Information</div>
                                <div className="pt0 pl3 pr3">

                                    <FormItem label={(<span className={`${cls['f0_9']}`}>Business Registration</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('business_registration', { initialValue: (data && data.BusinessRegistration) ? data.BusinessRegistration : null })
                                            (<Input size="small" className={`${cls['lh0']}`} />)
                                        }
                                    </FormItem> 

                                    <FormItem label={(<span className={`${cls['f0_9']}`}>Company Name</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('company_name', { initialValue: (data && data.CompanyName) ? data.CompanyName : null })
                                            (<Input size="small" className={`${cls['lh0']}`} />)
                                        }                                   
                                    </FormItem> 

                                    <Row gutter={5}>
                                        <Col span={18}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>Business Type</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('business_type', { initialValue: (data && data.BusinessType) ? data.BusinessType : null })
                                                    (
                                                        <Select size="small">
                                                            {
                                                                _.map(master_businesstype, (v,i) => {
                                                                    return (<Option key={`bU-${i}`} value={v.business_code}>{v.business_name}</Option>)
                                                                })
                                                            }
                                                        </Select>
                                                    )

                                                }
                                            </FormItem> 
                                        </Col>
                                        <Col span={6}>
                                            <FormItem className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['form_addhoc']} ${cls['mt21']} ${cls['mb0']} ttu fw5`}>
                                            {
                                                getFieldDecorator('is_Owner', { initialValue: (data && data.IsOwner) ? true : false })
                                                (
                                                    <Checkbox size="small">
                                                        <span style={{ fontSize: '0.85em', color: 'gray' }}>Is Owner</span>
                                                    </Checkbox>                                
                                                )
                                            }
                                        </FormItem> 
                                        </Col>
                                    </Row>
                                
                                    <FormItem label={(<span className={`${cls['f0_9']}`}>Business Description</span>)}  className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('business_description', { initialValue: (data && data.BusinessDescription) ? data.BusinessDescription : null })
                                            (<TextArea rows={3}></TextArea>)
                                        }
                                    </FormItem> 

                                    <FormItem label={(<span className={`${cls['f0_9']}`}>Year In Business</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['mb0']} ttu fw5`} style={{ marginTop: '5px' }} validateStatus={form_validate.yib} hasFeedback>
                                        {
                                            getFieldDecorator('yib', { initialValue: (data && data.YIB) ? data.YIB : null })
                                            (<InputNumber min={0} max={999} size="small" className={`${cls['lh0']}`} onChange={this.handleNumberCriteriaPass.bind(this, 'yib')} />)
                                        }
                                    </FormItem> 
                                        
                                    <FormItem label={(<span className={`${cls['f0_9']}`}><Tooltip placement="right" title="Year In Business">Guarantor</Tooltip></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['mb0']} ttu fw5`} style={{ marginTop: '5px' }}>
                                        {
                                            getFieldDecorator('have_guarantor', { initialValue: (data && data.Guarantor) ? true : false })
                                            (
                                                <Checkbox size="small">
                                                    <span className={`${cls['f0_9']}`}>มีผู้ค้ำประกันหรือไม่</span>
                                                </Checkbox>                                
                                            )
                                        }
                                    </FormItem> 
                                </div>                                    
                            </Card>

                            <Card className={`${cls['mt10a0']} ${cls['p0']}`}>
                                <div className={`ttu pl3 ${cls['pclr7']}`}>Collateral Information</div>
                                <div className="pt0 pl3 pr3">
                                    <FormItem className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                    {
                                        getFieldDecorator('is_collateral', { initialValue: (data && data.IsCollateral) ? data.IsCollateral : 'N' })
                                        (
                                            <RadioGroup onChange={this.handleIsCollateral}>
                                                <Radio value="N" className={`${cls['f0_9']}`}>ไม่มีหลักประกัน</Radio>
                                                <Radio value="Y" className={`${cls['f0_9']}`}>มีหลักประกัน</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                    <FormItem label={(<span className={`${cls['f0_9']}`}>Collateral</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.collateral_type} hasFeedback>
                                        {
                                            getFieldDecorator('collateral_type', { initialValue: (data && data.CollateralType) ? data.CollateralType : null })
                                            (
                                                <Select size="small" onChange={this.handleSelectCriteriaPass.bind(this, 'collateral_type')} disabled={iscollater_disable}>
                                                    {
                                                        _.map(master_collateral, (v,i) => {
                                                            return (<Option key={`bU-${i}`} value={v.collateral_code}>{v.collateral_name}</Option>)
                                                        })
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem> 
                                </div>
                            </Card>

                        </Col>
                    </Row>
                    <div style={{ position: 'absolute', bottom: '0px', right: '10px' }}>
                        <ButtonGroup size="large" className="fr">
                            <Button type="dash" onClick={this.handleCancel}>
                                <Icon type="poweroff" /> CLOSE
                            </Button>
                            <Button type="primary" htmlType="submit" disabled={true}>
                                <Icon type="save" /> SUBMIT
                            </Button>
                        </ButtonGroup>
                    </div>
                </Form>                
            </Modal>
        )
    }
    
    handleNumberValidate(key, e) {
        let onlyNums = e.target.value.replace(/[^0-9]/g, '')
        this.setState({ form_fields: _.assignIn({}, this.state.form_fields, { customer_mobile: onlyNums }) })
    }

    handleCustGroup = (attrName, dataVal) => {
        const { setFieldsValue } = this.props.form
        this.handleSelectCriteriaPass(attrName, `${dataVal}`)
        setFieldsValue({ customer_type: '' })
    }

    handleDistrict = (attrName, dataVal) => {
        const { setFieldsValue } = this.props.form
        const { masters: { district } } = this.props

        this.handleSelectCriteriaPass(attrName, dataVal)

        let filter_district = _.filter(district, { TumbonID: dataVal })[0]
        if(filter_district && filter_district.ZipCode) {
            setFieldsValue({ customer_zipcode: filter_district.ZipCode })
        }
    }

    handleIsCollateral = (collateral) => {
        const { setFieldsValue } = this.props.form
        if(!collateral || collateral.target.value == 'N') {
            setFieldsValue({ collateral_type: '' })
        }
    }

    handleValidateEmail = (str_email) =>{
        let sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]'
        let sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]'
        let sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+'
        let sQuotedPair = '\\x5c[\\x00-\\x7f]'
        let sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d'
        let sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22'
        let sDomain_ref = sAtom
        let sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')'
        let sWord = '(' + sAtom + '|' + sQuotedString + ')'
        let sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*'
        let sLocalPart = sWord + '(\\x2e' + sWord + ')*'
        let sAddrSpec = sLocalPart + '\\x40' + sDomain
        let str_validEmail = '^' + sAddrSpec + '$'
      
        let validEmail = new RegExp(str_validEmail);
      
        return validEmail.test(str_email)
    }

    handleNumberCriteriaPass = (attrName, dataVal) => {       
        if(dataVal && dataVal > 0) {
            this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { [attrName]: 'success' })  })
        } else {
            this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { [attrName]: 'error' })  })
        }
    }

    handleInputCriteriaPass = (attrName, dataVal) => {       
        if(!_.isEmpty(dataVal.target.value) && dataVal.target.value.length > 5) {
            this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { [attrName]: 'success' })  })
        } else {
            this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { [attrName]: 'error' })  })
        }
    }
    
    handleSelectCriteriaPass = (attrName, dataVal) => {
        let data = (typeof dataVal == 'number') ? `${dataVal}` : dataVal
        if(!_.isEmpty(data)) {
            this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { [attrName]: 'success' })  })
        } else {
            this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { [attrName]: 'error' })  })
        }

    }

    // This is funtion handle form mangement for sent data to referral system
    handleSubmit = (e) => {
        e.preventDefault();

        const { form: { validateFields } } = this.props

        validateFields((err, fieldData) => {
            if(!err) {

                const title_notify = 'แจ้งเตือนจากระบบ'
            
                // CHANNEL VALIDATION
                if(!fieldData.channel_group) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { channel_group: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดเลือกกลุ่มช่องทางที่มาของลูกค้า')
                    return false
                } 

                if(!fieldData.channel_source) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { channel_source: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดเลือกประเภทช่องทางที่มาของลูกค้า')
                    return false
                } 

                // PURPOSE VALIDATION
                if(!fieldData.purpose_reason) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { purpose_reason: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดเลือกเหตุผลในการนำวงเงินไปใช้')
                    return false
                }

                if(!fieldData.request_loan) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { request_loan: 'error' })  })
                    this.handleNotify('error', title_notify, <div>โปรดระบุวงเงินที่ลูกค้าต้องการ <br/>(หมายเหตุ: เพื่อใช้ในการนำเสนอกลุ่มโปรแกรมได้ตรงกับความต้องการของลูกค้า)</div>)
                    return false
                } 

                if(fieldData.request_loan < 10000) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { request_loan: 'error' })  })
                    this.handleNotify('error', title_notify, 'กรุณาระบุวงเงินให้ถูกต้อง')
                    return false
                } 

                // CHANNEL VALIDATION
                if(!fieldData.media_channel) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { media_channel: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดเลือกประเภทของสือที่ทำให้ลูกค้ารู้จักเรา')
                    return false
                } 

                // CUSTOMER VALIDATION
                if(!fieldData.customer_ordinarytype) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_ordinarytype: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดเลือกกลุ่มของลูกค้า')
                    return false
                } 

                if(!fieldData.customer_group) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_group: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดเลือกกลุ่มของลูกค้า')
                    return false
                } 

                if(!fieldData.customer_type) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_type: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดเลือกประเภทของลูกค้า')
                    return false
                } 

                if(!fieldData.customer_prefix) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_prefix: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดเลือกประเภทคำนำหน้าของลูกค้า')
                    return false
                } 

                if(!fieldData.customer_name) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_name: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดกรอกชื่อของลูกค้า')
                    return false
                } 

                if(!fieldData.customer_surname) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_surname: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดกรอกนามสกุลของลูกค้า')
                    return false
                } 

                if(!fieldData.customer_occupation) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_occupation: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดเลือกอาชีพของลูกค้า')
                    return false
                } 

                if(!fieldData.customer_age) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_age: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดระบุอายุของลูกค้า')
                    return false
                }

                if(!fieldData.customer_mobile) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_mobile: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดกรอกเบอร์ติดต่อของลูกค้า (เบอร์มือถือ)')
                    return false
                } 
                
                if(!fieldData.customer_province) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_province: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดเลือกจังหวัดของลูกค้า')
                    return false
                } 
                
                if(!fieldData.customer_amphoe) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_amphoe: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดเลือกอำเภอของลูกค้า')
                    return false
                } 
                
                if(!fieldData.customer_tumbon) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_tumbon: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดเลือกตำบลของลูกค้า')
                    return false
                } 

                // COMPANY VALIDATION : IF HAVE THE COMPANY IS FORCE VALIDATION
                if(fieldData.company_name) {

                    if(!fieldData.yib) {
                        this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { yib: 'error' })  })
                        this.handleNotify('error', title_notify, 'โปรดระบุอายุกิจการของลูกค้า')
                        return false
                    } 

                } 
        
                // COLLATERAL VALIDATION
                if(fieldData.is_collateral == 'Y') {
                    if(!fieldData.collateral_type) {
                        this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { collateral_type: 'error' })  })
                        this.handleNotify('error', title_notify, 'โปรดเลือกประเภทของหลักประกัน')
                        return false
                    } 
                }
                
                // FIELD ALL PASS VALIDATION
                let handleAddCustomer = this.handleCreateDataSubmit
                confirm({
                    title: 'กรุณายืนยันการบันทึกข้อมูล',
                    content: 'โปรดตรวจสอบข้อมูลให้ถูกก่อนยืนยันการบันทึกข้อมูล กรุณาข้อมูลถูกต้อง คลิก OK หรือ Cancel เพื่อยกเลิก',
                    onOk() {
                        handleAddCustomer(fieldData)
                        
                    },
                    onCancel() {},
                })
                
            }

        })

    }

    handleCreateDataSubmit = (resp) => {
        const { authen, masters, CREATE_CUSTOMER } = this.props

        let auth_code = (authen && !_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null
        let create_id = (authen && !_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null 
        let create_name = (authen && !_.isEmpty(authen.Auth)) ? authen.Auth.EmpName_EN.replace('+', ' ') : null

        let province = _.filter(masters.province, { ProvinceID: resp.customer_province })[0]
        let amphoe = _.filter(masters.amphoe, { AmphoeID: resp.customer_amphoe })[0]
        let tumbon = _.filter(masters.district, { TumbonID: resp.customer_tumbon })[0]
       
        if(auth_code && !_.isEmpty(auth_code)) {
            let requestData = {
                AuthID: auth_code,
                ChannelID: (resp && resp.channel_group) ? resp.channel_group : null,
                SourceID: (resp && resp.channel_source) ? resp.channel_source : null,
    
                PurposeReason: (resp && resp.purpose_reason) ? resp.purpose_reason : null,
                RequestProductLoan: (resp && resp.request_prduct) ? resp.request_prduct : null,
                RequestCampaign: (resp && resp.request_campaign) ? resp.request_campaign : null,
                RequestLoan: (resp && resp.request_loan) ? resp.request_loan : null,
    
                MediaChannel: null,
                SubMediaChannel: (resp && resp.media_channel) ? resp.media_channel : null,
                
                OrdinaryType: (resp && resp.customer_ordinarytype) ? resp.customer_ordinarytype : null,
                PotentialCode: null,
                Nationality: 'ไทย',
                CitizenID: (resp && resp.customer_idcard) ? resp.customer_idcard : null,
                CustomerGroup: (resp && resp.customer_group) ? `${resp.customer_group}` : null,
                CustomerType: (resp && resp.customer_type) ? resp.customer_type : null,
                CustomerPrefix: (resp && resp.customer_prefix) ? resp.customer_prefix : null,                   
                CustomerName: (resp && resp.customer_name) ? resp.customer_name : null,
                CustomerSurname: (resp && resp.customer_surname) ? resp.customer_surname : null,
                Occupation: (resp && resp.customer_occupation) ? resp.customer_occupation : null,
                CustomerAge: (resp && resp.customer_age) ? resp.customer_age : null,
                Revenue: (resp && resp.customer_revenue) ? resp.customer_revenue : null,
                Mobile: (resp && resp.customer_mobile) ? resp.customer_mobile : null,
                HomeTel: (resp && resp.customer_hometel) ? resp.customer_hometel : null,
                Email: (resp && resp. customer_email) ? resp. customer_email : null,
                Address: (resp && resp.customer_address) ? resp.customer_address: null,
                Province: (province) ? province.ProvinceNameTh : null,
                Amphoe: (amphoe) ? amphoe.AmphoeNameTh : null,
                Tumbon: (tumbon) ? tumbon.TumbonNameTh : null,
                Postcode: (resp && resp.customer_zipcode) ? `${resp.customer_zipcode}` : null,
    
                BusinessRegistration: (resp && resp.business_registration) ? resp.business_registration : null,
                CompanyName: (resp && resp.company_name) ? resp.company_name : null,
                IsOwner: (resp && resp.is_Owner) ? 'Y' : 'N',
                BusinessType: (resp && resp.business_type) ? resp.business_type : null,   
                BusinessDescription: (resp && resp.business_description) ? resp.business_description : null,
                YIB: (resp && resp.yib) ? resp.yib : null,
                Guarantor: (resp && resp. have_guarantor) ? 'Y' : 'N',
                IsCollateral: (resp && resp.is_collateral) ? resp.is_collateral : null,
                CollateralType: (resp && resp.collateral_type) ? resp.collateral_type : null,
    
                CreateEventType: 'KeyIn',
                CreateID: create_id,
                CreateName: create_name
            }
    
            // CREATE_CUSTOMER(requestData)
            
        } else {
            this.handleNotify('error', 'เกิดข้อผิดพลาดในระบบ', 'ขออภัย, เกิดข้อผิดพลาดในการบันทึกข้อมูล เนื่องจากเซคชั่นหมดอายุ กรุณารีเฟรชหน้าจอใหม่')
        }

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

const GridChannelUpdateProfileForm = Form.create()(GridChannelUpdateProfile)
export default connect(
    (state) => ({        
        masters: {
            customer_prefix: state.LEAD_MASTER_CUSTOMER_PREFIX,
            customer_groups: state.LEAD_MASTER_CUSTOMER_GROUP,
            customer_types: state.LEAD_MASTER_CUSTOMER_TYPE,
            province: state.LEAD_MASTER_PROVINCE,
            amphoe: state.LEAD_MASTER_AMPHOE,
            district: state.LEAD_MASTER_DISTRICT
        }
    }),
    {
        LOAD_MASTERCUST_PREFIX: getLeadMasterCustomerPrefix,
        LOAD_MASTERCUST_GROUP: getLeadMasterCustomerGroup,
        LOAD_MASTERCUST_TYPES: getLeadMasterCustomerType,
        LOAD_MASTER_PROVINCE: getLeadMasterProvince,
        LOAD_MASTER_AMPHOE: getLeadMasterAmphoe,
        LOAD_MASTER_DISTRICT: getLeadMasterDistrict,

        CREATE_CUSTOMER: LeadChannelAddCustomer
        
    }
)(GridChannelUpdateProfileForm)
