import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Drawer, Modal, Form, Select, Input, AutoComplete, Radio, Checkbox, Button, Row, Col, Icon } from 'antd'
import Scrollbar from 'react-smooth-scrollbar'
import moment from 'moment'
import _ from 'lodash'

import { in_array } from '../../../containers/PCIS/config/funcitonal'
import {} from '../../../actions/pcis'

import cls from '../styles/pcis_style.scss'

const FormItem = Form.Item
const InputGroup = Input.Group
const Option = Select.Option
const RadioGroup = Radio.Group
const ButtonGroup = Button.Group
const confirm = Modal.confirm
const AutoCompleteOption = AutoComplete.Option

class FilterOptional extends Component {

    state = {
        drawer: false
    }

    shouldComponentUpdate(nextProps) {
        return this.props.isOpen !== nextProps.isOpen
    }

    render() {
        const { isOpen, masterPlugin, handleClose, form } = this.props
        const { getFieldDecorator } = form

        return (
            <div>
                <Drawer
                    title={(<div><span>FILTER OPTIONAL</span></div>)}
                    className={`${cls['filter_optional_container']}`}
                    placement={'bottom'}
                    closable={true}
                    onClose={handleClose}
                    visible={isOpen}
                    mask={false}
                    maskClosable={false}
                >
                    <Form onSubmit={this.handleForm} className={`${cls['form_container']}`}>
                        <Row gutter={5}>
                            <Col span={3}>
                               <Row>
                                   <Col span={24}>
                                        <FormItem label={(<span className={`${cls['f0_9']}`}>Campaign</span>)} className={`${cls['form_item']} ${cls['fix_height']} ${cls['label_lh0']} ${cls['m0']} ttu fw5`}>
                                            {
                                                getFieldDecorator('filter_campaign', {})
                                                (
                                                    <Select size="small">
                                                        <Option key={`PP-0`} value="">โปรดเลือกแคมเปญ</Option>
                                                        {                                                                
                                                            _.map(masterPlugin.campaign, (v,i) => {
                                                                return (<Option key={`CAMP-${i}`} value={v.CampaignID}>{`${v.CampaignCode} - ${v.CampaignName} ${(v.CampaignShortName) ? `(${v.CampaignShortName})` : ''}`}</Option>) 
                                                            })
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                        
                                   </Col>
                               </Row>

                            </Col>
                            <Col span={8}></Col>
                            <Col span={8}></Col>
                        </Row>
                    </Form>
                </Drawer>
            </div>
            
        )
    }

    handleForm = (e) => {
        e.preventDefault()


    }

}

const FilterOptionalForm = Form.create()(FilterOptional)
export default connect(
    (state) => ({}),
    {}
)(FilterOptionalForm)