import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Modal, Collapse, Form, Select, Button, TreeSelect, Card, Rate, Timeline, notification, Input, Icon, Avatar, Tooltip, Popover } from 'antd'
import Scrollbar from 'react-smooth-scrollbar'
import moment from 'moment'
import _ from 'lodash'

import { in_array, numberWithCommas } from '../../../containers/PCIS/config/funcitonal'
import { 
    loadLeadChannelActionNote, 
    createLeadChannelActionNote,
    updateLeadChannelCustProfile,
    getLeadChannelCustProfileHistory,
    productTransfer,
    getFindBranchInArea

} from '../../../actions/pcis'

import GridChannelCustProfile from './GridChannelCustProfile'
import GridChannelUpdateProfile from './GridChannelUpdateProfile'

import cls from '../styles/pcis_style.scss'
import styles from '../styles/timeline.scss'

const Panel = Collapse.Panel
const FormItem  = Form.Item
const TextArea = Input.TextArea
const ButtonGroup = Button.Group
const Option = Select.Option
const confirm = Modal.confirm
const TimelineItem = Timeline.Item

const field_colon_label = false

class GridChannelModal extends Component {
    
    state = {
        handleForm: {
            edit: false
        },
        createProfile: {
            isOpen: false
        },
        editProfile: {
            isOpen: false
        },
        handleZone: {
            ZoneTracking: true,
            ZoneTransfer: false
        },
        ctrlTransfer: {
            field_reason: false,
            field_team: false
        },
        loadTimeline: false,
        createTimeline: false,
        updateProfile: false
    }

    componentWillReceiveProps(props) {
        if(props) {
            const { LOAD_ACTIONNOTE, LOAD_CUSTPROFILE_HIST, handleLoadTrigger } = props
      
            let dataSource = (!_.isEmpty(props.dataSource)) ? props.dataSource.data : null 
            if(dataSource && !_.isEmpty(dataSource)) {
                if(!this.state.loadTimeline) {                   
                    if(dataSource.RabbitFinanceID) {
                        LOAD_ACTIONNOTE({ ReferCode: dataSource.RabbitFinanceID })
                        LOAD_CUSTPROFILE_HIST({ ReferCode: dataSource.RabbitFinanceID, ReferSource: dataSource.SourceChannel })
                        this.setState({ loadTimeline: true })
                    }      
                }               
            }  
            
            if(this.state.createTimeline) {
                if(!_.isEmpty(props.activity_create)) {
                    let RABBIT_CODE = (props.activity_create && !_.isEmpty(props.activity_create[0])) ? props.activity_create[0].ReferChannelCode : null
                    LOAD_ACTIONNOTE({ ReferCode: RABBIT_CODE })            
                    this.setState({ createTimeline: false })
                }
            }

            if(this.state.updateProfile) {
                handleLoadTrigger()
                this.handleModalClose()
                this.setState({ updateProfile: false })
            }

        }
    }

    componentDidMount() {
        this.componentDidUpdate()
    }

    componentDidUpdate() {
        const { isOpen, dataSource: { data } } = this.props
      
        if(isOpen) {        
            let revenue = (data && data.MinimumRevenue > 0) ? data.MinimumRevenue : 0         
            _.delay(() => {
                let el_target = $('#revenue_portfolio')
                if(el_target && el_target.children().length == 0) {
                    new JustGage({
                        id: 'revenue_portfolio',
                        value: revenue,
                        min: 0,
                        max: 1000000,	    
                        label: 'MTH',
                        titleFontColor: '#FFF',
                        labelFontColor: '#FFF',
                        valueFontColor: '#FFF', 
                        humanFriendly: true,
                        startAnimationTime: 1500,
                        refreshAnimationTime: 1500,
                        gaugeWidthScale: 0.5,
                        gaugeColor: 'rgba(0, 0, 0, 0.1)',
                        levelColors: ["ff0000", "#faff00", "#A4C400" ],
                        counter: false
                    });	

                }
                    
            }, 200)
        }        
    }

    handleActionNoteEnable = () => {
        this.setState({ createTimeline: true })
    }

    handleReset = () => {
        this.props.form.resetFields()
    }

    // MODAL CUST PROFILE HANDLE
    handleCustProfileOpen = () => {
        this.setState({ createProfile: _.assign({}, this.state.createProfile, { isOpen: true }) })
    }

    handleCustProfileClose = () => {
        this.setState({ 
            createProfile: _.assign({}, this.state.createProfile, { isOpen: false }), 
            updateProfile: true
        })
    }

    handleEditProfileOpen = () => {
        this.setState({ 
            editProfile: _.assignIn({}, this.state.editProfile, { isOpen: true }) 
        })
    }

    handleEditProfileClose = () => {
        this.setState({ 
            editProfile: _.assignIn({}, this.state.editProfile, { isOpen: false }) 
        })
    }
    /*
    handleEditFormOpen = () => {
        this.setState({ handleForm: _.assign({}, this.state.handleForm, { edit: true }) })
    }

    handleEditFormClose = () => {
        this.setState({ handleForm: _.assign({}, this.state.handleForm, { edit: false }) })
    }
    */
    handleModalClose = () => {
        $('#revenue_portfolio').empty()

        this.setState({
            handleForm: {
                edit: false
            },
            handleZone: {
                ZoneTracking: true,
                ZoneTransfer: false
            },
            createProfile: {
                isOpen: false
            },
            loadTimeline: false,
            createTimeline: false
        })

        this.handleReset()
        this.props.handleClose()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.isOpen !== nextProps.isOpen ||
               this.props.dataSource !== nextProps.dataSource ||
               this.props.activity_timeline == nextProps.activity_timeline ||
               this.props.activity_profile_hist !== nextProps.activity_profile_hist ||
               this.props.branch_around_custarea !== nextProps.branch_around_custarea ||
               this.props.form !== nextProps.form ||
               this.state.createProfile !== nextState.createProfile ||
               this.state.editProfile !== nextState.editProfile ||
               this.state.handleForm !== nextState.handleForm ||
               this.state.handleZone !== nextState.handleZone ||
               this.state.ctrlTransfer !== nextState.ctrlTransfer ||
               this.state.loadTimeline !== nextState.loadTimeline ||
               this.state.createTimeline !== nextState.createTimeline ||
               this.state.updateProfile !== nextState.updateProfile
    }

    render() {
        const { createProfile, editProfile, handleZone } = this.state
        const { authen, isOpen, master, dataSource: { data }, form, activity_timeline, activity_profile_hist, branch_around_custarea } = this.props
        const { getFieldDecorator, getFieldValue  } = form

        const gridline_division = cls['division_part2']
        const fieldMaxHeight = { minHeight: `${(this.state.handleForm.edit) ? '21.82px' : '16.36px' }`, lineHeight: `${(this.state.handleForm.edit) ? '21.82px' : '16.36px' }` }

        // CHARACTER INFO
        let custname  = (data && !_.isEmpty(data.CustomerName)) ? data.CustomerName : ''
        let corperation = (data && !_.isEmpty(data.CompanyName)) ? handleTelephone(data.CompanyName) : '-'
        let is_owner = (data && !_.isEmpty(data.IsOwner)) ? handleTelephone(data.IsOwner) : ''
        let yib = (data && data.YIB > 0) ? data.YIB : 0
        let district =  (data && !_.isEmpty(data.District)) ? data.District : ''
        let address = (data && !_.isEmpty(data.Province)) ? data.Province : ''
        let custmobile = (data && !_.isEmpty(String(data.MobileNo))) ? handleTelephone(_.padStart(String(data.MobileNo), 10, '0')) : ''
        let rawmobile = (data && !_.isEmpty(String(data.MobileNo))) ? _.padStart(String(data.MobileNo), 10, '0') : ''
        let business  = (data && !_.isEmpty(data.BusinessType)) ? data.BusinessType : ''
        let cust_ranking = (data && !_.isEmpty(data.Ranking)) ? data.Ranking : '?'
        let email  = (data && !_.isEmpty(data.Email)) ? data.Email : '-'

        let group_team = (data && !_.isEmpty(data.SaleChannelID)) ? data.SaleChannelID : ''
        let group_dep  = (data && !_.isEmpty(data.RegionNameEng)) ? data.RegionNameEng : ''
        let team_name  = (data && !_.isEmpty(data.TeamName)) ? data.TeamName : ''
        let emp_name   = (data && !_.isEmpty(data.EmployeeName)) ? data.EmployeeName : <span className="red">ไม่พบข้อมูลผู้ดูแล</span>
        let emp_mobile = (data && !_.isEmpty(data.EmpMobile)) ? handleTelephone(_.padStart(String(data.EmpMobile), 10, '0')) : ''

        // PROFILE INFORMATION 
        let refer_source     = (data && !_.isEmpty(data.ChannelName)) ? data.ChannelName : ''
        let refer_channel    = (data && !_.isEmpty(data.SourceName)) ? data.SourceName : ''
        let loan_purpose     = (data && !_.isEmpty(data.PurposeReason)) ? data.PurposeReason : ''
        let loan_request     = (data && data.RequestLoan > 0) ? numberWithCommas(data.RequestLoan) : ''

        let create_profile   = (data && !_.isEmpty(data.CreateDate)) ? moment(data.CreateDate).format('DD/MM/YYYY') : ''
        let application_no   = (data && !_.isEmpty(data.ApplicationNo)) ? data.ApplicationNo : ''
        let id_card          = (data && data.ID_Card) ? data.ID_Card : ''
        let ncb_consent      = (data && !_.isEmpty(data.NCBCheckDate)) ? moment(data.NCBCheckDate).format('DD/MM/YYYY') : ''
        let product_program  = (data && !_.isEmpty(data.ProductName)) ? data.ProductName : ''
        let rm_onhand        = (data && !_.isEmpty(data.RMProcess)) ? data.RMProcess : ''
        let rm_onhand_date   = (data && !_.isEmpty(data.RMProcessDate)) ? moment(data.RMProcessDate).format('DD/MM/YYYY') : null
        let plan_a2ca        = (data && !_.isEmpty(data.AppToCAPlanDate)) ? moment(data.AppToCAPlanDate).format('DD/MM/YYYY') : null

        let reconcile_status = (data && !_.isEmpty(data.LatestReconcile)) ? data.LatestReconcile : ''
        let reconcile_date   = (data && !_.isEmpty(data.LatestReconcileDate)) ? moment(data.LatestReconcileDate).format('DD/MM/YYYY') : null

        let ca_returndate    = (data && !_.isEmpty(data.CAReturnDateLog)) ? moment(data.CAReturnDateLog).format('DD/MM/YYYY') : null

        let app_to_cadate    = (data && !_.isEmpty(data.AppToCA)) ? moment(data.AppToCA).format('DD/MM/YYYY') : null
        let ca_name          = (data && !_.isEmpty(data.CAName)) ? data.CAName : ''
        let decision_status  = (data && !_.isEmpty(data.StatusDigit)) ? data.StatusDigit : ''
        let status_date      = (data && !_.isEmpty(data.StatusDate)) ? moment(data.StatusDate).format('DD/MM/YYYY') : null
        let status_reson     = (data && !_.isEmpty(data.StatusReason)) ? data.StatusReason : null
        let preloan_amt      = (data && data.PreLoan > 0) ? data.PreLoan : ''
        let approved_amt     = (data && data.ApprovedLoan > 0) ? data.ApprovedLoan : ''

        let plan_drawdown    = (data && !_.isEmpty(data.PlanDrawdownDate)) ? moment(data.PlanDrawdownDate).format('DD/MM/YYYY') : null
        let drawdown_date    = (data && !_.isEmpty(data.DrawdownDate)) ? moment(data.DrawdownDate).format('DD/MM/YYYY') : null
        let drawdown_amt     = (data && data.DrawdownBaht > 0) ? data.DrawdownBaht : ''

        let is_existapp   = (create_profile && !_.isEmpty(create_profile)) ? true : false

        let master_action = null
        let response_code = getFieldValue('ResponseCode')
        if(!_.isEmpty(response_code)) {
            master_action = _.filter(master.action_list, { ResponseCode: response_code })
        } else {
            master_action = master.action_list
        }

        let master_reponse = _.reject(master.response_list, (v) => { return v.ResponseCode == 'NA' })
        let master_product =  _.reject(master.product_transfer, (v) => { return v.PGCode == data.ProductGroup })

        let timeline_history = (
            <div style={{ width: '450px' }}>
                <Timeline>
                    {
                        (activity_profile_hist && activity_profile_hist.length > 0) ? 
                        (
                            _.map(activity_profile_hist, (v) => {
                                let create_log = (v && v.CreateByDate) ? moment(v.CreateByDate).format('DD/MM/YYYY HH:mm') : null
                                let change_custname = (v && v.ChangeCustomerName) ? v.ChangeCustomerName : null
                                let change_corpname = (v && v.ChangeCompanyName) ? v.ChangeCompanyName : null
                                let change_business = (v && v.ChangeBusinessType) ? v.ChangeBusinessType : null
                                let change_is_owner = (v && v.ChangeIsOwner) ? v.ChangeIsOwner : null
                                let change_mobile = (v && v.ChangeMobile) ? v.ChangeMobile : null
                                return (
                                    <TimelineItem>
                                        {create_log} 
                                        {(change_custname) ? ` มีการแก้ไขชื่อ ${change_custname}`:''} 
                                        {(change_corpname) ? ` มีการแก้ไขชื่อ ${change_corpname}`:''} 
                                        {(change_business) ? ` มีการแก้ไขประเภท ${change_business}`:''} 
                                        {(change_is_owner) ? ` มีการแก้ไขความเป็นเจ้าของกิจ ${change_is_owner}`:''} 
                                        {(change_mobile) ? ` มีการแก้ไขหมายเลข ${change_mobile}`:''} 
                                    </TimelineItem>
                                )
                            })
                        ) : 
                        (<TimelineItem>ไม่พบข้อมูลประวัติการแก้ไข</TimelineItem>)
                    }
                    
                </Timeline>
            </div>
        )

        return (
            <div>
                <GridChannelCustProfile 
                    isOpen={createProfile.isOpen}           
                    data={data} 
                    handleClose={this.handleCustProfileClose}    
                />

                {
                    (editProfile.isOpen) && 
                    (
                        <GridChannelUpdateProfile                     
                            isOpen={editProfile.isOpen}
                            authen={authen}
                            masterPlugin={master}
                            data={data}
                            handleClose={this.handleEditProfileClose}
                        />
                    )
                }
                
                <Modal
                    wrapClassName={`${cls['modal_wrapper']} ${cls['modal_profile']} animated flipInX`}
                    visible={isOpen}
                    title={this.handleTitleHeader()}
                    maskClosable={false}
                    onOk={null}
                    onCancel={this.handleModalClose}
                    footer={null}
                    width="55%"
                >
                    <div className={cls['profile_container']}>
                        
                        <div className={`${cls['profile_partition']} ${styles['timelime_wrapper']}`} style={{ height: '220px'}}>
                    
                            <div key={1} className={cls['profile_div']}>
                                <div className={cls['division_container']}>
                                    <div className={`${cls['division_part1']}`}>
                                        <div className={`${cls['division_item']} ${cls['division_gap5']} animated bounceIn`} style={{ height: '130px' }}>
                                            <Card className={`${cls['division_container']} ${cls['pad0']} ${cls['bg_darkMagenta']} ${cls['fg_white']}`}>
                                                <div className={cls['division_row_part1']}>
                                                    <div className={`${cls['profile_brand']} ttu tc`}>Year In Business</div>
                                                    <div style={{ fontSize: '4em' }}>{`${(yib && yib > 99) ? '99Y': `${yib}Y`}`}</div>
                                                </div>
                                            </Card>                                   
                                        </div>
                                        <div className={`${cls['division_item']}`} style={{ height: '130px' }}>
                                            <Card className={`${cls['division_container']} ${cls['pad0']} ${cls['bg_purple']} ${cls['fg_white']}`}>
                                                <div className={cls['division_row_part1']}>
                                                    <div className={`${cls['profile_brand']} ttu tc`}> Revenue</div>
                                                    <div>
                                                        <div id="revenue_portfolio"></div>
                                                    </div>
                                                </div>
                                            </Card>                                            
                                        </div>
                                    </div>
                                    <div className={`${cls['division_unset']} mt1`}>
                                        <Card className={`${cls['division_container']} ${cls['npad']}`} style={{ height: '75px' }}>
                                            <div>
                                                <small className="ttu">Ranking</small>
                                                <Icon type="info-circle" style={{ fontSize: '0.8em', marginLeft: '3px', color: '#4c83ff', cursor: 'pointer' }} />
                                            </div>
                                            <div className={`${cls['division_part6']} `}>
                                                <div className={`f3 v-mid ttu tc ${cls['fg_white']}`} style={{ background: '#4682b4' }}>{cust_ranking}</div>
                                                <div className="ttu tc b">
                                                    <Rate className={`${cls['f1_7']}`} value={this.handleStarRanking(cust_ranking)} allowHalf disabled />
                                                </div>                                            
                                            </div>
                                        </Card>                                
                                    </div>
                                </div>
                            </div>
                            
                            <div key={2} className={cls['profile_div']}>
                                <Card className={`${cls['division_container']}`}>
                                    <div className={`${cls['division_part']} ${cls['details_info']} ${cls['h150']}`}>       
                                        <Form onSubmit={this.handleSubmit}>
                                            <Row>
                                                <Col span={24} className={`${cls['cust_brands']} ${cls['f_9']} ttu tc`}>
                                                    {(this.state.handleForm.edit) ? 'Update' : ''} Customer Information
                                                    {/* 
                                                    <ButtonGroup size="small" className="fr">
                                                        <Tooltip title="View history">
                                                            <Popover placement="bottomLeft" content={timeline_history} trigger="click">
                                                                <Button type="dash"><i className="fa fa-history" aria-hidden="true"></i></Button>
                                                            </Popover>
                                                        </Tooltip>            
                                                        <Tooltip title="Update information">
                                                            <Button type="dash" icon="edit" onClick={this.handleEditFormOpen} className={`${(this.state.handleForm.edit) ? `${cls['hide']}` : 'animated fadeIn'}`} disabled={false} />
                                                        </Tooltip>
                                                        <Tooltip title="Cancel Update">
                                                            <Button type="dash" icon="close" onClick={this.handleEditFormClose} className={cls['fg_red']} className={`${(this.state.handleForm.edit) ? 'animated bounceIn' : cls['hide']}`} />
                                                        </Tooltip>
                                                        <Tooltip title="Save">                                                            
                                                                <Button type="dash" icon="save" htmlType="submit" className={`${(this.state.handleForm.edit) ? 'animated bounceIn' : cls['hide']}`} />
                                                        </Tooltip>                                                         
                                                    </ButtonGroup> 
                                                    */}
                                                </Col> 
                                                <Col span={24}>
                                                    <Col span={8} className={`${cls['text']} ${(this.state.handleForm.edit) ? cls['f_7'] : ''} ttu`}>Name</Col>  
                                                    <Col span={16} className={`${cls['text']} ${(this.state.handleForm.edit) ? cls['f_7'] : ''}`}>
                                                        <span className={`${(this.state.handleForm.edit) ? cls['hide'] : '' }`}>{custname}</span>
                                                        {
                                                            getFieldDecorator('customer_name', { initialValue: custname })
                                                            (<Input size="small" className={`${cls['f1_0']} ${(!this.state.handleForm.edit) ? cls['hide'] : '' }`} />)
                                                        }
                                                    </Col>    
                                                </Col> 
                                                <Col span={24}>
                                                    <Col span={8} className={`${cls['text']} ${(this.state.handleForm.edit) ? cls['f_7'] : ''} ttu`}>Company / Workplace</Col>  
                                                    <Col span={16} className={`${cls['text']} ${(this.state.handleForm.edit) ? cls['f_7'] : ''}`}>
                                                        <span className={`${(this.state.handleForm.edit) ? cls['hide'] : '' }`}>{corperation}</span>
                                                        {
                                                            getFieldDecorator('company_name', { initialValue: corperation })
                                                            (<Input size="small" className={`${cls['f1_0']} ${(!this.state.handleForm.edit) ? cls['hide'] : '' }`} />)
                                                        }
                                                    </Col>    
                                                </Col>                                            
                                                <Col span={24}>
                                                    <Col span={8} className={`${cls['text']} ${(this.state.handleForm.edit) ? cls['f_7'] : ''} ttu`}>Business Desc</Col>  
                                                    <Col span={16} className={`${cls['text']} ${(this.state.handleForm.edit) ? cls['f_7'] : ''}`}>
                                                        <span className={`${(this.state.handleForm.edit) ? cls['hide'] : '' }`}>{business}</span>
                                                        {
                                                            getFieldDecorator('business_type', { initialValue: business })
                                                            (<Input size="small" className={`${cls['f1_0']} ${(!this.state.handleForm.edit) ? cls['hide'] : '' }`} />)
                                                        }
                                                    </Col>    
                                                </Col>
                                                <Col span={24}>
                                                    <Col span={8} className={`${cls['text']} ${(this.state.handleForm.edit) ? cls['f_7'] : ''} ttu`}>Owner</Col>  
                                                    <Col span={16} className={`${cls['text']} ${(this.state.handleForm.edit) ? cls['f_7'] : ''}`}>
                                                        <span className={`${(this.state.handleForm.edit) ? cls['hide'] : '' }`}>{(is_owner && is_owner == 'Y') ? 'ใช่' : 'ไม่ใช่'}</span>
                                                        {
                                                            getFieldDecorator('is_owner', { initialValue: is_owner })
                                                            (
                                                                <Select size="small" className={`${cls['f1_0']} ${(!this.state.handleForm.edit) ? cls['hide'] : '' }`}>
                                                                    <Option value="" className={`${cls['f_9']}`}>โปรดเลือก</Option>
                                                                    <Option value="Y" className={`${cls['f_9']}`}>ใช่</Option>
                                                                    <Option value="N" className={`${cls['f_9']}`}>ไม่ใช่</Option>
                                                                </Select>
                                                            )
                                                        }
                                                    </Col>    
                                                </Col> 
                                                <Col span={24}>
                                                    <Col span={8} className={`${cls['text']} ${(this.state.handleForm.edit) ? cls['f_7'] : ''} ttu`}>Address</Col>  
                                                    <Col span={16} className={`${cls['text']} ${(this.state.handleForm.edit) ? cls['f_7'] : ''}`} style={{...fieldMaxHeight}}>
                                                        {(!_.isEmpty(district)) && `${district}/`}{address}
                                                    </Col>    
                                                </Col> 
                                                <Col span={24}>
                                                    <Col span={8} className={`${cls['text']} ${(this.state.handleForm.edit) ? cls['f_7'] : ''} ttu`}>Phone</Col>  
                                                    <Col span={16} className={`${cls['text']} ${(this.state.handleForm.edit) ? cls['f_7'] : ''}`}>
                                                        <span className={`${cls['f_9']} ${(this.state.handleForm.edit) ? cls['hide'] : '' }`}>{custmobile}</span>
                                                        {
                                                            getFieldDecorator('mobile_no', { initialValue: rawmobile })
                                                            (<Input size="small" className={`${cls['f1_0']} ${(!this.state.handleForm.edit) ? cls['hide'] : '' }`} />)
                                                        }
                                                    </Col>    
                                                </Col>  
                                                <Col span={24}>
                                                    <Col span={8} className={`${cls['text']} ${(this.state.handleForm.edit) ? cls['f_7'] : ''} ttu`}>Email</Col>  
                                                    <Col span={16} className={`${cls['text']} ${(this.state.handleForm.edit) ? cls['f_7'] : ''}`} style={{...fieldMaxHeight}}>
                                                        {`${email}`}
                                                    </Col>    
                                                </Col>                             
                                            </Row>
                                            <Row className={`${(this.state.handleForm.edit) ? cls['hide'] : '' }`}>
                                                <Col span={24} className={`${cls['owner_brands']} ${cls['f_9']} ttu tc mt1`}>Application Owner Information</Col>                                             
                                                <Col span={24}>
                                                    <Col span={8} className={`${cls['text']} ${(this.state.handleForm.edit) ? cls['f_7'] : ''} ttu`}>Channel / Team</Col>  
                                                    <Col span={16} className={`${cls['text']} ${(this.state.handleForm.edit) ? cls['f_7'] : ''}`}>{`${group_team} ${(group_team && group_team !== 'LB') ? group_dep:''} / ${team_name}`}</Col>    
                                                </Col>                                                         
                                                <Col span={24}>
                                                    <Col span={8} className={`${cls['text']} ${(this.state.handleForm.edit) ? cls['f_7'] : ''} ttu`}>Employee</Col>  
                                                    <Col span={16} className={`${cls['text']} ${(this.state.handleForm.edit) ? cls['f_7'] : ''}`}>{emp_name} {`${(emp_mobile && !_.isEmpty(emp_mobile)) ? `(${emp_mobile})` : ''}`}</Col>    
                                                </Col> 
                                            </Row>
                                        </Form>
                                    </div> 
                                </Card>
                            </div>    

                            <div key={3} className={cls['profile_div']}>&nbsp;</div>

                        </div>

                        <div key="profile_p2" className={cls['profile_partition']}>
                            <div key={1} className={cls['profile_div']}>
                                <Card className={`${cls['profile_general']} ${cls['lead']} ${cls['division_container']}`}>
                                    <Collapse
                                        bordered={false}
                                        defaultActiveKey={["1"]}
                                        className={`${cls['profile_collapse']} ant-collapse-content-box`}
                                        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
                                    >
                                        <Panel header={(<div>Channel Information</div>)} key="1">
                                            <Row style={{ padding: '0 5px' }}>
                                                <Col span={24}>
                                                    <Col span={9} className={`${cls['f_8']} ttu`}>Channel</Col>
                                                    <Col span={15} className={`${cls['f_8']} ttu`}>{refer_source}</Col>
                                                </Col>
                                                <Col span={24}>
                                                    <Col span={9} className={`${cls['f_8']} ttu`}>Source</Col>
                                                    <Col span={15} className={`${cls['f_8']} ttu`}>{refer_channel}</Col>
                                                </Col> 
                                                <Col span={24}>
                                                    <Col span={9} className={`${cls['f_8']} ttu`}>Purpose</Col>
                                                    <Col span={15} className={`${cls['f_8']} ttu`}>{loan_purpose}</Col>
                                                </Col> 
                                                <Col span={24}>
                                                    <Col span={9} className={`${cls['f_8']} ttu`}>Request Loan</Col>
                                                    <Col span={15} className={`${cls['f_8']} ttu`}>{loan_request}</Col>
                                                </Col> 
                                            </Row>
                                        </Panel>
                                        <Panel header="Application Progress" key="2">
                                            <div className={`${cls['profile_grid']}`} style={{ padding: '0 0px' }}>
                                                <div className={`${cls['thead']} ${cls['color1']} ttu tc`}>Verification</div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>Created</div>
                                                    <div className={`${cls['grid_item']}`}>{create_profile}</div>
                                                </div>   
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>App No</div>
                                                    <div className={`${cls['grid_item']}`}>{application_no}</div>
                                                </div>   
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>ID Card</div>
                                                    <div className={`${cls['grid_item']}`}>{id_card}</div>
                                                </div>                                    
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>NCB Date</div>
                                                    <div className={`${cls['grid_item']}`}>{ncb_consent}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>Program</div>
                                                    <div className={`${cls['grid_item']} ${cls['grid_item_ellipsis']}`}>
                                                        <Popover content={product_program}>{product_program}</Popover>
                                                    </div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>RM Onhand</div>
                                                    <div className={`${cls['grid_item']}`}>{`${rm_onhand}`}</div>
                                                </div>  
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>RM UpDate</div>
                                                    <div className={`${cls['grid_item']}`}>{`${(rm_onhand_date && !_.isEmpty(rm_onhand_date)) ? `${rm_onhand_date}`: ''}`}</div>                                        
                                                </div>                                           
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>Plan A2CA</div>
                                                    <div className={`${cls['grid_item']}`}>{plan_a2ca}</div>
                                                </div>       
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>Reconcile</div>
                                                    <div className={`${cls['grid_item']}`}>{`${reconcile_status} ${(reconcile_date) ? `: ${reconcile_date}` : ''}`}</div>
                                                </div>                                          
                                                <div className={`${cls['thead']} ${cls['bg_teal']} ${cls['fg_white']} ttu tc`}>CA Decision</div> 
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>A2CA Date</div>
                                                    <div className={`${cls['grid_item']}`}>{app_to_cadate}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>CA Name</div>
                                                    <div className={`${cls['grid_item']}`}>{ca_name}</div>
                                                </div>  
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>Status</div>
                                                    <div className={`${cls['grid_item']}`}>
                                                        {`${decision_status} ${(status_date && !_.isEmpty(status_date) && decision_status !== 'CR') ? ` : ${status_date}` : '' } ${(decision_status == 'CR') ? ` : ${ca_returndate}` : ''}`}
                                                    </div>
                                                </div>  
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>Reason</div>
                                                    <div className={`${cls['grid_item']}`}>{status_reson}</div>
                                                </div>  
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>Approved Amt</div>
                                                    <div className={`${cls['grid_item']}`}>{`${(approved_amt && approved_amt > 0) ? numberWithCommas(approved_amt) : `${(preloan_amt && preloan_amt > 0) ? (numberWithCommas(preloan_amt)) : ''}`}`}</div>
                                                </div>    
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>Plan DD</div>
                                                    <div className={`${cls['grid_item']}`}>{plan_drawdown}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>DD Date</div>
                                                    <div className={`${cls['grid_item']}`}>{drawdown_date}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>DD Amt</div>
                                                    <div className={`${cls['grid_item']}`}>{drawdown_amt}</div>
                                                </div>
                                            </div>
                                            {/*
                                                <Row>
                                                    <Col span={24} className={`${cls['bg_firebrick']} ${cls['f_9']} ttu tc`}>Action Note</Col>  
                                                    <Col span={24} className={`${cls['f_8']}`} style={{ paddingLeft: '9px', height: '20px' }}>{action_note}</Col>  
                                                </Row>
                                            */}
                                            
                                        </Panel>
                                        <Panel header="Existing Customer" key="3" disabled={true}>                                   
                                            <div className={`${cls['profile_grid']}`} style={{ padding: '0 7px' }}>
                                                <div className={`${cls['header2']} ttu tc`}>Loan Information</div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>App No</div>
                                                    <div className={`${cls['grid_item']}`}>{}</div>
                                                </div>                                      
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Program</div>
                                                    <div className={`${cls['grid_item']}`}>{}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Drawdown</div>
                                                    <div className={`${cls['grid_item']}`}>{}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Credit Limit</div>
                                                    <div className={`${cls['grid_item']}`}>{}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>OS / %Repay</div>
                                                    <div className={`${cls['grid_item']}`}>{}</div>
                                                </div>                                        
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Interest Rate</div>
                                                    <div className={`${cls['grid_item']}`}>{}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Installment</div>
                                                    <div className={`${cls['grid_item']}`}>{}</div>
                                                </div>                                       
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>MoB / Tenor</div>
                                                    <div className={`${cls['grid_item']}`}>{}</div>
                                                </div>

                                                <div className={`${cls['header3']} ttu tc`}>Collateral Information</div>  
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Guarantee</div>
                                                    <div className={`${cls['grid_item']}`}>{}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Mortgage</div>
                                                    <div className={`${cls['grid_item']}`}>{}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Appraisal</div>
                                                    <div className={`${cls['grid_item']}`}>{}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Original LTV</div>
                                                    <div className={`${cls['grid_item']}`}>{}</div>
                                                </div>
                                                {/* 
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}></div>
                                                    <div className={`${cls['grid_item']}`}>{}</div>
                                                </div>
                                                */}
                                            </div>                                           
                                        </Panel>
                                    </Collapse>
                                </Card>
                            </div>
            
                            <div key={2} className={`${cls['profile_div']} ${cls['customer_tracking_zone']} ${(handleZone.ZoneTracking && !handleZone.ZoneTransfer) ? cls['in'] : cls['out']}`}>
                                <Card className={`${cls['division_container']} ${cls['h_auto']}`} style={(is_existapp) ? { display: 'none' } : {} }>
                                    <Form onSubmit={this.handleCreateActionNote} className={`${cls['form_container']}`}>
                                        <div className={cls['division_part1']}>
                                            <div>
                                                <div className="ttu b">Customer Tracking</div>
                                            </div>
                                            <div>
                                                <Button type="primary" htmlType="submit" size="small" className={`${cls['m0']} ttu fr mt2 ${cls['f_9']}`}>Save</Button>
                                            </div>
                                        </div>                                    
                                        <Row gutter={10}>
                                            <Col span={12}>
                                                <FormItem label={(<span className={`${cls['f1_0']}`}>Response</span>)} className={`${cls['form_item']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                    {
                                                        getFieldDecorator('ResponseCode', { initialValue: '' })
                                                        (
                                                            <Select className={`${cls['f1_1']}`}>
                                                                <Option value="">โปรดเลือก</Option>      
                                                                {
                                                                    (master_reponse && master_reponse.length > 0) && _.map(master_reponse, (v, i) => {
                                                                        return (<Option key={v.ResponseCode} value={v.ResponseCode}>{`${v.ResponseLabel} (${v.ResponseCode})`}</Option>)
                                                                    })
                                                                }   
                                                            </Select>
                                                        )
                                                    }
                                                </FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label={(<span className={`${cls['f1_0']}`}>Reason</span>)} className={`${cls['form_item']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                    {                                                    
                                                        getFieldDecorator('ActionID', { initialValue: '' })
                                                        (
                                                            <Select className={`${cls['f1_1']}`}>    
                                                                <Option value="">โปรดเลือก</Option>
                                                                {
                                                                    (master_action && master_action.length > 0) && _.map(master_action, (v, i) => {
                                                                        return (<Option key={v.ActionID} value={`${v.ActionID}`}>{`${v.ActionName}`}</Option>)
                                                                    })
                                                                } 
                                                            </Select>
                                                        )
                                                    }
                                                </FormItem>
                                            </Col>
                                            <Col span={24}>
                                                <FormItem label={(<span className={`${cls['f1_0']}`}>Action Note</span>)} className={`${cls['form_item']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                    {
                                                        getFieldDecorator('ActionNote', { initialValue: '' })
                                                        (<TextArea autosize={{ minRows: 1, maxRows: 1 }} className={`${cls['f1_1']}`} />)
                                                    }
                                                </FormItem>
                                            </Col>
                                            <Col span={24}></Col>
                                        </Row>
                                    </Form>
                                </Card>

                                <div className={`${cls['timelime_container']}`}>
                                    <div className={cls['timeline_title']}>
                                        <small className="ttu b">Activity Timeline ({`${(activity_timeline && activity_timeline.length > 0) ? activity_timeline.length : '0'} Items`})</small>
                                    </div>
                                    <Scrollbar>
                                        <div className={cls['timeline_content']}>                                                                
                                            <Timeline className={styles['timelime_wrapper']} style={{ paddingTop: '7px' }}>
                                                {
                                                    (activity_timeline && !_.isEmpty(activity_timeline)) && _.map(activity_timeline, (v, i) => {
                                                        let img = `http://172.17.9.94/newservices/LBServices.svc/employee/image/${v.CreateID}`
                                                        return (
                                                            <TimelineItem key={(i + 1)} dot={<Avatar src={img} shape="square" icon="user" size="small" className={cls['avatar_icon']} />} className={styles['timelime_item']}>
                                                                <Card title={this.handleTimelineHeader(v)}>
                                                                    <div>{`สถานะ: ${v.ResponseLabel} ${(v.ActionName && !_.isEmpty(v.ActionName)) ? ' เหตุผล: ' + v.ActionName : '' }`}</div>
                                                                    <div className={ _.isEmpty(v.ActionNote) ? cls['hide'] : '' }>{`ข้อความ : ${(!_.isEmpty(v.ActionNote)) ? v.ActionNote : '-'}`}</div>
                                                                </Card>
                                                            </TimelineItem>
                                                        )
                                                    })
                                                }
                                            </Timeline>                                
                                        </div>
                                    </Scrollbar>
                                </div>
                            </div>

                            <div key={3} className={`${cls['profile_div']} ${cls['customer_tracking_zone']} ${(handleZone.ZoneTransfer && !handleZone.ZoneTracking) ? cls['in'] : cls['out']}`}>
                                <Card className={`${cls['division_container']} ${cls['h_auto']}`}>
                                <Form onSubmit={this.handleTransfer} className={`${cls['form_container']}`}>
                                        <div className={cls['division_part1']}>
                                            <div>
                                                <div className="ttu b">Product Transfer</div>
                                            </div>
                                            <div>
                                                <Button type="primary" htmlType="submit" size="small" className={`${cls['m0']} ttu fr mt2 ${cls['f_9']}`}>Transfer</Button>
                                            </div>
                                        </div>                                    
                                        <Row gutter={10}>
                                            <Col span={12}>
                                                <FormItem label={(<span className={`${cls['f1_0']}`}>Product Type</span>)} className={`${cls['form_item']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                    {
                                                        getFieldDecorator('ProductType', { initialValue: '' })
                                                        (
                                                            <Select className={`${cls['f1_1']}`} onChange={this.handleProductSelector.bind(this, data)}>
                                                                <Option value="">โปรดเลือก</Option>     
                                                                {
                                                                    (master_product && master_product.length > 0) && _.map(master_product, (v) => {
                                                                        return (<Option key={v.PGCode} value={v.PGCode} disabled={(v.DropdownEnable && v.DropdownEnable == 'Y') ? false : true}>{`${v.PGLabel}`}</Option>)
                                                                    })
                                                                }    
                                                            </Select>
                                                        )
                                                    }
                                                </FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label={(<span className={`${cls['f1_0']}`}>Reasons for change product</span>)} className={`${cls['form_item']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                    {                                                    
                                                        getFieldDecorator('ChangeReason', { initialValue: '' })
                                                        (<Input disabled={!this.state.ctrlTransfer.field_reason} />)
                                                    }
                                                </FormItem>
                                            </Col>                    
                                        </Row>
                                        <Row gutter={10}>
                                            <Col span={24}>
                                                <FormItem label={(<span className={`${cls['f1_0']}`}>Team in the customer area</span>)} className={`${cls['form_item']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                    {
                                                        getFieldDecorator('TransferNewBranch', { initialValue: (branch_around_custarea.Status && branch_around_custarea.Data.length == 1) ? branch_around_custarea.Data[0].BranchCostCenter : null })
                                                        (
                                                            <Select disabled={!this.state.ctrlTransfer.field_reason}>
                                                                {
                                                                    (branch_around_custarea && branch_around_custarea.Status) &&
                                                                    _.map(branch_around_custarea.Data, (v) => {
                                                                        return (<Option key={v.BranchCostCenter} value={v.BranchCostCenter}>{`${v.BranchName} ${(v.ZoneValue) ? `(${v.ZoneValue})` : ''}`}</Option>)
                                                                    })
                                                                }
                                                            </Select>
                                                        )
                                                    }
                                                </FormItem> 
                                            </Col>
                                            <Col span={12}></Col>
                                        </Row>
                                    </Form>
                                </Card>
                            </div>
                            
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }

    handleProductSelector = (data, val) => {
        const { authen, GET_BRANCH_CUSTAREA, form: { setFieldsValue } } = this.props

        if(_.isEmpty(val)) {
            setFieldsValue({ ProductType: null })
        } else {

            let LOAD_BRANCH_LIST = GET_BRANCH_CUSTAREA
            let FIELD_RELATION_TRIGGER = this.handleRelationFieldOfTransfer

            confirm({
                title: 'แจ้งเตือนจากระบบ',
                content: 'กรุณาตรวจสอบและยืนยันการเลือกประเภทโปรแกรมสินเชื่อ กรณีข้อมูลถูกต้องโปรดคลิก Ok หรือ Cancel เพื่อยกเลิก',
                onOk() {
                    const auth = (authen && authen.Auth) ? authen.Auth : null
                    const emp_code = (!_.isEmpty(auth)) ? auth.EmployeeCode : null

                    let requestData = {
                        AuthCode: emp_code,
                        ProductCode: val,
                        ReferID: (data && data.RabbitFinanceID) ? data.RabbitFinanceID : null
                    }

                    LOAD_BRANCH_LIST(requestData)
                    FIELD_RELATION_TRIGGER(true)
                    setFieldsValue({ ProductType: val })

                },
                onCancel() {
                    setFieldsValue({ ProductType: null })
                    FIELD_RELATION_TRIGGER(false)
                }
            })  
        }
    }

    handleRelationFieldOfTransfer = (status) => {
        this.setState({ 
            ctrlTransfer: _.assignIn({}, this.state.ctrlTransfer, { 
                field_reason: status,
                field_team: status
            })
        })
    }

    
    handleTitleHeader = () => {
        const { config, dataSource: { data } } = this.props

        let create_profile   = (data && !_.isEmpty(data.CreateDate)) ? moment(data.CreateDate).format('DD/MM/YYYY') : ''
        let is_existapp   = (create_profile && !_.isEmpty(create_profile)) ? true : false
        let create_enable  = (data && data.ResponseCode == 'Y' && is_existapp !== true) ? true : false
        let product_disable  = (data && data.Product == 'H4C') ? true : false

        let has_owner   = (data && !_.isEmpty(data.EmpCode)) ? true : false
  
        return (
            <div className={`${cls['header']}`}>
                <div className={`${cls['items']} ttu`}>{config.grid.crm.lead_topup.modal.title}</div>
                <div className={`${cls['items']} ${cls['unset']}`}>                    
                    <ButtonGroup className="fr" size="small">
                        <Button type={(this.state.handleZone.ZoneTracking) ? 'primary' : 'danger'} icon="swap" className="ttu" onClick={this.handleSwitchZone} disabled={true}>{`${(this.state.handleZone.ZoneTracking) ? 'Transfer' : 'Cancel Transfer'}`}</Button>
                        <Button type="primary" icon="plus" onClick={this.handleCustProfileOpen} disabled={!create_enable} className="ttu" style={(product_disable) ? { display: 'none' } : {}}>Create PCIS</Button>
                    </ButtonGroup>
                    <Button size="small" type="dashed" icon="form" className="ttu fr mr1" onClick={this.handleEditProfileOpen}>Edit Profile</Button>
                </div>
            </div>
        )
    }

    handleSwitchZone = () => {
        this.setState({ 
            handleZone: {
                ZoneTracking: !this.state.handleZone.ZoneTracking,
                ZoneTransfer: !this.state.handleZone.ZoneTransfer
            }
        })
    }

    handleTransfer = (e) => {
        const { authen, dataSource: { data }, PRODUCT_MANAGEMENT_TRANSFER } = this.props
        e.preventDefault()

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const auth = (authen && authen.Auth) ? authen.Auth : null
                const emp_code = (!_.isEmpty(auth)) ? auth.EmployeeCode : null
                const emp_name = (!_.isEmpty(auth)) ? (auth.EmpName_TH).replace('+', ' ') : null
                
                let data_logs = {                    
                    ReferChannelCode: (data.RabbitFinanceID) ? data.RabbitFinanceID : null,                   
                    OriginProduct: (data.Product) ? data.Product : null,                    
                    OriginBranchCode: (data.BranchCode) ? data.BranchCode : null,
                    OriginEmpCode: (data.EmpCode) ? data.EmpCode : null,
                    ProductTransfer: (values.ProductType) ? values.ProductType : null,
                    TransferToNewBranch: (values.TransferNewBranch) ? values.TransferNewBranch : null,
                    ChangeOfReason: (values.ChangeReason) ? values.ChangeReason : null,
                    CreateByID: emp_code,
                    CreateByName: emp_name
                }

                if(_.isEmpty(data_logs.ProductTransfer) && _.isEmpty(data_logs.ChangeOfReason)) {
                    notification.error({ message: 'แจ้งเตือนจากระบบ', description: 'กรุณากรอกข้อมูลให้ครบถ้วน โปรดระบุประเภทของโปรแกรมสินเชื่อและระบุเหตุผลในการเปลี่ยนในครั้งนี้' })
                } 
                if(!_.isEmpty(data_logs.ProductTransfer) && _.isEmpty(data_logs.ChangeOfReason)) {
                    notification.error({ message: 'แจ้งเตือนจากระบบ', description: 'กรุณาระบุเหตุผลในการเปลี่ยนทีมในครั้งนี้' })
                } 
                else if (!_.isEmpty(data_logs.ProductTransfer) && !_.isEmpty(data_logs.ChangeOfReason) && data_logs.ChangeOfReason.length <= 10) {
                    notification.error({ message: 'แจ้งเตือนจากระบบ', description: 'กรุณาระบุเหตุผลในการเปลี่ยนทีมในครั้งนี้ โดยระบุมากกว่า 10 ตัวอักษร' })
                }
                else {

                    let RELOAD_GRID = this.handleTransferSuccess
                    confirm({
                        title: 'คุณต้องการโอนย้ายประเภทสินเชื่อหรือไม่?',
                        content: 'กรุณาตรวจสอบข้อมูลให้ถูกต้อง กรณีข้อมูลถูกต้องโปรดคลิก Ok เพื่อยืนยันการบันทึกข้อมูล หรือ Cancel เพื่อยกเลิกการทำรายการ',
                        onOk() {
                            PRODUCT_MANAGEMENT_TRANSFER(data_logs)
                            RELOAD_GRID()
           
                        },
                        onCancel() {}
                    })      
                }

            }
        })

    }

    handleTransferSuccess = () => {
        this.setState({ updateProfile: true })
        this.handleModalClose()
    }

    handleSubmit = (e) => {
        const { authen, dataSource: { data } } = this.props
        e.preventDefault()

        let handleProfileUpdate = this.handleUpdateCustProfile
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {

                const auth = (authen && authen.Auth) ? authen.Auth : null
                const emp_code = (!_.isEmpty(auth)) ? auth.EmployeeCode : null
                const emp_name = (!_.isEmpty(auth)) ? (auth.EmpName_TH).replace('+', ' ') : null
            
                let data_logs = {
                    ReferSource: (data.SourceChannel) ? data.SourceChannel : null,
                    ReferCode: (data.RabbitFinanceID) ? data.RabbitFinanceID : null,                   
                    CustomerName: (data && data.CustomerName) ? data.CustomerName : null,
                    NewCustomerName: (data.CustomerName !== values.customer_name) ? values.customer_name : null,
                    CompanyName: (data && data.CompanyName) ? data.CompanyName : null,
                    NewCompanyName: (data.CompanyName !== values.company_name) ? values.company_name : null,
                    BusinessType: (data && data.BusinessType) ? data.BusinessType : null,
                    NewBusinessType: (data.BusinessType !== values.business_type) ? values.business_type : null,
                    IsOwner: (data && data.IsOwner) ? data.IsOwner : null,
                    NewIsOwner: (data.IsOwner !== values.is_owner) ? values.is_owner : null,
                    MobileNo: (data && data.MobileNo) ? data.MobileNo : null,
                    NewMobileNo: (data.MobileNo !== values.mobile_no) ? values.mobile_no : null,
                    CreateByID: emp_code,
                    CreateByName: emp_name
                }

                let field_isempty = []
                let field_validation = []

                if(_.isEmpty(values.customer_name)) { field_isempty.push('TRUE') } else { field_isempty.push('FALSE') }
                if(_.isEmpty(values.company_name)) { field_isempty.push('TRUE') } else { field_isempty.push('FALSE') }
                if(_.isEmpty(values.business_type)) { field_isempty.push('TRUE') } else { field_isempty.push('FALSE') }
                if(_.isEmpty(values.is_owner)) { field_isempty.push('TRUE') } else { field_isempty.push('FALSE') }
                if(_.isEmpty(values.mobile_no)) { field_isempty.push('TRUE') } else { field_isempty.push('FALSE') }

                if(values.customer_name !== data.CustomerName) { field_validation.push('TRUE') } else { field_validation.push('FALSE') }
                if(values.company_name !== data.CompanyName) { field_validation.push('TRUE') } else { field_validation.push('FALSE') }
                if(values.business_type !== data.BusinessType) { field_validation.push('TRUE') } else { field_validation.push('FALSE') }
                if(values.is_owner !== data.IsOwner) { field_validation.push('TRUE') } else { field_validation.push('FALSE') }
                if(values.mobile_no !== data.MobileNo) { field_validation.push('TRUE') } else { field_validation.push('FALSE') }

                if(in_array('TRUE', field_isempty)) {
                    notification.error({
                        message: 'แจ้งเตือนจากระบบ',
                        description: 'กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนการบันทึกข้อมูล',
                    })
                } else {
                    if(!in_array('TRUE', field_validation)) {
                        notification.error({
                            message: 'แจ้งเตือนจากระบบ',
                            description: 'ไม่พบการเปลี่ยนแปลงของข้อมูล...',
                        })
                    }

                    if(in_array('TRUE', field_validation)) {

                        confirm({
                            title: 'คุณต้องการบันทึกข้อมูลนี้หรือไม่?',
                            content: 'กรณีตรวจสอบข้อมูล กรณีข้อมูลถูกต้องโปรดคลิก Ok เพื่อยืนยันการบันทึกข้อมูลหรือ Cancel เพื่อยกเลิก',
                            onOk() {
                                handleProfileUpdate(data_logs)
                            },
                            onCancel() {}
                        })      

                        
                    }
                
                }

            }
        });
    
    }

    handleUpdateCustProfile = (log) => {
        const { UPDATE_CUSTPROFILE } = this.props
        UPDATE_CUSTPROFILE(log)  
        this.setState({ updateProfile: true })
    }

    // FORM HANDLE FOR SUBMIT TO DATABASE
    handleCreateActionNote = (e) => {
        e.preventDefault()

        const { authen, form: { validateFields }, dataSource: { data }, CREATE_ACTIONNOTE } = this.props
        validateFields((err, fieldData) => {
            if(!err) {

                const auth = (authen && authen.Auth) ? authen.Auth : null
                const emp_code = (!_.isEmpty(auth)) ? auth.EmployeeCode : null
                const emp_name = (!_.isEmpty(auth)) ? (auth.EmpName_TH).replace('+', ' ') : null

                let requestData = {
                    ReferCode: (data.RabbitFinanceID) ? data.RabbitFinanceID : null,
                    ResponseCode: (fieldData.ResponseCode && !_.isEmpty(fieldData.ResponseCode)) ? fieldData.ResponseCode : null,
                    ActionID: (fieldData.ActionID && !_.isEmpty(fieldData.ActionID)) ? fieldData.ActionID : null,                   
                    ActionNote: (fieldData.ActionNote && !_.isEmpty(fieldData.ActionNote)) ? fieldData.ActionNote : null,
                    CreateID: emp_code,
                    CreateName: emp_name
                }

                let handleReset = this.handleReset
                let handleAutoLoadActionNote = this.handleActionNoteEnable
                confirm({
                    title: 'คุณต้องการบันทึกข้อมูลนี้หรือไม่?',
                    content: 'กรณีตรวจสอบข้อมูล กรณีข้อมูลถูกต้องโปรดคลิก Ok เพื่อยืนยันการสร้างข้อมูลหรือ Cancel เพื่อยกเลิก',
                    onOk() {
                        if(!_.isEmpty(requestData.ResponseCode)) {
                            CREATE_ACTIONNOTE(requestData)
                            handleAutoLoadActionNote()
                            handleReset()
        
                        } else {
                            notification.error({
                                message: 'ข้อมูลไม่ถูกต้อง',
                                description: 'โปรดตรวจสอบข้อมูลใหม่อีกครั้ง',
                            })
                        }
                    },
                    onCancel() {}
                })          

            }
            
        })

    }

    handleStarRanking = (rank) => {
        if(rank && !_.isEmpty(rank)) {
            if(in_array(rank, ['AA', 'AB', 'AC'])) {
                return 5
            } 
            else if(in_array(rank, ['BA', 'BB', 'BC'])) {
                return 4
            }
            else if(in_array(rank, ['CA', 'CB', 'CC'])) {
                return 3
            }
            else if(in_array(rank, ['DA', 'DB', 'DC'])) {
                if(rank == 'DA') {
                    return 1
                } else {
                    return 2
                }
            } else {
                return 0
            }
        } else {
            return 0
        }        
    }

    handleTimelineHeader = (data) => {
        return (
            <div className={cls['timelime_division']}>
                <div className="tl">{ data.CreateName }</div>
                <div className="tr">{ moment(data.CreateDate).format('DD/MM/YYYY hh:mm') }</div>
            </div>
        )
    }

    handleLoadActionNote = (e) => {
        const { dataSource, loadActionNote } = this.props
        loadActionNote({ 
            LotID: (!e.target.checked) ? this.props.lotID : null,
            CIFNO: dataSource.CIFNO 
        })
        this.setState({ allActionNote: e.target.checked })
    }

}

const handleTelephone = (numno) => {
    if(numno) {
        let patt = new RegExp("-")
        let number_phone = `${numno.trim()}`
        if(patt.test(number_phone)) {
            number_phone = number_phone.replace('-', '')
        }
        
        switch(number_phone.length) {
            case 9: 
                return numno.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')
            default:
                if(number_phone.substring(0, 2) == '02') {
                    return numno.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')
                } else {
                    return numno.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
                }
        }
    } else {
        return null
    }
}

const gridChannelModalWrapper = Form.create()(GridChannelModal)
export default connect(
    (state) => ({
        activity_create: state.PCISCRM_REFER_LEADCHANNEL_CREATE_ACTIONNOTE,
        activity_timeline: state.PCISCRM_REFER_LEADCHANNEL_LOAD_ACTIONNOTE,
        activity_profile_hist: state.PCISCRM_REFER_LEADCHANNEL_HISTORY_CUSTPROFILE,
        branch_around_custarea: state.PCISCRM_FIND_BRANCH_IN_CUSTAREA
    }), 
    {
        LOAD_ACTIONNOTE: loadLeadChannelActionNote,
        CREATE_ACTIONNOTE: createLeadChannelActionNote,
        UPDATE_CUSTPROFILE: updateLeadChannelCustProfile,
        LOAD_CUSTPROFILE_HIST: getLeadChannelCustProfileHistory,
        PRODUCT_MANAGEMENT_TRANSFER: productTransfer,
        GET_BRANCH_CUSTAREA: getFindBranchInArea, 
    }
)(gridChannelModalWrapper)