import React, { Component } from 'react'
import { connect } from 'react-redux'
import bluebird from 'bluebird'
import { Row, Col, Modal, Collapse, Form, Select, Button, Checkbox, TreeSelect, Card, Rate, Timeline, notification, Input, Icon, Avatar, Tooltip, Popover, Progress } from 'antd'
import Scrollbar from 'react-smooth-scrollbar'
import moment from 'moment'
import _ from 'lodash'

import { roundFixed, numberWithCommas } from '../../../../containers/PCIS/config/funcitonal'

import { loadActionNote, createActionNote, createCustProhibitLog } from '../../../../actions/pcis'

import LeadNewTopupCustProfile from './LeadNewTopupCustProfile'

import cls from '../../styles/pcis_style.scss'
import styles from '../../styles/timeline.scss'

const Panel = Collapse.Panel
const FormItem  = Form.Item
const TextArea = Input.TextArea
const ButtonGroup = Button.Group
const Option = Select.Option
const confirm = Modal.confirm
const TimelineItem = Timeline.Item

const field_colon_label = false

class LeadNewTopupModal extends Component {
    
    state = {
        createProfile: {
            isOpen: false
        },
        allActionNote: false,
        loadTimeline: true,
        createTimeline: false,
        prohibitedCheck: false
    }

    componentWillReceiveProps(props) {
        if(props) {
            if(props.dataSource && !_.isEmpty(props.dataSource.data)) {
                const { authen, dataSource: { data }, LOAD_ACTIONNOTE, handleLoadTrigger } = props

                if(this.state.loadTimeline) {  
                    LOAD_ACTIONNOTE({
                        LotID: (data && data.LotNo) ? data.LotNo : null,
                        CIFNO: (data && data.CIFNO) ? data.CIFNO : null
                    })
                    this.setState({ loadTimeline: false })
                }

                if(this.state.createTimeline) {                  
                    if(!_.isEmpty(props.activity_create)) {
                        _.delay(() => {
                            const API_DEFAULT_CALL = [
                                handleLoadTrigger,
                                LOAD_ACTIONNOTE                                   
                            ]

                            bluebird.all(API_DEFAULT_CALL).each((f, i) => { 
                                if(i == 0) { f() } 
                                else {
                                    f({
                                        LotID: (data && data.LotNo) ? data.LotNo : null,
                                        CIFNO: (data && data.CIFNO) ? data.CIFNO : null
                                    }) 
                                }
                            })

     
                            this.setState({ loadTimeline: false, createTimeline: false })
                        }, 300)
                    }
                }
                
            }
           
        }
    }

    // MODAL CUST PROFILE HANDLE
    handleCustProfileOpen = () => {
        this.setState({ createProfile: _.assign({}, this.state.createProfile, { isOpen: true }) })
    }

    handleCustProfileClose = () => {
        const { handleLoadTrigger } = this.props

        handleLoadTrigger()
        this.setState({ createProfile: _.assign({}, this.state.createProfile, { isOpen: false }) })
    }

    handleEditFormOpen = () => {
        this.setState({ handleForm: _.assign({}, this.state.handleForm, { edit: true }) })
    }

    handleEditFormClose = () => {
        this.setState({ handleForm: _.assign({}, this.state.handleForm, { edit: false }) })
    }

    handleModalClose = () => {
        this.setState({
            createProfile: { isOpen: false },
            loadTimeline: true,
            createTimeline: false
        })

        this.handleReset()
        this.props.handleClose()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return  this.props.isOpen !== nextProps.isOpen ||
                this.props.dataSource !== nextProps.dataSource ||
                this.props.activity_timeline == nextProps.activity_timeline ||
                this.props.form !== nextProps.form ||
                this.state.createProfile !== nextState.createProfile ||
                this.state.allActionNote !== nextState.allActionNote ||
                this.state.handleForm !== nextState.handleForm ||
                this.state.loadTimeline !== nextState.loadTimeline ||
                this.state.createTimeline !== nextState.createTimeline ||
                this.state.prohibitedCheck !== nextState.prohibitedCheck
    }

    render() {
        const { createProfile } = this.state
        const { master, isOpen, dataSource, form, activity_timeline } = this.props
        const { getFieldDecorator, getFieldValue  } = form

        const data = (!_.isEmpty(dataSource)) ? dataSource.data : null

        const time_left = (data && data.TimeLeft > 0) ? data.TimeLeft : null

        // CHARACTER INFO
        let custname  = (data && !_.isEmpty(data.CustomerName)) ? data.CustomerName : ''
        let custphone = (data && !_.isEmpty(data.Tel)) ? handleTelephone(_.padStart(String(data.Tel), 10, '0')).replace('00', '0') : '-'
        let officetel = (data && !_.isEmpty(data.OfficeTel)) ? handleTelephone(_.padStart(String(data.OfficeTel), 10, '0')).replace('00', '0') : '-'
        let business  = (data && !_.isEmpty(data.BusinessType)) ? data.BusinessType : ''

        let custIncome = (data && data.Income > 0.00) ? numberWithCommas(data.Income) : 0

        let os_percent = (data && data.OSBalPercent != 0.00) ? roundFixed(data.OSBalPercent, 0) : 0
        let est_topup = (data && data.TopUpAmt > 0.00) ? data.TopUpAmt : ''
        let factor = (data && data.FactorPercent > 0.00) ? data.FactorPercent : 0
        let bureau_rate = (data && data.Bereau_Rate > 0) ? data.Bereau_Rate : 0
               
        // CUSTOMER INFORMATIOn
        let cust_address = (data && !_.isEmpty(data.Address)) ? data.Address : ''
        let channel = (data && !_.isEmpty(data.Channel)) ? data.Channel : '-'
        let team = (data && !_.isEmpty(data.BranchDigit)) ? data.BranchDigit : '-'
        let rm_orgin = (data && !_.isEmpty(data.Sale_OriName)) ? data.Sale_OriName : ''
        let rm_name = (data && !_.isEmpty(data.Sale_CurrentName)) ? data.Sale_CurrentName : ''
        
        // LOAN INFORMATION 
        let appno = (data && !_.isEmpty(data.ApplicationNo)) ? data.ApplicationNo : '-'
        // let product_code = (data && !_.isEmpty(data.ProductCode)) ? data.ProductCode : ''
        let program = (data && !_.isEmpty(data.ProductDesc)) ? data.ProductDesc : ''
        let drawdown_date = (data && !_.isEmpty(data.Existing_DrawdownDate)) ? moment(data.Existing_DrawdownDate).format('DD/MM/YYYY') : ''
        let drawdown_amount = (data && data.Existing_DrawdownFullAmt > 0) ? numberWithCommas(data.Existing_DrawdownFullAmt) : ''
        let os_amount = (data && data.OSBalFullAmt > 0.00) ? numberWithCommas(data.OSBalFullAmt) : 0
        let repay_per = (data && data.RepayPercent > 0.00) ? roundFixed(data.RepayPercent, 0) : 0
        let interest_rate = (data && data.InterestRate > 0.00) ? data.InterestRate : 0
        let installment = (data && data.Payment > 0.00) ? numberWithCommas(data.Payment) : 0
        let monthOnBook = (data && data.MoB > 0) ? data.MoB : 0
        let tenor = (data && data.Tenor > 0) ? data.Tenor : 0
        
        // COLLATERAL INFORMATION
        let apprisal_id = (data && !_.isEmpty(data.ApprisalID)) ? data.ApprisalID : '-'
        let guarantee = (data && !_.isEmpty(data.Collateral) && data.Collateral !== 'NULL') ? data.Collateral : '-'
        let mortgage = (data && data.Mortgage > 0) ? numberWithCommas(data.Mortgage) : '-'
        let appraisal_title = (data && data.NumTitle) ? data.NumTitle : '-'
        let appraisal = (data && data.ApprisalAmount > 0) ? numberWithCommas(data.ApprisalAmount) : '-'
        let appraisal_date = (data && !_.isEmpty(data.LatestApprisalDate)) ? moment(data.LatestApprisalDate).format('DD/MM/YYYY') : '-'
        
        let o_ltv = (data && data.O_LTV > 0.00) ? roundFixed(data.O_LTV, 0) : 0
        let c_ltv = (data && data.C_LTV > 0.00) ? roundFixed(data.C_LTV, 0) : 0

        let total_newlimit = (data && data.TotalNewLimit > 0.00) ? roundFixed(data.TotalNewLimit, 2) : 0

        let _appraisal = (data && data.ApprisalValueFullAmt > 0) ? data.ApprisalValueFullAmt : 0
        let _newlimit  = (data && data.TotalNewLimitFullAmt > 0.00) ? data.TotalNewLimitFullAmt : 0
        let total_newltv = (_newlimit / _appraisal) * 100

        let prohibite_field = (data && data.Prohibite == 1) ? true : false
        let prohibite_name = (data && !_.isEmpty(data.Prohibite_CreateName)) ? data.Prohibite_CreateName : ''
        let prohibite_date = (data && !_.isEmpty(data.Prohibite_CreateDate)) ? moment(data.Prohibite_CreateDate).format('DD/MM/YYYY HH:mm') : false

        // NEW APPLICATION ZONE
        // PROFILE INFORMATION  
        let newapp_create_profile   = (data && !_.isEmpty(data.CreateDate)) ? moment(data.CreateDate).format('DD/MM/YYYY') : ''
        let newapp_application_no   = (data && !_.isEmpty(data.New_ApplicationNo)) ? data.New_ApplicationNo : ''
        let newapp_id_card          = (data && data.ID_Card) ? data.ID_Card : ''
        let newapp_ncb_consent      = (data && !_.isEmpty(data.NCBCheckDate)) ? moment(data.NCBCheckDate).format('DD/MM/YYYY') : ''
        let newapp_product_program  = (data && !_.isEmpty(data.ProductName)) ? data.ProductName : ''
        let newapp_rm_onhand        = (data && !_.isEmpty(data.RMProcess)) ? data.RMProcess : ''
        let newapp_rm_onhand_date   = (data && !_.isEmpty(data.RMProcessDate)) ? moment(data.RMProcessDate).format('DD/MM/YYYY') : null
        let newapp_plan_a2ca        = (data && !_.isEmpty(data.AppToCAPlanDate)) ? moment(data.AppToCAPlanDate).format('DD/MM/YYYY') : null

        let newapp_reconcile_status = (data && !_.isEmpty(data.LatestReconcile)) ? data.LatestReconcile : ''
        let newapp_reconcile_date   = (data && !_.isEmpty(data.LatestReconcileDate)) ? moment(data.LatestReconcileDate).format('DD/MM/YYYY') : null

        let newapp_ca_returndate    = (data && !_.isEmpty(data.CAReturnDateLog)) ? moment(data.CAReturnDateLog).format('DD/MM/YYYY') : null

        let newapp_app_to_cadate    = (data && !_.isEmpty(data.AppToCA)) ? moment(data.AppToCA).format('DD/MM/YYYY') : null
        let newapp_ca_name          = (data && !_.isEmpty(data.CAName)) ? data.CAName : ''
        let newapp_decision_status  = (data && !_.isEmpty(data.StatusDigit)) ? data.StatusDigit : ''
        let newapp_status_date      = (data && !_.isEmpty(data.StatusDate)) ? moment(data.StatusDate).format('DD/MM/YYYY') : null
        let newapp_status_reson     = (data && !_.isEmpty(data.StatusReason)) ? data.StatusReason : null
        let newapp_preloan_amt      = (data && data.PreLoan > 0) ? data.PreLoan : ''
        let newapp_approved_amt     = (data && data.ApprovedLoan > 0) ? data.ApprovedLoan : ''

        let newapp_plan_drawdown    = (data && !_.isEmpty(data.PlanDrawdownDate)) ? moment(data.PlanDrawdownDate).format('DD/MM/YYYY') : null
        let newapp_drawdown_date    = (data && !_.isEmpty(data.DrawdownDate)) ? moment(data.DrawdownDate).format('DD/MM/YYYY') : null
        let newapp_drawdown_amt     = (data && data.DrawdownBaht > 0) ? data.DrawdownBaht : ''

        let is_existapp   = (newapp_create_profile && !_.isEmpty(newapp_create_profile)) ? true : false

        const gridline_division = cls['division_part2']

        let master_action = null
        let response_code = getFieldValue('ResponseCode')
        if(!_.isEmpty(response_code)) {
            master_action = _.filter(master.action_list, { ResponseCode: response_code })
        } else {
            master_action = master.action_list
        }

        let master_reponse = _.reject(master.response_list, (v) => { return v.ResponseCode == 'NA' })

        return (
            <div>
                
                <LeadNewTopupCustProfile 
                    isOpen={createProfile.isOpen}           
                    data={data} 
                    handleClose={this.handleCustProfileClose}    
                /> 
                
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
                                        <div className={`${cls['division_item']} ${cls['division_gap5']}`} style={{ height: '130px' }}>
                                            <Card className={`${cls['division_container']} ${cls['pad0']} ${cls['bg_amber']} ${cls['fg_white']}`}>
                                                <div className={cls['division_row_part1']}>
                                                    <div className={`${cls['profile_brand']} ttu tc`}>Total Credit Limit</div>
                                                    <div>
                                                        <div className="ttu">{`${total_newlimit}Mb`}</div>
                                                        <div className="ttu">{`NEW LTV ${(total_newltv && total_newltv > 0.00) ? roundFixed(total_newltv, 0) : 0}%`}</div>
                                                    </div>
                                                </div>
                                            </Card>
                                            
                                        </div>
                                        <div className={`${cls['division_item']}`} style={{ height: '130px' }}>
                                            <Card className={`${cls['division_container']} ${cls['pad0']} ${cls['bg_darkMagenta']} ${cls['fg_white']}`}>
                                                <div className={cls['division_row_part1']}>
                                                    <div className={`${cls['profile_brand']} ttu tc`}>Estimate Increase</div>
                                                    <div>
                                                        <div className="ttu">{`${est_topup}Mb`}</div>
                                                        <div className="ttu">{`Current LTV ${c_ltv}%`}</div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                    <div className={`${cls['division_unset']} mt1`}>
                                        <Card className={`${cls['division_container']}`}  style={{ height: '80px' }}>
                                            <div><small className="ttu">Top up ratio</small></div>
                                            <div className={`${cls['division_part6']} `}>
                                                <div className={`f3 v-mid ttu tc ${cls['fg_white']}`} style={{ background: '#4682b4' }}>{`${factor}%`}</div>
                                                <div className="ttu tc b">
                                                    <Rate className={cls['bureau_rate']} value={bureau_rate} allowHalf disabled />
                                                </div>                                            
                                            </div>
                                        </Card>                                
                                    </div>
                                </div>
                            </div>

                            <div key={2} className={cls['profile_div']}>
                                <Card className={`${cls['division_container']}`}>
                                    <div className={`${cls['division_part']} ${cls['h150']}`}>              
                                        <div className={`${cls['division_item']}`}>
                                            <Row>
                                                <Col span={24} className={cls['division_rows']}>
                                                    <Col span={8} className={`${cls['text']} ttu b`}>Customer Name</Col>  
                                                    <Col span={16} className={`${cls['text']}`}>{custname}</Col>    
                                                </Col> 
                                                <Col span={24} className={cls['division_rows']}>
                                                    <Col span={8} className={`${cls['text']} ttu b`}>Address</Col>  
                                                    <Col span={16} className={`${cls['text']}`}>{cust_address}</Col>    
                                                </Col> 
                                                <Col span={24} className={cls['division_rows']}>
                                                    <Col span={8} className={`${cls['text']} ttu b`}>Phone</Col>  
                                                    <Col span={16} className={`${cls['text']}`}>{custphone}</Col>    
                                                </Col> 
                                                <Col span={24} className={cls['division_rows']}>
                                                    <Col span={8} className={`${cls['text']} ttu b`}>Office Tel</Col>  
                                                    <Col span={16} className={`${cls['text']}`}>{officetel}</Col>    
                                                </Col>
                                                <Col span={24} className={cls['division_rows']}>
                                                    <Col span={8} className={`${cls['text']} ttu b`}>Income</Col>  
                                                    <Col span={16} className={`${cls['text']}`}>{custIncome}</Col>    
                                                </Col>                                                
                                                <Col span={24}>
                                                    <Col span={8} className={`${cls['text']} ttu b`}>Business Desc</Col>  
                                                    <Col span={16} className={`${cls['text']}`}>{business}</Col>    
                                                </Col>                        
                                            </Row>
                                        </div>
                                    </div>                            
                                    <div className={`${cls['division_unset']}`}>
                                        <small className="ttu b">OS Balance</small>
                                        <Progress percent={os_percent} status="active" />
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
                                        defaultActiveKey={['2']}
                                        className={`${cls['profile_collapse']} ant-collapse-content-box`}
                                        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
                                    >
                                        <Panel header="Application Progress (New App)" key="1">
                                            <div className={`${cls['profile_grid']}`} style={{ padding: '0 0px' }}>
                                            <div className={`${cls['thead']} ${cls['color1']} ttu tc`}>Verification</div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>Created</div>
                                                    <div className={`${cls['grid_item']}`}>{newapp_create_profile}</div>
                                                </div>   
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>App No</div>
                                                    <div className={`${cls['grid_item']}`}>{newapp_application_no}</div>
                                                </div>   
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>ID Card</div>
                                                    <div className={`${cls['grid_item']}`}>{newapp_id_card}</div>
                                                </div>                                    
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>NCB Date</div>
                                                    <div className={`${cls['grid_item']}`}>{newapp_ncb_consent}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>Program</div>
                                                    <div className={`${cls['grid_item']} ${cls['grid_item_ellipsis']}`}>
                                                        <Popover content={newapp_product_program}>{newapp_product_program}</Popover>
                                                    </div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>RM Onhand</div>
                                                    <div className={`${cls['grid_item']}`}>{`${newapp_rm_onhand}`}</div>
                                                </div>  
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>RM UpDate</div>
                                                    <div className={`${cls['grid_item']}`}>{`${(newapp_rm_onhand_date && !_.isEmpty(newapp_rm_onhand_date)) ? `${newapp_rm_onhand_date}`: ''}`}</div>                                        
                                                </div>                                           
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>Plan A2CA</div>
                                                    <div className={`${cls['grid_item']}`}>{newapp_plan_a2ca}</div>
                                                </div>       
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>Reconcile</div>
                                                    <div className={`${cls['grid_item']}`}>{`${newapp_reconcile_status} ${(newapp_reconcile_date) ? `: ${newapp_reconcile_date}` : ''}`}</div>
                                                </div>                                          
                                                <div className={`${cls['thead']} ${cls['bg_teal']} ${cls['fg_white']} ttu tc`}>CA Decision</div> 
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>A2CA Date</div>
                                                    <div className={`${cls['grid_item']}`}>{newapp_app_to_cadate}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>CA Name</div>
                                                    <div className={`${cls['grid_item']}`}>{newapp_ca_name}</div>
                                                </div>  
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>Status</div>
                                                    <div className={`${cls['grid_item']}`}>
                                                        {`${newapp_decision_status} ${(newapp_status_date && !_.isEmpty(newapp_status_date) && newapp_decision_status !== 'CR') ? ` : ${newapp_status_date}` : '' } ${(newapp_decision_status == 'CR') ? ` : ${newapp_ca_returndate}` : ''}`}
                                                    </div>
                                                </div>  
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>Reason</div>
                                                    <div className={`${cls['grid_item']}`}>{newapp_status_reson}</div>
                                                </div>  
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>Approved Amt</div>
                                                    <div className={`${cls['grid_item']}`}>{`${(newapp_approved_amt && newapp_approved_amt > 0) ? numberWithCommas(newapp_approved_amt) : `${(newapp_preloan_amt && newapp_preloan_amt > 0) ? (numberWithCommas(newapp_preloan_amt)) : ''}`}`}</div>
                                                </div>    
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>Plan DD</div>
                                                    <div className={`${cls['grid_item']}`}>{newapp_plan_drawdown}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>DD Date</div>
                                                    <div className={`${cls['grid_item']}`}>{newapp_drawdown_date}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu`}>DD Amt</div>
                                                    <div className={`${cls['grid_item']}`}>{newapp_drawdown_amt}</div>
                                                </div>
                                            </div>
                                        </Panel>
                                        <Panel header="Existing Customer" key="2" disabled={false}>                                   
                                            <div className={`${cls['profile_grid']}`}>
                                                <div className={`${cls['header2']} ttu tc`}>Loan Information</div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>App No</div>
                                                    <div className={`${cls['grid_item']}`}>{appno}</div>
                                                </div>                                      
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Program</div>
                                                    <div className={`${cls['grid_item']} ${cls['grid_item_ellipsis']}`}>{`${program}`}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Drawdown</div>
                                                    <div className={`${cls['grid_item']}`}>{drawdown_date}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Credit Limit</div>
                                                    <div className={`${cls['grid_item']}`}>{ drawdown_amount }</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>OS / %Repay</div>
                                                    <div className={`${cls['grid_item']}`}>{` ${os_amount} / ${repay_per}% `}</div>
                                                </div>                                        
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Interest Rate</div>
                                                    <div className={`${cls['grid_item']}`}>{`${interest_rate}%`}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Installment</div>
                                                    <div className={`${cls['grid_item']}`}>{ (installment && !_.isEmpty(installment)) ? numberWithCommas(installment) : 0 }</div>
                                                </div>                                       
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>MoB / Tenor</div>
                                                    <div className={`${cls['grid_item']}`}>{`${monthOnBook} / ${tenor}`}</div>
                                                </div>
                                            
                                                <div className={`${cls['header3']} ttu tc`}>Collateral Information</div>  
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Appraisal No</div>
                                                    <div className={`${cls['grid_item']}`}>{(apprisal_id && !_.isEmpty(apprisal_id)) ? apprisal_id : ''}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Collateral</div>
                                                    <div className={`${cls['grid_item']}`}>{(guarantee && guarantee != 'NULL') ? guarantee : ''}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Title No</div>
                                                    <div className={`${cls['grid_item']}`}>{(appraisal_title) ? appraisal_title : ''}</div>
                                                </div>
                                                {/* <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Guarantee</div>
                                                    <div className={`${cls['grid_item']} ${cls['grid_item_ellipsis']}`}>{guarantee}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Mortgage</div>
                                                    <div className={`${cls['grid_item']}`}>{mortgage}</div>
                                                </div> */}         
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Current Date</div>
                                                    <div className={`${cls['grid_item']}`}>{(appraisal_date) ? appraisal_date : ''}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Current Value</div>
                                                    <div className={`${cls['grid_item']}`}>{appraisal}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Original LTV</div>
                                                    <div className={`${cls['grid_item']}`}>{`${o_ltv}%`}</div>
                                                </div>

                                                <div className={`${cls['header4']} ttu tc`}>Employee Information</div>  
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Ch / Team</div>
                                                    <div className={cls['grid_item']}>{`${channel} / ${team}`}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Original RM</div>
                                                    <div className={`${cls['grid_item']}`}>{(rm_orgin == rm_name) ? '' : rm_orgin}</div>
                                                </div>
                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}>Current RM</div>
                                                    <div className={cls['grid_item']}>{rm_name}</div>
                                                </div>

                                                <div className={`${gridline_division}`}>
                                                    <div className={`${cls['grid_item']} pl1 ttu b`}></div>
                                                    <div className={`${cls['grid_item']}`}></div>
                                                </div>

                                            </div>                               
                                        </Panel>
                                    </Collapse>
                                </Card>
                            </div>
                            <div key={2} className={`${cls['profile_div']}`}>
                                <Card className={`${cls['division_container']} ${cls['h_auto']} ${(time_left <= 0) ? cls['hide']:''}`}> 
                                    <Form onSubmit={this.handleActionNoteSubmit} className={`${cls['form_container']}`}>
                                        <div className={cls['division_part1']}>
                                            <div>
                                                <div className="ttu b">Customer Tracking</div>
                                            </div>
                                            <div>
                                                <Button type="primary" htmlType="submit" size="small" className={`${cls['m0']} ttu fr mt2`} style={(is_existapp) ? { display: 'none' } : {} }>Save</Button>
                                            </div>
                                        </div>                                    
                                        <Row gutter={10}>
                                            <Col span={12}>
                                                <FormItem label="Response" className={`${cls['form_item']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                    {
                                                        getFieldDecorator('ResponseCode', { initialValue: '' })
                                                        (
                                                            <Select disabled={(is_existapp) ? true : false}>
                                                                <Option value="">โปรดเลือก</Option>
                                                                {
                                                                    (master_reponse && master_reponse.length > 0) && _.map(master_reponse, (v) => {
                                                                        return (<Option key={v.ResponseCode} value={v.ResponseCode}>{`${v.ResponseLabel} (${v.ResponseCode})`}</Option>)
                                                                    })
                                                                }       
                                                            </Select>
                                                        )
                                                    }
                                                </FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label="Reason" className={`${cls['form_item']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                    {                                                    
                                                        getFieldDecorator('ActionID', { initialValue: '' })
                                                        (
                                                            <Select disabled={(is_existapp) ? true : false}>    
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
                                                <FormItem label="Action Note" className={`${cls['form_item']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                    {
                                                        getFieldDecorator('ActionNote', { initialValue: '' })
                                                        (<TextArea autosize={{ minRows: 1, maxRows: 1 }} disabled={(is_existapp) ? true : false} />)
                                                    }
                                                </FormItem>
                                            </Col>
                                            <Col span={24}>
                                                {
                                                    getFieldDecorator('Prohibite', { initialValue: false })
                                                    (
                                                        <Checkbox checked={this.state.prohibitedCheck || prohibite_field} disabled={prohibite_field || (is_existapp) ? true : false } className={`ttu`} style={{ paddingTop: '8px' }} onClick={this.handleAllowProhibite}>
                                                            {
                                                                (!prohibite_field) ? (<small className="red">ลูกค้าไม่อนุญาตให้ติดต่อเพื่อเสนอสินเชื่อทางโทรศัพท์ครั้งถัดไป (Prohibited)</small>):
                                                                (
                                                                    <Popover content={<div>{`${prohibite_date} ${prohibite_name}`}</div>}>
                                                                        <span className="red" style={{ fontSize: '80%' }}>ลูกค้าไม่อนุญาตให้ติดต่อเพื่อเสนอสินเชื่อทางโทรศัพท์ครั้งถัดไป (Prohibited)</span>
                                                                    </Popover>
                                                                )
                                                            }
                                                        </Checkbox>
                                                    )
                                                }
                                                
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card>
               
                                <div className={`${cls['timelime_container']}`}>
                                    <div className={cls['timeline_title']}>
                                        <small className="ttu b">Activity Timeline  ({`${(activity_timeline && activity_timeline.length > 0) ? activity_timeline.length : '0'} Items`})</small> 
                                        <Checkbox className={`fr ttu ${cls['hide']}`} checked={this.state.allActionNote} onChange={this.handleLoadActionNote}>
                                            <small>View Previous History (if any?)</small>
                                        </Checkbox>
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
                            <div key={3} className={cls['profile_div']}></div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }

    handleAllowProhibite = () => {
        const { form: { getFieldValue, setFieldsValue } } = this.props

        let PROHIBITE_HANDLE_TRIGGER = this.handleProhibiteTrigger
        let PROHIBITE_STATE = getFieldValue('Prohibite')        
        if(!PROHIBITE_STATE) {            
            confirm({
                title: 'กรุณายืนยันความถูกต้อง',
                content: 'กรณีข้อมูลถูกต้องโปรดคลิก OK เพื่อยืนยันหรือ Cancel เพื่อยกเลิก',
                onOk() {
                    setFieldsValue({ 'Prohibite': true })
                    PROHIBITE_HANDLE_TRIGGER(true)
                },
                onCancel() {    
                    setFieldsValue({ 'Prohibite': false })
                    PROHIBITE_HANDLE_TRIGGER(false)
                }
            }) 
        } else {
            setFieldsValue({ 'Prohibite': false })
            PROHIBITE_HANDLE_TRIGGER(false)
        }

    }
    
    handleProhibiteTrigger = (status) => {
        this.setState({ prohibitedCheck: status })
    }
    
    handleTitleHeader = () => {
        const { config, dataSource: { data } } = this.props

        let create_profile   = (data && !_.isEmpty(data.CreateDate)) ? moment(data.CreateDate).format('DD/MM/YYYY') : ''
        let is_existapp   = (create_profile && !_.isEmpty(create_profile)) ? true : false
        let create_enable  = (data && data.ResponseCode == 'Y' && is_existapp !== true) ? true : false

        return (
            <div className={`${cls['header']}`}>
                <div className={`${cls['items']} ttu`}>{config.grid.crm.lead_topup.modal.title}</div>
                <div className={`${cls['items']} ${cls['unset']}`}>
                    <ButtonGroup className="fr" size="small">
                        <Button type="primary" icon="plus" onClick={this.handleCustProfileOpen} disabled={!create_enable} className="ttu">Create</Button>
                    </ButtonGroup>
                </div>
            </div>
        )
        
    }

    // FORM HANDLE FOR SUBMIT TO DATABASE
    handleActionNoteSubmit = (e) => {
        e.preventDefault()

        const { authen, form: { validateFields }, dataSource: { data }, CREATE_ACTIONNOTE, CREATE_CUSTPROHIBITE } = this.props
        validateFields((err, fieldData) => {
            if(!err) {
                const auth = (authen && authen.Auth) ? authen.Auth : null
                const emp_code = (!_.isEmpty(auth)) ? auth.EmployeeCode : null
                const emp_name = (!_.isEmpty(auth)) ? (auth.EmpName_TH).replace('+', ' ') : null

                let requestData = {
                    LotID: (data && data.LotNo) ? data && data.LotNo : null,
                    CIFNO: (data && data.CIFNO) ? data.CIFNO : null,
                    CitizenID: (data && data.CitizenID) ? data && data.CitizenID : null,
                    ResponseCode: (fieldData.ResponseCode && !_.isEmpty(fieldData.ResponseCode)) ? fieldData.ResponseCode : null,
                    ActionID: (fieldData.ActionID && !_.isEmpty(fieldData.ActionID)) ? fieldData.ActionID : null,
                    ActionNote: (fieldData.ActionNote && !_.isEmpty(fieldData.ActionNote)) ? fieldData.ActionNote : null,
                    Appointment: null,
                    CreateID: emp_code,
                    CreateName: emp_name
                }

                let prohibiteData = {
                    CIFNo: (data && data.CIFNO) ? data.CIFNO : null,
                    AccNo: (data && data.AccountID) ? data.AccountID : null,
                    IDCard: (data && data.CitizenID) ? data && data.CitizenID : null,
                    ProhibiteStatus: (fieldData.Prohibite) ? 'Y' : null,
                    CreateID: emp_code,
                    CreateName: emp_name
                }

                let RESET_HANDLE = this.handleReset
                let AUTOLOADING_ACTIONNOTE_START_FLAG = this.handleAutoLoadActionNote

                confirm({
                    title: 'คุณต้องการบันทึกข้อมูลนี้หรือไม่?',
                    content: 'กรณีตรวจสอบข้อมูล กรณีข้อมูลถูกต้องโปรดคลิก Ok เพื่อยืนยันการสร้างข้อมูลหรือ Cancel เพื่อยกเลิก',
                    onOk() {

                        if(_.isEmpty(requestData.ResponseCode) && !prohibiteData.ProhibiteStatus) {
                            notification.error({
                                message: 'ข้อมูลไม่ถูกต้อง',
                                description: 'โปรดตรวจสอบข้อมูลใหม่อีกครั้ง',
                            })

                        } else {
                            if(prohibiteData && prohibiteData.ProhibiteStatus == 'Y') {
                                CREATE_CUSTPROHIBITE(prohibiteData)
                            } 
                                
                            if(!_.isEmpty(requestData.ResponseCode)) {                          
                                CREATE_ACTIONNOTE(requestData) 
                                AUTOLOADING_ACTIONNOTE_START_FLAG()                       
                                RESET_HANDLE()
            
                            }
                        }


                    },
                    onCancel() {}
                })   
                
            }
            
        })

    }

    handleReset = () => {
        this.props.form.resetFields()
        this.setState({ allActionNote: false })
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
        const { dataSource: { data }, LOAD_ACTIONNOTE } = this.props
        LOAD_ACTIONNOTE({ 
            LotID: (!e.target.checked) ? data.LotNo : null,
            CIFNO: data.CIFNO 
        })
        this.setState({ allActionNote: e.target.checked })
    }

     // FLAG OF ACTION FOR CHECK START AND END CREATE ACTION NOTE
     handleAutoLoadActionNote = () => {
        this.setState({ createTimeline: true })
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

const LeadNewTopupModalWrapper = Form.create()(LeadNewTopupModal)
export default connect(
    (state) => ({
        activity_create: state.PCISCRM_LEADTOPUP_CREATE_ACTIONNOTE,
        activity_timeline: state.PCISCRM_LEADTOPUP_LOAD_ACTIONNOTE
    }), 
    {
        LOAD_ACTIONNOTE: loadActionNote,
        CREATE_ACTIONNOTE: createActionNote,
        CREATE_CUSTPROHIBITE: createCustProhibitLog
    }
)(LeadNewTopupModalWrapper)