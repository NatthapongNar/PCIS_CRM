import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Modal, Card, Input, Select, Checkbox, Button, Icon, Row, Col } from 'antd'
import _ from 'lodash'

import cls from '../styles/pcis_style.scss'

const FormItem = Form.Item
const { TextArea } = Input
const InputGroup = Input.Group
const Option = Select.Option
const ButtonGroup = Button.Group
const confirm = Modal.confirm

class GridChannelCreateProfile extends Component {

    render() {
        const { isOpen, handleClose } = this.props
        const { getFieldDecorator, getFieldValue } = this.props.form

        const prefixCustomer = getFieldDecorator('prefix_customer', {})
        (<Select style={{ width: 100 }} size="small"></Select>)

        const prefixCompany = getFieldDecorator('prefix_company', {})
        (<Select style={{ width: 100 }} size="small"></Select>)

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
                    <Row gutter={10}>
                        <Col span={8}>
                            <Card className={`${cls['m0']}`}>
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
                                                    (<Select size="small" className={`${cls['lh0']}`}></Select>)
                                                }
                                            </FormItem>   
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Team</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('branch', {})
                                                    (<Select size="small" className={`${cls['lh0']}`} ></Select>)
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={8}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Employee</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('employee', {})
                                                    (<Select size="small" className={`${cls['lh0']}`}></Select>)
                                                }
                                            </FormItem>   
                                        </Col>
                                    </Row>
                                </div>
                            </Card>

                            <Card className={`${cls['mt10a0']}`}>
                                <div className={`ttu pl3 ${cls['pclr2']}`}>Purspose Information</div>
                                <div className="pt2 pl3 pr3">
                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Purspose Reason</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('purspose_reason', {})
                                            (<Select size="small"></Select>)
                                        }
                                    </FormItem> 
                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Request Loan</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('request_loan', {})
                                            (<Input size="small" className={`${cls['lh0']}`} />)
                                        }
                                    </FormItem> 
                                </div>
                            </Card>

                            <Card className={`${cls['mt10a0']}`}>
                                <div className={`ttu pl3 ${cls['pclr5']}`}>Media Channel Information</div>
                                <div className="pt2 pl3 pr3">
                                    <Row gutter={10}>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Media Channel</span>)} lassName={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('media_channel', {})
                                                    (<Select size="small"></Select>)
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={12}>
                                            <FormItem label={(<span className={`${cls['f1_0']}`}>Sub Media Channel</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                                {
                                                    getFieldDecorator('sub_media_channel', {})
                                                    (<Select size="small"></Select>)
                                                }
                                            </FormItem> 
                                        </Col>
                                    </Row>
                                    
                                    
                                </div>
                            </Card>

                        </Col>
                        <Col span={8}>
                            <Card className={`${cls['m0']}`}>
                                <div className={`ttu pl3 ${cls['pclr3']}`}>Personal Information</div>
                                <div className="pt2 pl3 pr3">
                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Prefix / Name Surname</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('customer_name', {})
                                            (<Input addonBefore={prefixCustomer} size="small" className={`${cls['lh0']}`} />)
                                        }
                                    </FormItem> 
                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Occupation</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('occupation', {})
                                            (<Input addonBefore={<Icon type="idcard" />} size="small" className={`${cls['lh0']}`} />)
                                        }
                                    </FormItem>
                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Revenue</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('revenue', {})
                                            (<Input addonBefore={<Icon type="dollar" />} size="small" className={`${cls['lh0']}`} />)
                                        }
                                    </FormItem> 
                                    <InputGroup size="small" compact>
                                        <div className={`${cls['f1_0']} ttu`} style={{ width: '100%', color: 'rgba(0, 0, 0, .85)', lineHeight: 2 }}>Contact Number</div>
                                        {
                                            getFieldDecorator('hometel', {})
                                            (<Input addonBefore={<Icon type="phone" style={{ transform: 'rotate(105deg)' }} />} size="small" className={`${cls['lh0']}`} style={{ width: '50%' }} />)
                                        }
                                        {
                                            getFieldDecorator('mobile', {})
                                            (<Input addonBefore={<Icon type="phone" style={{ transform: 'rotate(105deg)' }} />} size="small" className={`${cls['lh0']}`} style={{ width: '50%' }} />)
                                        } 
                                    </InputGroup>   
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
                            <Card className={`${cls['m0']}`}>
                                <div className={`ttu pl3 ${cls['pclr4']}`}>Company Information</div>
                                <div className="pt2 pl3 pr3">
                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Prefix / Company Name</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('company_name', {})
                                            (<Input addonBefore={prefixCompany} size="small" className={`${cls['lh0']}`} />)
                                        }                                   
                                    </FormItem> 
                                
                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Business Type</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('business_type', {})
                                            (<Select size="small"></Select>)
                                        }
                                    </FormItem> 
                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Business Description</span>)}  className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('business_description', {})
                                            (<TextArea rows={5}></TextArea>)
                                        }
                                    </FormItem> 
                                    <FormItem label={(<span className={`${cls['f1_0']}`}>Year In Business</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('yib', {})
                                            (<Input size="small" className={`${cls['lh0']}`} />)
                                        }
                                    </FormItem> 
                                    <FormItem className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                        {
                                            getFieldDecorator('is_Owner', {})
                                            (
                                                <Checkbox size="small">
                                                    <span style={{ fontSize: '0.85em', color: 'gray' }}>Is Owner</span>
                                                </Checkbox>                                
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

    // This is funtion handle form mangement for sent data to referral system
    handleSubmit = (e) => {
        e.preventDefault();


    }

}

const GridChannelCreateProfileForm = Form.create()(GridChannelCreateProfile)
export default connect(
    (state) => ({

    }),
    {

    }
)(GridChannelCreateProfileForm)