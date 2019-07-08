import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Row, Col, Form, Input, Select, Radio, Button, Icon, Card, Skeleton   } from 'antd'
import Scrollbar from 'react-smooth-scrollbar'
import bluebird from 'bluebird'
import moment from 'moment'
import _ from 'lodash'

import {} from '../../../actions/pcis'
import cls from './style/cust_portolio.scss'

const FormItem = Form.Item
const InputGroup  = Input.Group
const { TextArea } = Input
const Option = Select.Option
const RadioGroup  = Radio.Group

const field_size = 'default'

class CustPortfolio extends Component {

    state = {
        appForm: {
            confirmOwner: false
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form     
        
        const prefixCustomer = getFieldDecorator('prefix_cust', {})
        (
            <Select size={field_size} style={{ width: '100px' }}>
                <Option value="">-- โปรดเลือก ---</Option>
            </Select>
        )   

        const prefixCorperate = getFieldDecorator('prefix_corp', {})
        (
            <Select size={field_size} style={{ width: '100px' }}>
                <Option value="">-- โปรดเลือก ---</Option>
            </Select>
        )  

        const addOnBranchCode = getFieldDecorator('branch_code', {})
        (
            <Select size={field_size} placeholder="Branch" style={{ width: '100px' }}>
                <Option value="">โปรดเลือก</Option>
            </Select>
        )

        return (
            <div className={cls['profile_container']}>
                <Form onSubmit={() => {}}>
                    <div className={`${cls['profile_content']}`}>                    
                        <div className={cls['profile_grid']}>                   
                            <Card 
                                className={`${cls['grid_items_left']} ${cls['set_h1']}`}
                                type="inner"
                                title={<span className="ttu">Branch Information</span>}
                            >
                                    <FormItem label={(<span className="ttu">Branch</span>)}>
                                        <Row gutter={5}>
                                            <Col span={8}>
                                                {
                                                    getFieldDecorator('region_code', {})
                                                    (<Input size={field_size} disabled={true} placeholder="Region" />)                                
                                                }
                                            </Col>
                                            <Col span={16} className={cls['field_branchcode']}>
                                                {
                                                    getFieldDecorator('branch_name', {})
                                                    (<Input addonBefore={addOnBranchCode} size={field_size} placeholder="Branch Manager" disabled={true}  />)                                         
                                                }
                                            </Col>
                                        </Row>
                                    </FormItem> 
                                    <FormItem label={(<span className="ttu">Application Owner</span>)}>
                                        <Row gutter={5}>
                                            <Col span={8} className={cls['field_empcode']}>
                                                {
                                                    getFieldDecorator('emp_code', {})
                                                    (
                                                        <Input 
                                                            addonAfter={<Icon type="search" />} 
                                                            placeholder="EMP CODE"                                                            
                                                            size={field_size}
                                                        />
                                                    )
                                                }
                                            </Col>
                                            <Col span={16}>
                                                {
                                                    getFieldDecorator('emp_name', {})
                                                    (<Input size={field_size}   placeholder="EMPLOYEE NAME" disabled={true} />)
                                                }
                                            </Col>
                                        </Row>
                                    </FormItem>                             
                            </Card>
                            <Card 
                                className={`${cls['grid_items_left']} ${cls['set_h2']}`}
                                type="inner"
                                title={<span className="ttu">{`Source & Potential`}</span>}
                            >
                                <FormItem label={(<span className="ttu">Source Of Customer</span>)}>
                                    {
                                        getFieldDecorator('source_customer', {})
                                        (
                                            <Select size={field_size}>
                                                <Option value="">-- โปรดเลือก ---</Option>
                                            </Select>
                                        )
                                    }
                                </FormItem>  
                                <Row gutter={5}>
                                    <Col span={12}>
                                        <Card>
                                            <FormItem label={(<span className="ttu">Loan Interested?</span>)}>
                                                {
                                                    getFieldDecorator('loan_interest', {})
                                                    (
                                                        <RadioGroup onChange={() => {}} size="small">
                                                            <Radio value={1}>สนใจ</Radio>
                                                            <Radio value={2}>ไม่สนใจ</Radio>
                                                        </RadioGroup>
                                                    )
                                                }
                                            </FormItem>  
                                        </Card>                                         
                                    </Col>
                                    <Col span={12}>
                                        <Card>
                                            <FormItem label={(<span className="ttu">Opportunity</span>)}>
                                                {
                                                    getFieldDecorator('opportunity', {})
                                                    (
                                                        <RadioGroup onChange={() => {}} size="small">
                                                            <Radio value={1}>H</Radio>
                                                            <Radio value={2}>M</Radio>
                                                            <Radio value={3}>L</Radio>
                                                        </RadioGroup>
                                                    )
                                                }
                                            </FormItem> 
                                        </Card>
                                    </Col>
                                </Row>  
                                <FormItem label={(<span className="ttu">Loan Offer</span>)}>
                                    {
                                        getFieldDecorator('loan_offer', {})
                                        (
                                            <RadioGroup onChange={() => {}} size="small" className="ttu">
                                                <Radio value={1}>Nano</Radio>
                                                <Radio value={2}>Micro</Radio>
                                                <Radio value={3}>SB</Radio>
                                                <Radio value={4}>Micro SME</Radio>
                                            </RadioGroup>
                                        )
                                    }
                                </FormItem> 
                            </Card>
                            <Card 
                                className={`${cls['grid_items_left']} ${cls['set_h3']}`}
                                type="inner"
                                title={<span className="ttu">Appointment</span>}
                            >
                                <Skeleton  size={field_size} />
                            </Card>
                        </div>
                        <div className={cls['profile_grid']}>
                            <Card 
                                className={cls['grid_items_center']}
                                type="inner"
                                title={<span className="ttu">Customer Information</span>}
                            >                                
                                <Row gutter={5}>
                                    <Col span={12}>
                                        <Card style={{ backgroundColor: '#fffcf8' }}>
                                            <FormItem label={(<span className="ttu">Customer Type</span>)}>
                                                {
                                                    getFieldDecorator('customer_type', {})
                                                    (
                                                        <RadioGroup onChange={() => {}} size="small">
                                                            <Radio value={1}>New</Radio>
                                                            <Radio value={2}>Existing</Radio>
                                                        </RadioGroup>
                                                    )
                                            }
                                            </FormItem>   
                                        </Card>
                                    </Col>
                                    <Col span={12}>
                                        <Card style={{ backgroundColor: '#fffcf8' }}>
                                            <FormItem label={(<span className="ttu">Customer Owner</span>)}>
                                                {
                                                    getFieldDecorator('customer_owner', {})
                                                    (
                                                        <RadioGroup onChange={() => {}} size="small">
                                                            <Radio value={1}>Owner</Radio>
                                                            <Radio value={2}>Contact / Other</Radio>
                                                        </RadioGroup>
                                                    )
                                                }
                                            </FormItem>   
                                        </Card>
                                    </Col>
                                </Row>                                
                                <Row>
                                    <Col span={24}>
                                        <Row gutter={5}>
                                            <Col span={12}>
                                                <FormItem label={(<span className="ttu">Customer Name</span>)}>
                                                    {
                                                        getFieldDecorator('customer_name', {})
                                                        (<Input addonBefore={prefixCustomer} size={field_size} />)
                                                    }
                                                </FormItem> 
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label={(<span className="ttu">Company Name</span>)}>
                                                    {
                                                        getFieldDecorator('company_name', {})
                                                        (<Input addonBefore={prefixCorperate} size={field_size} />)
                                                    }
                                                </FormItem> 
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={24}>
                                        <Row gutter={5}>
                                            <Col span={12}>
                                                <FormItem label={(<span className="ttu">Telephone Number</span>)}>
                                                    <InputGroup compact>
                                                        {
                                                            getFieldDecorator('customer_tel2', {})
                                                            (<Input size={field_size} style={{ width: '50%' }} placeholder="Office Number" />) 
                                                        }
                                                        {
                                                            getFieldDecorator('customer_tel1', {})
                                                            (<Input size={field_size} style={{ width: '50%' }} placeholder="Mobile Number" />)
                                                        }                                                        
                                                    </InputGroup>                                                   
                                                </FormItem> 
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label={(<span className="ttu">Business Type</span>)}>
                                                    {
                                                        getFieldDecorator('business_type', {})
                                                        (<Select size={field_size}></Select>)
                                                    }
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Col>


                                    <Col span={24}>
                                        <Row gutter={5}>
                                            <Col span={12}>
                                                <FormItem label={(<span className="ttu">Address</span>)}>
                                                    {
                                                        getFieldDecorator('cust_address', {})
                                                        (<TextArea autosize={{ minRows: 2, maxRows: 2 }} />)
                                                    }
                                                </FormItem> 
                                            </Col>
                                            <Col span={12}>                                            
                                                <FormItem label={(<span className="ttu">Business Type</span>)}>
                                                    {
                                                        getFieldDecorator('business_type', {})
                                                        (<TextArea autosize={{ minRows: 2, maxRows: 2 }} />)
                                                    }
                                                </FormItem>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col span={24}>
                                        <Row gutter={5}>
                                            <Col span={12}>
                                                <FormItem label={(<span className="ttu">Request Loan</span>)}>
                                                    {
                                                        getFieldDecorator('company_name', {})
                                                        (<Input size={field_size} />)
                                                    }
                                                </FormItem> 
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label={(<span className="ttu">Business Location</span>)}>
                                                    {
                                                        getFieldDecorator('business_location', {})
                                                        (<Input size={field_size} />)
                                                    }
                                                </FormItem> 
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col span={24}>
                                        <FormItem label={(<span className="ttu">Location</span>)}>
                                            <Row gutter={5}>
                                                <Col span={8}>
                                                    {
                                                        getFieldDecorator('province', {})
                                                        (
                                                            <Select size={field_size} placeholder="PROVINCE" disabled={true}>
                                                                <Option value="">-- โปรดเลือก ---</Option>
                                                            </Select>
                                                        )                                
                                                    }
                                                </Col>
                                                <Col span={8}>
                                                    {
                                                        getFieldDecorator('district', {})
                                                        (
                                                            <Select size={field_size} placeholder="DISTRICT" disabled={true}>
                                                                <Option value="">-- โปรดเลือก ---</Option>
                                                            </Select>
                                                        )                            
                                                    }
                                                </Col>
                                                <Col span={8}>
                                                    {
                                                        getFieldDecorator('district', {})
                                                        (
                                                            <Select size={field_size} placeholder="SUBDISTRICT">
                                                                <Option value="">-- โปรดเลือก ---</Option>
                                                            </Select>
                                                        )
                                                    }
                                                </Col>
                                            </Row>
                                        </FormItem> 
                                    </Col>

                                    <Col span={24}>
                                        <FormItem label={(<span className="ttu">Media Channel</span>)}>
                                            <Row gutter={5}>
                                                <Col span={8}>
                                                    {
                                                        getFieldDecorator('mediachannel', {})
                                                        (
                                                            <Select size={field_size} placeholder="CHANNEL" disabled={true}>
                                                                <Option value="">-- โปรดเลือก ---</Option>
                                                            </Select>
                                                        )                                
                                                    }
                                                </Col>
                                                <Col span={8}>
                                                    {
                                                        getFieldDecorator('submediachannel', {})
                                                        (
                                                            <Select size={field_size} placeholder="SUBCHANNEL" disabled={true}>
                                                                <Option value="">-- โปรดเลือก ---</Option>
                                                            </Select>
                                                        )                            
                                                    }
                                                </Col>
                                            </Row>
                                        </FormItem> 
                                    </Col>
                                    <Col span={24}>
                                        <Row gutter={5}>
                                            <Col span={12}>
                                                <FormItem label={(<span className="ttu">Remark</span>)}>
                                                    {
                                                        getFieldDecorator('remark', {})
                                                        (<TextArea autosize={{ minRows: 2, maxRows: 2 }} />)
                                                    }
                                                </FormItem>
                                            </Col>
                                            <Col span={12}>
                                                
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                  
                                

                            </Card>
                        </div>
                        <div className={cls['profile_grid']}>
                            <Card className={cls['grid_items_right']} style={{ height: '25%' }}>
                                <h3 className="ttu">Referral</h3>

                            </Card>
                            <Card className={cls['grid_items_right']} style={{ height: '75%', marginTop: '5px' }}>
                                <h3 className="ttu">Relation Information</h3>
                                <Skeleton  size={field_size} />
                            </Card>
                        </div>
                    </div>
                </Form>
            </div>
        )
    }

}

export default Form.create()(CustPortfolio)