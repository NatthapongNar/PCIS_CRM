import React, { Component } from 'react'
import { connect } from 'react-redux'
import bluebird from 'bluebird'
import { Form, Modal, Card, Input, InputNumber, Select, Checkbox, Radio, Button, Icon, Row, Col, Tooltip } from 'antd'
import _ from 'lodash'

import {
    getLeadMasterCustomerGroup,
    getLeadMasterCustomerType

} from '../../../actions/pcis_lead'

import {
    master_prefix_customer,
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

class GridChannelCreateProfile extends Component {

    state = {

    }

    componentWillMount() {
        const { LOAD_MASTERCUST_GROUP, LOAD_MASTERCUST_TYPES  } = this.props

        const API_DEFAULT_CALL = [
            LOAD_MASTERCUST_GROUP,
            LOAD_MASTERCUST_TYPES
        ]

        bluebird.all(API_DEFAULT_CALL).each((f) => f())
    }
 
    render() {
        const { isOpen, masters, masterPlugin, handleClose } = this.props
        const { getFieldDecorator, getFieldValue } = this.props.form

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
        
        let iscollater_disable = true
        let sel_iscollateral = getFieldValue('is_collateral')
        if(sel_iscollateral && sel_iscollateral == 'Y') {
            iscollater_disable = false
        } else {
            iscollater_disable = true
        }

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
                <Form className={`${cls['form_container']}`} onSubmit={this.handleSubmit}>  
                    <h1 className="ttu">
                        <span className={`${cls['lead_title']}`}> Profile Information</span>
                    </h1>
                    <Row gutter={10}>
                        <Col span={8}>
                            <Card className={`${cls['m0']} ${cls['p0']}`}>
                                <div className={`ttu pl3 ${cls['pclr1']}`}>Application Owner Information</div>
                                <div className="pt2 pl3 pr3">
                                    <Row gutter={5}>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Region</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('region', {})
                                                    (<Select size="small" className={`${cls['lh0']}`} disabled={true}></Select>)
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Area</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('area', {})
                                                    (<Select size="small" className={`${cls['lh0']}`} disabled={true}></Select>)
                                                }
                                            </FormItem> 
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Zone</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('zone', {})
                                                    (<Select size="small" className={`${cls['lh0']}`} disabled={true}></Select>)
                                                }
                                            </FormItem> 
                                        </Col>
                                    </Row>                                                                            
                                    <Row gutter={5}> 
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Sales Channel</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('sale_channel', {})
                                                    (<Select size="small" className={`${cls['lh0']}`} disabled={true}></Select>)
                                                }
                                            </FormItem>   
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Team</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('branch', {})
                                                    (<Select size="small" className={`${cls['lh0']}`} disabled={true}></Select>)
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Employee</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('employee', {})
                                                    (<Select size="small" className={`${cls['lh0']}`} disabled={true}></Select>)
                                                }
                                            </FormItem>   
                                        </Col>
                                    </Row>
                                </div>
                            </Card>

                            <Card className={`${cls['mt10a0']} ${cls['p0']}`}>
                                <div className={`ttu pl3 ${cls['pclr6']}`}>{`Channel Information`}</div>
                                <div className="pt2 pl3 pr3">
                                    <Row gutter={5}>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Channel Group</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('channel_data', {})
                                                    (
                                                        <Select size="small">
                                                            {/* {
                                                                _.map(master_purpose, (v,i) => {
                                                                    return (<Option key={`PP-${i}`} value={v.purpose_code}>{v.purpose_reason}</Option>) 
                                                                })
                                                            } */}
                                                        </Select>
                                                    )
                                                }
                                            </FormItem> 
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Channel Source</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('source_data', {})
                                                    (
                                                        <Select size="small">
                                                            {/* {
                                                                _.map(masterPlugin.product_transfer, (v,i) => {
                                                                    return (<Option key={`RQP-${i}`} value={v.PGCode} disabled={(v.DropdownEnable == 'Y') ? false : true}>{v.PGLabel}</Option>) 
                                                                })
                                                            } */}
                                                        </Select>
                                                    )
                                                }
                                            </FormItem> 
                                        </Col>
                                    </Row>
                                </div>
                            </Card>

                            <Card className={`${cls['mt10a0']} ${cls['p0']}`}>
                                <div className={`ttu pl3 ${cls['pclr2']}`}>Purpose  Information</div>
                                <div className="pt2 pl3 pr3">
                                    <Row gutter={5}>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Purpose Reason</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('purspose_reason', {})
                                                    (
                                                        <Select size="small">
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
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Request Product</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('request_prduct', {})
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
                                        <Col span={24}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Request Loan</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('request_loan', {})
                                                    (<InputNumber min={0} max={9999999999} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} size="small" className={`${cls['lh0']} ${cls['wfscreen']}`} />)
                                                }
                                            </FormItem> 
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                            
                            <Card className={`${cls['mt10a0']} ${cls['p0']}`}>
                                <div className={`ttu pl3 ${cls['pclr5']}`}>Media Channel Information</div>
                                <div className="pt2 pl3 pr3">
                                
                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Media Channel</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('media_channel', {})
                                            (   <Select size="small">
                                                    {
                                                          _.map(master_mediachannel, (v,i) => {
                                                            return (<Option key={`MCH-${i}`} value={v.media_ch_code}>{v.media_ch_name}</Option>) 
                                                        })
                                                    }
                                                </Select>
                                            )
                                        }
                                    </FormItem>
                                    <span className={`${cls['text_notice']}`}>(ลูกค้ารับรู้สื่อของธนาคารผ่านช่องทางใด)</span>
                                </div>
                            </Card>

                        </Col>
                        <Col span={8}>
                            <Card className={`${cls['m0']} ${cls['p0']}`}>
                                <div className={`ttu pl3 ${cls['pclr3']}`}>Personal Information</div>
                                <div className="pt2 pl3 pr3">

                                    <FormItem label={(<span className={`${cls['f1_0']}`}>ID Card</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('customer_idcard', {})
                                            (<Input size="small" className={`${cls['lh0']}`} />)
                                        }
                                    </FormItem> 

                                    <Row gutter={5}>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Customer Group</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('customer_group', {})
                                                    (
                                                        <Select onChange={this.handleCustGroup}>
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
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Customer Type</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('customer_type', {})
                                                    (
                                                        <Select disabled={custgroup_hasSel}>
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
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Prefix</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('prefix_customer', {})
                                                    (
                                                        <Select size="small">
                                                            { 
                                                                _.map(master_prefix_customer, (v, i) => { 
                                                                    return (<Option key={`PF-${i}`} value={v.prefix_code}>{v.prefix_code}</Option>) 
                                                                }) 
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={9}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Name</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('customer_name', {})
                                                    (<Input size="small" className={`${cls['lh0']}`} />)
                                                }
                                            </FormItem> 
                                        </Col>
                                        <Col span={9}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Surname</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('customer_surname', {})
                                                    (<Input size="small" className={`${cls['lh0']}`} />)
                                                }
                                            </FormItem>
                                        </Col>
                                   </Row>
                                   
                                   <Row gutter={5}>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Occupation</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('occupation', {})
                                                    (
                                                        <Select size="small" className={`${cls['lh0']}`}>
                                                            { 
                                                                _.map(master_occupation, (v, i) => {
                                                                    return (<Option key={`OC-${i}`} value={v.occupation_code}>{v.occupation_code}</Option>)
                                                                }) 
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Revenue</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('customer_revenue', {})
                                                    (<InputNumber min={0} max={9999999999} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} size="small" className={`${cls['lh0']} ${cls['wfscreen']}`} />)
                                                }
                                            </FormItem> 
                                        </Col>
                                   </Row>

                                   <Row gutter={5}>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Home Number</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('customer_hometel', {})
                                                    (<Input size="small" className={`${cls['lh0']}`} />)
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Mobile Number</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('customer_mobile', {})
                                                    (<Input size="small" className={`${cls['lh0']}`} />)
                                                } 
                                            </FormItem>
                                        </Col>
                                    </Row>   
                       
                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Email</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('customer_email', {})
                                            (<Input size="small" className={`${cls['lh0']}`} />)
                                        }
                                    </FormItem> 

                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Address</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('address', {})
                                            (<TextArea size="small" />)
                                        }
                                    </FormItem> 

                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Province</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('province', {})
                                            (<Select size="small"></Select>)
                                        }
                                    </FormItem> 
                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Amphoe</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('amphoe', {})
                                            (<Select size="small"></Select>)
                                        }
                                    </FormItem>
                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Tumbon</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('tumbon', {})
                                            (<Select size="small"></Select>)
                                        }
                                    </FormItem>
                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Poscode</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('Postcode', {})
                                            (<Input size="small" className={`${cls['lh0']}`} />)
                                        }
                                    </FormItem> 
                                   
                                </div>                       
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className={`${cls['m0']} ${cls['p0']}`}>
                                <div className={`ttu pl3 ${cls['pclr4']}`}>Company Information</div>
                                <div className="pt2 pl3 pr3">
                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Company Name</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('company_name', {})
                                            (<Input size="small" className={`${cls['lh0']}`} />)
                                        }                                   
                                    </FormItem> 

                                    <Row gutter={5}>
                                        <Col span={18}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Business Type</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
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
                                                    <Checkbox value="Y" size="small">
                                                        <span style={{ fontSize: '0.85em', color: 'gray' }}>Is Owner</span>
                                                    </Checkbox>                                
                                                )
                                            }
                                        </FormItem> 
                                        </Col>
                                    </Row>
                                
                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Business Description</span>)}  className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('business_description', {})
                                            (<TextArea rows={5}></TextArea>)
                                        }
                                    </FormItem> 

                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Year In Business</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['mb0']} ttu fw5`} style={{ marginTop: '5px' }}>
                                        {
                                            getFieldDecorator('yib', {})
                                            (<InputNumber min={0} max={999} size="small" className={`${cls['lh0']}`} />)
                                        }
                                    </FormItem> 
                                        
                                    <FormItem label={(<span className={`${cls['f1_0']}`}><Tooltip placement="right" title="Year In Business">Guarantor</Tooltip></span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['mb0']} ttu fw5`} style={{ marginTop: '5px' }}>
                                        {
                                            getFieldDecorator('have_guarantor', {})
                                            (
                                                <Checkbox value="Y" size="small">
                                                    <span style={{ fontSize: '0.8em' }}>มีผู้ค้ำประกันหรือไม่</span>
                                                </Checkbox>                                
                                            )
                                        }
                                    </FormItem> 


                                </div>                                    
                            </Card>

                            <Card className={`${cls['mt10a0']} ${cls['p0']}`}>
                                <div className={`ttu pl3 ${cls['pclr4']}`}>Collateral Information</div>
                                <div className="pt2 pl3 pr3">
                                    <FormItem>
                                    {
                                        getFieldDecorator('is_collateral', { initialValue: 'N' })
                                        (
                                            <RadioGroup onChange={this.handleIsCollateral}>
                                                <Radio value="N">ไม่มีหลักประกัน</Radio>
                                                <Radio value="Y">มีหลักประกัน</Radio>
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Business Type</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('collateral_type', {})
                                            (
                                                <Select size="small" disabled={iscollater_disable}>
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
                    <Row>
                        <Col span={16}>

                        </Col>
                    </Row>
                </Form>                
            </Modal>
        )
    }

    handleCustGroup = (val) => {
        const { setFieldsValue } = this.props.form
        if(!val || val == '') {
            setFieldsValue({ customer_type: null })
        }
    }

    handleIsCollateral = (val) => {
        const { setFieldsValue } = this.props.form
        if(!val || val.target.value == 'N') {
            setFieldsValue({ collateral_type: null })
        }
    }

    // This is funtion handle form mangement for sent data to referral system
    handleSubmit = (e) => {
        e.preventDefault();

        const { authen: { Session }, form: { validateFields } } = this.props

        validateFields((err, fieldData) => {
            if(!err) {
                console.log(fieldData)
            }

        })

    }
    

}

const GridChannelCreateProfileForm = Form.create()(GridChannelCreateProfile)
export default connect(
    (state) => ({
        masters: {
            customer_groups: state.LEAD_MASTER_CUSTOMER_GROUP,
            customer_types:  state.LEAD_MASTER_CUSTOMER_TYPE
        }
    }),
    {
        LOAD_MASTERCUST_GROUP: getLeadMasterCustomerGroup,
        LOAD_MASTERCUST_TYPES: getLeadMasterCustomerType
    }
)(GridChannelCreateProfileForm)