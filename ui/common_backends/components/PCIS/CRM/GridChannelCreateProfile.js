import React, { Component } from 'react'
import { connect } from 'react-redux'
import bluebird from 'bluebird'
import { Form, Modal, Card, Input, InputNumber, DatePicker, TimePicker, Select, Checkbox, Radio, Button, Icon, Row, Col, AutoComplete, notification } from 'antd'
import moment from 'moment'
import _ from 'lodash'

import {
    /*getLeadMasterCustomerPrefix,*/
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
const { TextArea, Search } = Input
const InputGroup = Input.Group
const Option = Select.Option
const RadioGroup = Radio.Group
const ButtonGroup = Button.Group
const confirm = Modal.confirm
const AutoCompleteOption = AutoComplete.Option

const timeFormat = 'HH:mm'

const field_default_validate = {            
    channel_group: '',
    channel_source: '',
    purpose_reason: '',
    request_prduct: '',
    request_campaign: '',
    request_loan: '',
    media_channel: '',
    collateral_type: '',
    customer_time_convenient: '',
    customer_ordinarytype: '',   
    customer_group: '',
    customer_type: '',
    customer_prefix: '',                   
    customer_name: '',
    customer_surname: '',  
    customer_gender: '',
    customer_age: '',
    customer_idcard: '',
    customer_occupation: '',
    customer_revenue: '',
    customer_otherincome: '',
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
    is_collateral: ''
}

class GridChannelCreateProfile extends Component {

    state = {
        dataLocation: [],
        form_validate: field_default_validate
    }

    componentWillMount() {
        const { 
            /*LOAD_MASTERCUST_PREFIX,*/
            LOAD_MASTERCUST_GROUP, 
            LOAD_MASTERCUST_TYPES, 
            LOAD_MASTER_PROVINCE, 
            LOAD_MASTER_AMPHOE, 
            LOAD_MASTER_DISTRICT 
        } = this.props

        const API_DEFAULT_CALL = [
            /*LOAD_MASTERCUST_PREFIX,*/
            LOAD_MASTERCUST_GROUP,
            LOAD_MASTERCUST_TYPES,
            LOAD_MASTER_PROVINCE, 
            LOAD_MASTER_AMPHOE, 
            LOAD_MASTER_DISTRICT
        ]

        bluebird.all(API_DEFAULT_CALL).each((f) => f())
    }
    
    componentDidMount() {
        _.delay(() => { $('#customer_mobile').mask("999-999-9999") }, 1000)

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
        const { isOpen, masters, masterPlugin } = this.props
        const { getFieldDecorator, getFieldValue } = this.props.form

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

        // CUSTOMER: PROVINCE >> AMPHONE
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

        // CUSTOMER: AMPHONE >> TUMBON
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

        let customer_zipcode_isnull = true
        let customer_zipcode = getFieldValue('customer_zipcode')
        if(customer_zipcode && customer_zipcode !== '') {
            customer_zipcode_isnull = false
        } else {
            customer_zipcode_isnull = true
        }

        // BUSINESS: PROVINCE >> AMPHONE
        let master_amphoe_business = []
        let province_business_has_sel = true
        let sel_province_business = getFieldValue('business_province') 
        if(sel_province_business && sel_province_business !== '') {
            let filter_amphoe_business = _.filter(masters.amphoe, { ProvinceID: sel_province_business })
            master_amphoe_business = filter_amphoe_business
            province_business_has_sel = false
        } else {
            master_amphoe_business = masters.amphoe
            province_business_has_sel = true
        }

        console.log(sel_province_business, (sel_province_business && sel_province_business !== ''), province_business_has_sel)
 
        // BUSINESS: AMPHONE >> TUMBON
        let master_tumbon_business = []
        let amphoe_business_has_sel = true
        let sel_amphoe_business = getFieldValue('business_amphoe')

        if(sel_amphoe_business && sel_amphoe_business !== '') {
            let filter_district_business = _.filter(masters.district, { AmphoeID: sel_amphoe_business })
            master_tumbon_business = filter_district_business
            amphoe_business_has_sel = false
        } else {
            master_tumbon_business = masters.district
            amphoe_business_has_sel = true
        }

        // CONVENIENT
        let customer_convenient_begin = true
        let customer_convenient_data = getFieldValue('customer_convenient_from')
        if(moment(customer_convenient_data, timeFormat).format(timeFormat) !== 'Invalid date') {
            customer_convenient_begin = false
        } else {
            customer_convenient_begin = true
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
                    <div className={`${cls['lead_title']} ttu`}> Profile Information</div>
                    <Row gutter={5}>
                        <Col span={8}>                        
                            <Card className={`${cls['mt0']} ${cls['p0']}`}>
                                <div className="pt0 pl3 pr3">
                                    <div className={`ttu ${cls['pclr2']}`}>Lead Channel</div>
                                    <Row gutter={5}>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>Lead Category<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.channel_group} hasFeedback>
                                                {
                                                    getFieldDecorator('channel_group', {})
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
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>Data Source<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.channel_source} hasFeedback>
                                                {
                                                    getFieldDecorator('channel_source', {})
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
                                <div className="pt0 pl3 pr3">
                                    <div className={`ttu ${cls['pclr2']}`}>Loan Purpose</div>
                                    <Row gutter={5}>                                       
                                        <Col span={24}>                                            
                                            <FormItem className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {/* <span className={`${cls['f0_9']} ttu fw5`} style={{ marginRight: '10px', color: 'rgba(0,0,0,.85)' }}>กลุ่มโปรดักซ์<span className="red">*</span> :</span> */}
                                                {
                                                    getFieldDecorator('request_prduct', {})
                                                    (
                                                        <RadioGroup>
                                                            {
                                                                _.map(masterPlugin.product_transfer, (v,i) => {
                                                                    return (<Radio className={`${cls['f0_9']}`} key={`RQP-${i}`} value={v.PGCode} disabled={(v.DropdownEnable == 'Y') ? false : true}>{v.PGDigit}</Radio>) 
                                                                })
                                                            }
                                                        </RadioGroup>
                                                    )
                                                }
                                            </FormItem> 
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>เหตุผลในการขอสินเชื่อ<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.purpose_reason} hasFeedback>
                                                {
                                                    getFieldDecorator('purpose_reason', {})
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
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>วงเงินที่ลูกค้าต้องการ<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.request_loan} hasFeedback>
                                                {
                                                    getFieldDecorator('request_loan', {})
                                                    (<InputNumber min={0} max={9999999999} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} size="small" className={`${cls['lh0']} ${cls['wfscreen']}`} onKeyUp={this.handleInputCriteriaPass.bind(this, 'request_loan')} />)
                                                }
                                            </FormItem>                                             
                                        </Col>
                                        <Col span={24}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>Campaign</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('request_campaign', {})
                                                    (
                                                        <Select size="small" disabled={true} placeholder="ยังไม่พร้อมใช้งาน"></Select>
                                                    )
                                                }
                                            </FormItem> 
                                        </Col>
                                    </Row>
                                </div>
                            </Card>

                            <Card className={`${cls['mt10a0']} ${cls['p0']}`}>
                                <div className="pt0 pl3 pr3">                                
                                    <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>ลูกค้ารับรู้สื่อของธนาคารผ่านช่องทางใด<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.media_channel} hasFeedback>
                                        {
                                            getFieldDecorator('media_channel', {})
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
                                </div>
                            </Card>
                            
                            <Card className={`${cls['mt10a0']} ${cls['p0']}`}>
                                <div className="pt0 pl3 pr3">                    
                                    <FormItem label={(<span className={`${cls['f0_9']}`}>เลือกหลักประกัน<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.collateral_type} hasFeedback>
                                        {
                                            getFieldDecorator('collateral_type', { initialValue: null })
                                            (
                                                <RadioGroup>
                                                    {
                                                        _.map(master_collateral, (v,i) => {
                                                            return (<Radio className={`${cls['f0_9']}`} key={`bU-${i}`} value={v.collateral_code}>{v.collateral_name}</Radio>)
                                                        })
                                                    }
                                                </RadioGroup>
                                            )
                                        }
                                    </FormItem> 
                                </div>
                            </Card>

                            <Card className={`${cls['mt10a0']} ${cls['p0']}`}>
                                <div className="pt0 pl3 pr3">
                                    <div className={`ttu ${cls['pclr2']}`}>Time Convenient</div>
                                    <Row gutter={5}>
                                        <Col span={12}>
                                            <span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>เวลาที่ลูกค้าสะดวกให้ติดต่อ<span className="red">*</span></span>   
                                            <FormItem className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_time_convenient} hasFeedback>                                                 
                                                {
                                                    getFieldDecorator('customer_convenient_from', {})
                                                    (
                                                        <TimePicker                                                            
                                                            className={`${cls['f0_9']}`}
                                                            format={`${timeFormat}`}
                                                            size="small" 
                                                            inputReadOnly={true} 
                                                            style={{ width: '45%' }} 
                                                            placeholder="ตั้งแต่เวลา" 
                                                            defaultOpenValue={moment('08:00', timeFormat)}
                                                            onChange={this.handleCustTimeConvenientStart} 
                                                        />
                                                    )
                                                }   
                                                <span style={{ padding: '0 2px' }}>ถึง</span>
                                                {
                                                    getFieldDecorator('customer_convenient_end', {})
                                                    (
                                                        <TimePicker 
                                                            className={`${cls['f0_9']}`} 
                                                            format={`${timeFormat}`}
                                                            size="small" 
                                                            inputReadOnly={true} 
                                                            style={{ width: '45%' }} 
                                                            placeholder="สิ้นสุดเวลา" 
                                                            defaultOpenValue={moment('17:00', timeFormat)}
                                                            onChange={this.handleCustTimeConvenientEnd} 
                                                            disabled={customer_convenient_begin}
                                                            disabledHours={this.handleCustTimeConvenientEndCtrl}
                                                        />
                                                    )
                                                }  
                                   
                                            </FormItem>                                 
                                        </Col>
                                        <Col span={12}>
                                            <span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>ต้องการสร้างวันนัดหมาย</span>
                                            <FormItem className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} stye={{ width: '50px' }}>
                                                {
                                                    getFieldDecorator('appointment_date', {})
                                                    (
                                                        <DatePicker 
                                                            className={`${cls['f0_9']} ${cls['wfscreen']}`} 
                                                            showTime={{ format: 'HH:mm', defaultValue: moment('10:00', timeFormat) }} 
                                                            format="DD/MM/YYYY HH:mm" 
                                                            size="small" 
                                                            placeholder="เลือกวันที่นัดหมาย" 
                                                        />)
                                                }                                                
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className={`${cls['m0']} ${cls['p0']}`}>                               
                                <div className="pt0 pl3 pr3">
                                    <div className={`ttu ${cls['pclr2']}`}>Personal Profile</div>
                                    <FormItem className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_ordinarytype} hasFeedback>
                                        <span className={`${cls['f0_9']} ttu fw5`} style={{ marginRight: '10px', color: 'rgba(0,0,0,.85)' }}>ต้องการสินเชื่อในนาม:<span className="red">*</span></span>
                                        {
                                            getFieldDecorator('customer_ordinarytype', {})
                                            (
                                                <RadioGroup onChange={this.handleSelectCriteriaPass.bind(this, 'customer_ordinarytype')} style={{ width: '240px' }}>
                                                    <Radio value="1" className={`${cls['f0_9']}`}>บุคคลธรรมดา</Radio>
                                                    <Radio value="2" className={`${cls['f0_9']}`}>นิติบุคคล</Radio>
                                                </RadioGroup>
                                            )
                                        }
                                    </FormItem>

                                    <Row gutter={5}>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>กลุ่มลูกค้า<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_group} hasFeedback>
                                                {
                                                    getFieldDecorator('customer_group', {})
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
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>ประเภทลูกค้า<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_type} hasFeedback>
                                                {
                                                    getFieldDecorator('customer_type', {})
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
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>ชื่อ<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_name} hasFeedback>
                                                <InputGroup impact>
                                                    {
                                                        getFieldDecorator('customer_prefix', { initialValue: 'คุณ' })
                                                        (<Input size="small" className={`${cls['lh0']}`} disabled={true} style={{ width: '30%'}} />)
                                                    }
                                                    {
                                                        getFieldDecorator('customer_name', {})
                                                        (<Input  size="small" className={`${cls['lh0']}`} onChange={this.handleFieldChange.bind(this, 'customer_name')} style={{ width: '70%'}}  />)
                                                    }
                                                </InputGroup>
                                            </FormItem> 
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>นามสกุล<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}  validateStatus={form_validate.customer_surname} hasFeedback>
                                                {
                                                    getFieldDecorator('customer_surname', {})
                                                    (<Input size="small" className={`${cls['lh0']}`} onChange={this.handleFieldChange.bind(this, 'customer_surname')} />)
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>ชื่อเล่น</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('customer_nickname', {})
                                                    (<Input size="small" className={`${cls['lh0']}`} />)
                                                }
                                            </FormItem> 
                                        </Col>
                                   </Row>
          
                                   <Row gutter={5}>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>เพศ<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_gender} hasFeedback>
                                                {
                                                    getFieldDecorator('customer_gender', {})
                                                    (
                                                        <RadioGroup size="small" onChange={this.handleSelectCriteriaPass.bind(this, 'customer_gender')} >
                                                            <Radio className={`${cls['f0_9']}`} value="ชาย">ชาย</Radio>
                                                            <Radio className={`${cls['f0_9']}`} value="หญิง">หญิง</Radio>
                                                        </RadioGroup>
                                                    )
                                                }
                                            </FormItem>    
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>อายุ<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} style={{ marginTop: '5px' }} validateStatus={form_validate.customer_age} hasFeedback>
                                                {
                                                    getFieldDecorator('customer_age', {})
                                                    (<InputNumber min={0} max={150} maxLength={3} size="small" className={`${cls['lh0']} ${cls['wfscreen']}`} onChange={this.handleNumberCriteriaPass.bind(this, 'customer_age')} />)
                                                }
                                            </FormItem> 
                                        </Col>                                       
                                    </Row>  
                                   
                                   <Row gutter={5}>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>เลขบัตรประชาชน</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('customer_idcard', {})
                                                    (<Input size="small" className={`${cls['lh0']}`} />)
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>อาชีพ<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_occupation} hasFeedback>
                                                {
                                                    getFieldDecorator('customer_occupation', {})
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
                                   </Row>

                                   <Row gutter={5}>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>เงินเดือน<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_revenue} hasFeedback>
                                                {
                                                    getFieldDecorator('customer_revenue', {})
                                                    (<InputNumber min={0} max={9999999999} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} size="small" className={`${cls['lh0']} ${cls['wfscreen']}`} onKeyUp={this.handleInputCriteriaPass.bind(this, 'customer_revenue')} />)
                                                }
                                            </FormItem> 
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>รายได้อื่นๆ (ต่อปี)</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('customer_otherincome', {})
                                                    (<InputNumber min={0} max={9999999999} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} size="small" className={`${cls['lh0']} ${cls['wfscreen']}`} />)
                                                }
                                            </FormItem> 
                                        </Col>
                                   </Row>

                                   <Row gutter={5}>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>เบอร์มือถือ<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('customer_mobile', {})
                                                    (<Input id="customer_mobile" size="small" className={`${cls['lh0']}`} />)
                                                } 
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>เบอร์ติดต่ออื่นๆ (ที่ทำงาน/บ้าน)</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('customer_hometel', {})
                                                    (<Input id="customer_hometel" size="small" className={`${cls['lh0']}`}  />)
                                                }
                                            </FormItem>
                                        </Col>                                       
                                    </Row>   
                       
                                    <Row gutter={5}>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>Email</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('customer_email', {})
                                                    (<Input size="small" className={`${cls['lh0']}`} />)
                                                }
                                            </FormItem> 
                                        </Col>   
                                        <Col span={12}>   
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>Line ID</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('customer_lineid', {})
                                                    (<Input size="small" className={`${cls['lh0']}`} />)
                                                }
                                            </FormItem> 
                                        </Col>                                 
                                    </Row>  

                                    <FormItem label={(<span className={`${cls['f0_9']}`}>ที่อยู่ปัจจุบัน<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_address} hasFeedback>
                                        {
                                            getFieldDecorator('customer_address', {})
                                            (<TextArea rows={1} onKeyUp={this.handleInputCriteriaPass.bind(this, 'customer_address')} />)
                                        }
                                    </FormItem> 

                                    <Row gutter={0} style={{ marginTop: '12px' }}>
                                        <Col span={6}></Col>
                                        <Col span={10}>
                                            {
                                                getFieldDecorator('search_criteria', { initialValue: 'ZIPCODE' })
                                                (
                                                    <RadioGroup className="fr" size="small">
                                                        <Radio className={`${cls['f0_9']}`} value="DISTRICT" disabled={true}>ตำบล</Radio>
                                                        <Radio className={`${cls['f0_9']}`} value="ZIPCODE">ไปรษณีย์</Radio>
                                                    </RadioGroup>
                                                )
                                            }
                                        </Col>
                                        <Col span={8}>
                                            <AutoComplete
                                                size="small"
                                                dataSource={this.state.dataLocation}
                                                onSelect={this.handleSearchSelect}
                                                onSearch={this.handleSearchByCriteria}
                                            />
                                        </Col>
                                    </Row>


                                    <Row gutter={5}>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>จังหวัด<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} style={{ marginTop: '5px' }} validateStatus={form_validate.customer_province} hasFeedback>
                                                {
                                                    getFieldDecorator('customer_province', {})
                                                    (
                                                        <Select 
                                                            showSearch
                                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                            size="small" 
                                                            onChange={this.handleSelectCriteriaPass.bind(this, 'customer_province')}
                                                        >
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
                                        </Col>
                                        <Col span={8}>                                                
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>อำเภอ/เขต<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_amphoe} hasFeedback>
                                                {
                                                    getFieldDecorator('customer_amphoe', {})
                                                    (
                                                        <Select 
                                                            showSearch
                                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                            size="small" 
                                                            onChange={this.handleSelectCriteriaPass.bind(this, 'customer_amphoe')}
                                                            disabled={province_has_sel}
                                                        >
                                                            { 
                                                                _.map(master_amphoe, (v, i) => {
                                                                    return (<Option key={`AMPH-${i}`} value={v.AmphoeID}>{v.AmphoeNameTh}</Option>)
                                                                }) 
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>ตำบล/แขวง<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.customer_tumbon} hasFeedback>
                                                {
                                                    getFieldDecorator('customer_tumbon', {})
                                                    (
                                                        <Select 
                                                            showSearch
                                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                            size="small" 
                                                            onChange={this.handleDistrict.bind(this, 'customer_tumbon')} 
                                                            disabled={amphoe_has_sel}
                                                        >
                                                            { 
                                                                _.map(master_tumbon, (v, i) => {
                                                                    return (<Option key={`TUMBON-${i}`} value={v.TumbonID}>{`${v.TumbonNameTh} (${v.ZipCode})`}</Option>)
                                                                }) 
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>
                                            {
                                                getFieldDecorator('customer_zipcode', {})
                                                (<Input type="hidden" size="small" className={`${cls['lh0']}`} disabled={true} />)
                                            }
                                        </Col>
                                    </Row>

                                </div>                       
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className={`${cls['m0']} ${cls['p0']}`}>
                                <div className="pt0 pl3 pr3">
                                <div className={`ttu ${cls['pclr2']}`}>General Information</div>    
                                <Row gutter={5}>
                                        <Col span={10}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>ชื่อสถานที่ทำงาน/บริษัท</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('company_name', {})
                                                    (<Input size="small" className={`${cls['lh0']}`} />)
                                                }                                   
                                            </FormItem> 
                                        </Col>
                                        <Col span={5}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>อายุงาน/กิจการ<span className="red">*</span></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} validateStatus={form_validate.yib} hasFeedback>
                                                {
                                                    getFieldDecorator('yib', {})
                                                    (<InputNumber min={0} max={999} size="small" className={`${cls['lh0']} ${cls['wfscreen']}`} onChange={this.handleNumberCriteriaPass.bind(this, 'yib')} style={{ minWidth: '87px', maxWidth: '87px' }} />)
                                                }
                                            </FormItem> 
                                        </Col>
                                        <Col span={9}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>หมายเลขจดทะเบียนการค้า</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('business_registration', {})
                                                    (<Input size="small" className={`${cls['lh0']}`} />)
                                                }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    
                                    <Row gutter={5}>
                                        <Col span={18}>
                                            <FormItem label={(<span className={`${cls['f0_9']}`}>ประเภทธุรกิจ</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('business_type', {})
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
                                                getFieldDecorator('is_Owner', {})
                                                (
                                                    <Checkbox size="small">
                                                        <span style={{ fontSize: '0.85em', color: 'gray' }}>เจ้าของกิจการ</span>
                                                    </Checkbox>                                
                                                )
                                            }
                                        </FormItem> 
                                        </Col>
                                    </Row>
                                
                                    <FormItem label={(<span className={`${cls['f0_9']}`}>รายละเอียดธุรกิจ</span>)}  className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('business_description', {})
                                            (<TextArea rows={3}></TextArea>)
                                        }
                                    </FormItem> 

                                    <Row gutter={5}>
                                        <Col span={24}>
                                            <FormItem className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('business_locationstate', {})
                                                    (
                                                        <RadioGroup onChange={this.handleAddressClone} size="small">
                                                            <Radio value="1" className={`${cls['f0_9']}`}>ที่ตั้งบริษัทแตกต่างจากที่อยู่ปัจจุบัน</Radio>
                                                            <Radio value="2" className={`${cls['f0_9']}`} disabled={customer_zipcode_isnull}>ที่ตั้งบริษัทตรงกับที่อยู่ปัจจุบัน</Radio>
                                                        </RadioGroup>
                                                    )
                                                }
                                            </FormItem> 
                                        </Col>
                                        <Col span={24}>
                                            <FormItem className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('business_address', {})
                                                    (<TextArea rows={1} />)
                                                }
                                            </FormItem>                                     
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>จังหวัด</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`} style={{ marginTop: '5px' }}>
                                                {
                                                    getFieldDecorator('business_province', {})
                                                    (
                                                        <Select 
                                                            showSearch
                                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                            size="small"
                                                        >
                                                            <Option value="">โปรดเลือกข้อมูลจังหวัด</Option>
                                                            { 
                                                                _.map(masters.province, (v, i) => {
                                                                    return (<Option key={`BPROV-${i}`} value={v.ProvinceID}>{v.ProvinceNameTh}</Option>)
                                                                }) 
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem> 
                                        </Col>
                                        <Col span={8}>                                                
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>อำเภอ/เขต</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('business_amphoe', {})
                                                    (
                                                        <Select 
                                                            showSearch
                                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                            size="small"
                                                            disabled={province_business_has_sel}
                                                        >
                                                            { 
                                                                _.map(master_amphoe_business, (v, i) => {
                                                                    return (<Option key={`BUAMPH-${i}`} value={v.AmphoeID}>{v.AmphoeNameTh}</Option>)
                                                                }) 
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f0_9']} ${cls['lead_field_important']}`}>ตำบล/แขวง</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('business_tumbon', {})
                                                    (
                                                        <Select 
                                                            showSearch
                                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                            size="small"
                                                            onChange={this.handleBusinessDistrict.bind(this, 'business_tumbon')} 
                                                            disabled={amphoe_business_has_sel}
                                                        >
                                                            { 
                                                                _.map(master_tumbon_business, (v, i) => {
                                                                    return (<Option key={`BUTUMBON-${i}`} value={v.TumbonID}>{`${v.TumbonNameTh} (${v.ZipCode})`}</Option>)
                                                                }) 
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>
                                            {
                                                getFieldDecorator('business_zipcode', {})
                                                (<Input type="hidden" size="small" className={`${cls['lh0']}`} disabled={true} />)
                                            }
                                        </Col>
                                    </Row>

                                </div>                                    
                            </Card>

                        </Col>
                    </Row>           
                    <div style={{ position: 'absolute', bottom: '0px', right: '10px' }}>
                        <ButtonGroup size="large" className="fr">
                            <Button type="dash" onClick={this.handleCancel}>
                                <Icon type="poweroff" /> CLOSE
                            </Button>
                            <Button type="primary" htmlType="submit">
                                <Icon type="save" /> SUBMIT
                            </Button>
                        </ButtonGroup>
                    </div>
                </Form>                
            </Modal>
        )
    }

    handleSearchSelect = (tumbon_id) => {
        const { masters } = this.props
        const { setFieldsValue } = this.props.form
        let tumbon_item = _.filter(masters.district, { TumbonID: parseInt(tumbon_id) })[0]
        if(tumbon_item) {
            let amphoe_item = _.filter(masters.amphoe, { AmphoeID: parseInt(tumbon_item.AmphoeID) })[0]
            setFieldsValue({ 
                customer_zipcode: tumbon_item.TumbonID,
                customer_tumbon: tumbon_item.TumbonID,
                customer_amphoe: amphoe_item.AmphoeID,
                customer_province: amphoe_item.ProvinceID
            })
        }       
    }

    handleSearchByCriteria = (data) => {
        const { masters } = this.props
        const { getFieldValue } = this.props.form
        let search_criteria = getFieldValue('search_criteria')

        if(data && !_.isEmpty(data)) {
            let data_collection = []
            switch(search_criteria) {
                case 'DISTRICT':
                    console.log(data)
                break;
                case 'ZIPCODE':
                    let str_number =  data.replace(/[^0-9.]/g, '')
                    if(str_number && !_.isEmpty(str_number)) {
                        data_collection = this.searchByText(masters.district, data)
                    } 
                break
            }  
            this.setState({ dataLocation: data_collection }) 
        } else {
            this.setState({ dataLocation: [] }) 
        }
       
    }

    searchByText = (collection, tex) => {
        let search_data = _.filter(collection, 
            _.flow(
                _.identity,
                _.values,
                _.join,
                _.toLower,
                _.partialRight(_.includes, tex)
            )
        )

        if(search_data && search_data.length > 0) {
            return _.map(search_data, (v, i) => {
                return (<AutoCompleteOption key={`${v.TumbonID}${v.TumbonID}${i}${v.AmphoeID}`} value={`${v.TumbonID}`}>{`${v.TumbonNameTh} (${v.ZipCode})`}</AutoCompleteOption>)
            })
        } else {
            return []
        }
    }

    handleFieldChange = (key, element_field) => {        
         if(element_field.target && !_.isEmpty(element_field.target.value)) {
            this.handleInputValid(key, element_field.target.value)
        }
    }
    
    handleCustTimeConvenientStart = (momentDate, strVal) => {
        const { getFieldValue } = this.props.form
        let customer_convenient = getFieldValue('customer_convenient_end')
        if(momentDate && strVal !== '' && moment(customer_convenient, timeFormat).format(timeFormat) !== 'Invalid date') {
            this.handleNotEmptyCriteriaPass('customer_time_convenient', strVal)
        } else {
            this.handleNotEmptyCriteriaPass('customer_time_convenient', null)
        }     
    }
    
    handleCustTimeConvenientEnd = (momentDate, strVal) => {
        const { getFieldValue } = this.props.form
        let customer_convenient = getFieldValue('customer_convenient_from')
        if(momentDate && strVal !== ''  && moment(customer_convenient, timeFormat).format(timeFormat) !== 'Invalid date') {
            this.handleNotEmptyCriteriaPass('customer_time_convenient', strVal)
        } else {
            this.handleNotEmptyCriteriaPass('customer_time_convenient', null)
        }     
    }

    handleCustTimeConvenientEndCtrl = (momentDate, strVal) => {
        const { getFieldValue } = this.props.form
        let customer_convenient = getFieldValue('customer_convenient_from')
        if(moment(customer_convenient, timeFormat).format(timeFormat) !== 'Invalid date') {
            let collect_hour = []
            let max_select = moment(customer_convenient, 'HH').format('HH')
            for(let i=0; i <= max_select; i++) {
                collect_hour.push(i)
            }
            return collect_hour.join()
        }

    }

    handleAddressClone = (e) => {
        const { setFieldsValue, getFieldValue } = this.props.form

        if(e.target) {
            if(e.target.value == '2') {  
                let customer_adress = getFieldValue('customer_adress')
                let customer_province = getFieldValue('customer_province')
                let customer_amphoe = getFieldValue('customer_amphoe')
                let customer_tumbon = getFieldValue('customer_tumbon')
                let customer_zipcode = getFieldValue('customer_zipcode')

                setFieldsValue({
                    business_adress: customer_adress,
                    business_province: customer_province,
                    business_amphoe: customer_amphoe,
                    business_tumbon: customer_tumbon,
                    business_zipcode: customer_zipcode
                })

            } else {
                setFieldsValue({
                    business_adress: null,
                    business_province: null,
                    business_amphoe: null,
                    business_tumbon: null,
                    business_zipcode: null
                })
            }
        }
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

    handleBusinessDistrict = (attrName, dataVal) => {
        const { setFieldsValue } = this.props.form
        const { masters: { district } } = this.props

        this.handleSelectCriteriaPass(attrName, dataVal)

        let filter_district = _.filter(district, { TumbonID: dataVal })[0]
        if(filter_district && filter_district.ZipCode) {
            setFieldsValue({ business_zipcode: filter_district.ZipCode })
        }
    }

    handleInputValid = (attrName, dataVal) => {   
        if(!_.isEmpty(dataVal) && dataVal.length > 4) {
            this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { [attrName]: 'success' })  })
        } else {
            this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { [attrName]: 'error' })  })
        }
    }

    handleNumberCriteriaPass = (attrName, dataVal) => {       
        if(dataVal && dataVal > 0) {
            this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { [attrName]: 'success' })  })
        } else {
            this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { [attrName]: 'error' })  })
        }
    }

    handleInputCriteriaPass = (attrName, dataVal) => {    
        if(dataVal.target && !_.isEmpty(dataVal.target.value) && dataVal.target.value.length > 4) {
            this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { [attrName]: 'success' })  })
        } else {
            this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { [attrName]: 'error' })  })
        }
    }

    handleNotEmptyCriteriaPass = (attrName, dataVal) => {       
        if(dataVal && !_.isEmpty(dataVal)) {
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
                /*
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
                if(!fieldData.request_prduct) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { request_prduct: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดเลือกกลุ่มโปรดักซ์')
                    return false
                }
                
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

                // CHANNEL VALIDATION
                if(!fieldData.media_channel) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { media_channel: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดเลือกประเภทของสือที่ทำให้ลูกค้ารู้จักเรา')
                    return false
                } 
               
                // COLLATERAL VALIDATION
                if(!fieldData.collateral_type) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { collateral_type: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดเลือกประเภทของหลักประกัน')
                    return false
                } 
               
                // TIME CONVENIENT OF CUSTOMER
                if(moment(fieldData.customer_convenient_from, timeFormat).format(timeFormat) == 'Invalid date') {
                    this.setState({ form_validate: _.assignIn({}, this.state.customer_time_convenient, { customer_time_convenient: 'error' })  })
                    this.handleNotify('error', title_notify, 'กรุณาระบุเวลาที่ลูกค้าสะดวกให้ติดต่อ')
                    return false
                } 

                if(moment(fieldData.customer_convenient_end, timeFormat).format(timeFormat) == 'Invalid date') {
                    this.setState({ form_validate: _.assignIn({}, this.state.customer_time_convenient, { customer_time_convenient: 'error' })  })
                    this.handleNotify('error', title_notify, 'กรุณาระบุเวลาที่ลูกค้าสะดวกให้ติดต่อ')
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
                
                if(!fieldData.customer_gender) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_gender: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดเลือกเพศของลูกค้า')
                    return false
                } 

                if(!fieldData.customer_age) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_age: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดระบุอายุของลูกค้า')
                    return false
                }

                if(!fieldData.customer_occupation) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_occupation: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดเลือกอาชีพของลูกค้า')
                    return false
                } 

                if(!fieldData.customer_revenue) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_revenue: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดระบุเงินเดือนของลูกค้า')
                    return false
                } 

                if(fieldData.customer_revenue < 10000) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_revenue: 'error' })  })
                    this.handleNotify('error', title_notify, 'กรุณาระบุเงินเดือนให้ถูกต้อง')
                    return false
                } 

                if(!fieldData.customer_mobile) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_mobile: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดกรอกเบอร์ติดต่อของลูกค้า (เบอร์มือถือ)')
                    return false
                } 

                if(!fieldData.customer_address) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { customer_address: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดระบุรายละเอียดที่อยู่ปัจจุบันของลูกค้า')
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

                if(!fieldData.yib) {
                    this.setState({ form_validate: _.assignIn({}, this.state.form_validate, { yib: 'error' })  })
                    this.handleNotify('error', title_notify, 'โปรดระบุอายุกิจการของลูกค้า')
                    return false
                } 
                */
                // FIELD ALL PASS VALIDATION
                /*
                let handleAddCustomer = this.handleCreateDataSubmit
                confirm({
                    title: 'กรุณายืนยันการบันทึกข้อมูล',
                    content: 'โปรดตรวจสอบข้อมูลให้ถูกก่อนยืนยันการบันทึกข้อมูล กรุณาข้อมูลถูกต้อง คลิก OK หรือ Cancel เพื่อยกเลิก',
                    onOk() {
                        handleAddCustomer(fieldData)
                        
                    },
                    onCancel() {},
                })
                */
               this.handleCreateDataSubmit(fieldData)
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

        let province_business = _.filter(masters.province, { ProvinceID: resp.business_province })[0]
        let amphoe_business = _.filter(masters.amphoe, { AmphoeID: resp.business_amphoe })[0]
        let tumbon_business = _.filter(masters.district, { TumbonID: resp.business_tumbon })[0]

        let data_convenient_from = moment(resp.customer_convenient_from, timeFormat).format(timeFormat)
        let data_convenient_end = moment(resp.customer_convenient_end, timeFormat).format(timeFormat)

        let data_convenient_time = null
        if(data_convenient_from !== 'Invalid date' && data_convenient_end !== 'Invalid date') {
            data_convenient_time = `${data_convenient_from}-${data_convenient_end}`
        } else {
            if(data_convenient_from !== 'Invalid date' && data_convenient_end == 'Invalid date') data_convenient_time = data_convenient_from
            if(data_convenient_end !== 'Invalid date' && data_convenient_from == 'Invalid date') data_convenient_time = data_convenient_end
        }
        console.log(data_convenient_time)
         // moment(fieldData.customer_convenient_from, timeFormat).format(timeFormat) == 'Invalid date'
       
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

                IsCollateral: (resp && resp.collateral_type !== 'ไม่มีหลักประกัน') ? 'Y' : 'N',
                CollateralType: (resp && resp.collateral_type !== 'ไม่มีหลักประกัน') ? resp.collateral_type : null,

                AppointmentConvenient: data_convenient_time,
	            AppointmentDate: (resp && resp.appointment_date) ? resp.appointment_date : null,
                
                OrdinaryType: (resp && resp.customer_ordinarytype) ? resp.customer_ordinarytype : null,
                PotentialCode: null,
                Nationality: 'ไทย',
              
                CustomerGroup: (resp && resp.customer_group) ? `${resp.customer_group}` : null,
                CustomerType: (resp && resp.customer_type) ? resp.customer_type : null,
                CustomerPrefix: (resp && resp.customer_prefix) ? resp.customer_prefix : null,                   
                CustomerName: (resp && resp.customer_name) ? resp.customer_name : null,
                CustomerSurname: (resp && resp.customer_surname) ? resp.customer_surname : null,
                CustomerSex: (resp && resp.customer_gender) ? resp.customer_gender : null,
                CustomerAge: (resp && resp.customer_age) ? resp.customer_age : null,
                CitizenID: (resp && resp.customer_idcard) ? resp.customer_idcard : null,
                Occupation: (resp && resp.customer_occupation) ? resp.customer_occupation : null,
                Revenue: (resp && resp.customer_revenue) ? resp.customer_revenue : null,
                OtherIncome: (resp && resp.customer_otherincome) ? resp.customer_otherincome : null,
                Mobile: (resp && resp.customer_mobile) ? resp.customer_mobile : null,
                HomeTel: (resp && resp.customer_hometel) ? resp.customer_hometel : null,
                Email: (resp && resp. customer_email) ? resp. customer_email : null,
                LineID: (resp && resp. customer_lineid) ? resp. customer_lineid : null,
                Address: (resp && resp.customer_address) ? resp.customer_address: null,
                Province: (province) ? province.ProvinceNameTh : null,
                Amphoe: (amphoe) ? amphoe.AmphoeNameTh : null,
                Tumbon: (tumbon) ? tumbon.TumbonNameTh : null,
                Postcode: (resp && resp.customer_zipcode) ? `${resp.customer_zipcode}` : null,
    
                CompanyName: (resp && resp.company_name) ? resp.company_name : null,
                YIB: (resp && resp.yib) ? resp.yib : null,
                BusinessRegistration: (resp && resp.business_registration) ? resp.business_registration : null,               
                IsOwner: (resp && resp.is_Owner) ? 'Y' : 'N',
                BusinessType: (resp && resp.business_type) ? resp.business_type : null,   
                BusinessDescription: (resp && resp.business_description) ? resp.business_description : null,

                BusinessLocationState: (resp && resp.business_locationstate) ? resp.business_locationstate : null,
                BusinessAddress: (resp && resp.customer_address) ? resp.business_address: null,
                BusinessProvince: (province_business) ? province.ProvinceNameTh : null,
                BusinessAmphoe: (amphoe_business) ? amphoe.AmphoeNameTh : null,
                BusinessTumbon: (tumbon_business) ? tumbon.TumbonNameTh : null,
                BusinessPostcode: (resp && resp.business_zipcode) ? `${resp.business_zipcode}` : null,
               
                Guarantor: (resp && resp. have_guarantor) ? 'Y' : 'N',

                CreateEventType: 'KeyIn',
                CreateID: create_id,
                CreateName: create_name
            }

            console.log(requestData)

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

const GridChannelCreateProfileForm = Form.create()(GridChannelCreateProfile)
export default connect(
    (state) => ({        
        masters: {
            /*customer_prefix: state.LEAD_MASTER_CUSTOMER_PREFIX,*/
            customer_groups: state.LEAD_MASTER_CUSTOMER_GROUP,
            customer_types: state.LEAD_MASTER_CUSTOMER_TYPE,
            province: state.LEAD_MASTER_PROVINCE,
            amphoe: state.LEAD_MASTER_AMPHOE,
            district: state.LEAD_MASTER_DISTRICT
        }
    }),
    {
        /*LOAD_MASTERCUST_PREFIX: getLeadMasterCustomerPrefix,*/
        LOAD_MASTERCUST_GROUP: getLeadMasterCustomerGroup,
        LOAD_MASTERCUST_TYPES: getLeadMasterCustomerType,
        LOAD_MASTER_PROVINCE: getLeadMasterProvince,
        LOAD_MASTER_AMPHOE: getLeadMasterAmphoe,
        LOAD_MASTER_DISTRICT: getLeadMasterDistrict,

        CREATE_CUSTOMER: LeadChannelAddCustomer
        
    }
)(GridChannelCreateProfileForm)
