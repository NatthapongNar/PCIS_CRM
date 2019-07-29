import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Row, Col, Modal, Collapse, Table, Form, Select, TreeSelect, Input, Checkbox, Button, Progress, Card, Rate, Timeline, Avatar, Icon, Popover, Tag, notification } from 'antd'
import Scrollbar from 'react-smooth-scrollbar'
import bluebird from 'bluebird'
import moment from 'moment'
import _ from 'lodash'

import { 
    loadActionNote, 
    createActionNote, 
    getLeadTopUpHeader,
    getLeadTopupSummary,
    getMasterRegionFilter,
    getMasterAreaFilter,
    getMasterTeamFilter,
    getMasterEmployeeFilter 

} from '../../../actions/pcis'

import { in_array, roundFixed, numberWithCommas, largeNumberToShort } from '../../../containers/PCIS/config/funcitonal'
import cls from '../styles/pcis_style.scss'
import table_cls from '../styles/table.scss'
import styles from '../styles/timeline.scss'

const Panel = Collapse.Panel
const Option = Select.Option
const TextArea = Input.TextArea
const ButtonGroup = Button.Group
const FormItem = Form.Item
const confirm = Modal.confirm
const TimelineItem = Timeline.Item

const gutter_init = 10
const field_colon_label = false
const tree_config = {
    size: 'large',
    treeCheckable: true,
    showCheckedStrategy: TreeSelect.SHOW_PARENT,
    dropdownMatchSelectWidth: false,
    style: { width: '100%' }
}

class LeadToupUp extends Component {

    state = {
        modal: {
            profile: false
        },
        refreshActive: false,
        activeFilter: '0',
        profileData: {},
        createActivity: false,
        pagination: {
            size: 'small',
            pageSize: 20,
            showQuickJumper: true,
            pageInfo: null,
            showTotal: (total, range) => {
                const { pagination } = this.state
                let el_target = document.querySelector('.number_length')
                if (el_target) {
                    pagination.pageInfo = `Showing ${range[0]} to ${range[1]} of ${total} entries`
                    if (el_target.innerHTML.length > 0) {
                        el_target.innerHTML = el_target.innerHTML.replace(el_target.innerHTML, pagination.pageInfo)
                    } else {
                        el_target.innerHTML = pagination.pageInfo
                    }
                    return pagination.pageInfo
                }
            }
        }
    }

    componentWillMount() {
        const { authen, GET_LOADTOPUP_HEADER, GET_LEADTOPUP_SUMMARY, GET_MASTER_REGION, GET_MASTER_AREA, GET_MASTER_TEAM, GET_MASTER_EMPS } = this.props

        let auth_lotno = { AuthCode: (authen && !_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null, LotID: this.props.match.params.lotid }
        let auth_data = { AuthCode: (authen && !_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null }

        const API_DEFAULT_CALL = [
            GET_LOADTOPUP_HEADER,
            GET_LEADTOPUP_SUMMARY,
            GET_MASTER_REGION,
            GET_MASTER_AREA,
            GET_MASTER_TEAM,
            GET_MASTER_EMPS
        ]

        bluebird.all(API_DEFAULT_CALL).each((fn, i) => {
            if(in_array(i, [0, 1])) {
                fn(auth_lotno)
            } else {
                fn(auth_data)
            }            
        })
    
    }

    componentWillReceiveProps(props) {
        if(props) {
            const { data, authen, config } = props

            if(!_.isEmpty(data.leadTopUp.Data)) { 
                _.map(data.leadTopUp.Data, (v) => {
                    v.CustProfile = (v.RegionID) ?
                    (<i className={`fa fa-television pointer ${cls['icon_click']}`} aria-hidden="true" onClick={this.handleCustProfile.bind(this, v)}></i>):
                    (<i className={`fa fa-close pointer red ${cls['icon_click']}`} aria-hidden="true" onClick={(in_array(authen.Auth.EmployeeCode, config.adminSys)) ? this.handleCustProfile.bind(this, v) : null}></i>)
                })
            }
        
            if(this.state.createActivity) {
                const { authen, LOAD_ACTIONNOTE, fn: { getLeadTopUp }, GET_LEADTOPUP_SUMMARY } = props
                if(!_.isEmpty(props.activity_create)) {
                    let CIFNO = (props.activity_create && !_.isEmpty(props.activity_create[0])) ? props.activity_create[0].CIFNO : null
                    let parms = { AuthCode: (authen && !_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null, LotID: this.props.match.params.lotid }

                    bluebird.all([
                        LOAD_ACTIONNOTE,
                        getLeadTopUp,
                        GET_LEADTOPUP_SUMMARY
                    ]).each((fn, i) => {
                        if(i == 0) {
                            fn({ 
                                LotID: this.props.match.params.lotid,
                                CIFNO: CIFNO 
                            })
                        } else {
                            fn(parms)
                        }
                    })
            
                    this.setState({ createActivity: false })
                }
            }

        }
    }

    componentDidMount() {
        document.title = 'TOP-UP LIST'
    }

    // SET ROWS KEY IDENTITY OF GRID TABLE
    handleRowKey = (data) => { return data.RunNo }
    handleRowKeySummary = (data) => { return data.Seq }

    // FUNCTION PROFILE MODAL HANDLE
    handleCustProfile = (data) => {
        this.setState({ 
            modal: _.assign({}, this.state.modal, { profile: !this.state.modal.profile }),
            profileData: data
        })
    }

    // FLAG OF ACTION FOR CHECK START AND END CREATE ACTION NOTE
    handleActionNoteEnable = () => {
        this.setState({ createActivity: true })
    }

    handleRefreshEnable = () => {
        this.setState({ refreshActive: true })
    }

    handleRefreshDisable = () => {
        this.setState({ refreshActive: false })
    }

    // MAIN RENDERER HANDLE
    render() {
        const { modal, profileData, pagination } = this.state
        const { appConfig, config, columns, authen, master, lead_period, data, activity_timeline, lead_topup_summary, LOAD_ACTIONNOTE, CREATE_ACTIONNOTE } = this.props

        const start_period = (lead_period && !_.isEmpty(lead_period[0])) ? lead_period[0].DateImport : null
        const expire_period = (lead_period && !_.isEmpty(lead_period[0])) ? lead_period[0].EndPeriod : null

        return (
            <div className={`${cls['grid_container']}`}>

                <div className={`${cls['grid_header']}`}>
                    <div className={`${cls['grid_title']}`}>
                        <p>
                            <Link to={`${appConfig.rootPath}/lottopup`} className="fl">
                                <span className={cls['swapContainer']}>
                                    <span className={cls['swapRollback']}>
                                        <Icon type="swap" theme="outlined" className={cls['icon']} />                                   
                                    </span>
                                    <span className={cls['title']}>Back to Lot Management</span>
                                </span>
                            </Link>
                            {config.grid.crm.lead_topup.header.title}
                        </p>
                        <p>{`${config.grid.crm.lead_topup.header.subtitle} : ${(start_period) ? moment(start_period).format('DD/MM/YYYY') : '00/00/00'} - ${(expire_period) ? moment(expire_period).format('DD/MM/YYYY') : '00/00/00'}`}</p>
                        {this.handleHeadFilter()}
                    </div>
                </div>

                <Table 
                    rowKey={this.handleRowKey}
                    className={`${cls['grid_dashboard']} ${table_cls['table_wrapper']}`}
                    columns={columns.crm_lead_topup_list} 
                    dataSource={data.leadTopUp.Data} 
                    loading={!data.leadTopUp.Status}
                    footer={this.handleFooter}
                    bordered={config.grid.border}
                    pagination={{ ...pagination }}
                    size={config.grid.size}
                />

                <CustProfile
                    config={config}
                    isOpen={modal.profile}
                    authen={authen}
                    master={master}
                    form={this.props.form}
                    lotID={this.props.match.params.lotid}
                    dataSource={profileData}
                    expirePeriod={lead_period}
                    activityTimeline={activity_timeline}
                    leadTopupSummary={lead_topup_summary}
                    handleCreateActionNote={this.handleActionNoteEnable}
                    loadActionNote={LOAD_ACTIONNOTE}
                    createActionActivity={CREATE_ACTIONNOTE}
                    handleCloseProfile={this.handleCustProfile}
                />

            </div>
        )
    }

    /***************************     SET FOOTER     ***************************/
    handleFooter = (currentPageData) => {
        const { data } = this.props

        const parentTable = document.querySelector(`.${cls['grid_dashboard']}`)
        const default_class = ['ttu tl fw6', 'tl', 'tr', 'tr', 'tr', 'tr', 'tc', 'tc', 'tr', 'tr', 'tr', 'tc', 'tc', 'tr', 'tc', 'tl', 'tl', 'tc', 'tc', 'tc', 'tl']
        
        const lead_topup = (data.leadTopUp.Data && data.leadTopUp.Data.length > 0) ? data.leadTopUp.Data : []
        
        if(parentTable) {

            let el_header1 = parentTable.querySelectorAll(`tr:first-child th`)
            let dom_draft = [el_header1[0], el_header1[1], el_header1[2]]

            _.forEach(parentTable.querySelectorAll(`tr:nth-child(2) th`), (el) => { dom_draft.push(el) })

            let rtd_element = dom_draft //parentTable.querySelectorAll(`tr:first-child td`)
            let rtd_count = dom_draft.length //parentTable.querySelectorAll('tr:first-child td').length
      
            if(rtd_count > 0) {

                let rtd_size = []
                _.forEach(rtd_element, (v, i) => { rtd_size.push($(v).outerWidth()) })

                // CURRENT PAGE
                let footer_summary = { 
                    cur: {
                        0: 'Total',
                        3: numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'TopUpFullAmt'), 0), 10)),
                        6: numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'DrawdownFullAmt'), 0), 5)),
                        7: numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'OSBalFullAmt'), 0), 5)),
                        9: numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'ApprisalValueFullAmt'), 0), 5))
                    },
                    all: {
                        0: 'Grand Total',
                        3: numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(lead_topup, 'TopUpFullAmt'), 0), 10)),
                        6: numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(lead_topup, 'DrawdownFullAmt'), 0), 5)),
                        7: numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(lead_topup, 'OSBalFullAmt'), 0), 5)),
                        9: numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(lead_topup, 'ApprisalValueFullAmt'), 0), 5))
                    }                  
                }

                return (
                    <div className={`${cls['grid_footer']}`}>
                        <div className={cls['footer_partition']}>
                            { 
                                _.map(rtd_size, (size, i) => {
                                    return (
                                        <div key={(i+1)} className={`${cls['item_footer']} mktft_${(i+1)} ${default_class[i]}`} style={{ width: size }}>{(footer_summary.cur[i]) ? footer_summary.cur[i] : ''}</div>
                                    )
                                })
                            }  
                        </div>  
                        <div className={cls['footer_partition']}>    
                            { 
                                _.map(rtd_size, (size, i) => {
                                    return (
                                        <div key={(i+1)} className={`${cls['item_footer']} mktft_${(i+1)} ${default_class[i]} ${(i==0) && cls['strnorap']} ${(i == 1) && cls['bRZ']}`} style={{ width: size }}>{(footer_summary.all[i]) ? footer_summary.all[i]:''}</div>
                                    )
                                })
                            }  
                        </div>                 
                    </div>
                )

            } else {
                return (<div className={`${cls['grid_footer']}`}></div>)
            }

        } else {
            return (<div className={`${cls['grid_footer']}`}></div>)
        }
     
    }

    /***************************     SET HEADER     ***************************/
    handleHeadFilter = () => {
        const { config, form, columns, filters, lead_period, lead_topup_summary } = this.props
        const { getFieldDecorator } = form

        const time_left = (lead_period && !_.isEmpty(lead_period[0])) ? lead_period[0].TimeLeft : null

        const lead_summary_content = (
            <div className={cls['pcis_container']} style={{ width: '250px' }}>
                <h4 className="ttu">Loan Top-Up Summary</h4>
                <div className={`${cls['grid_container']}`}>
                    <Table 
                        rowKey={this.handleRowKeySummary}
                        className={cls['grid_general']}
                        columns={columns.crm_lotsummary} 
                        dataSource={(lead_topup_summary && lead_topup_summary.length > 0) ? lead_topup_summary : []} 
                        loading={(lead_topup_summary && lead_topup_summary.length > 0) ? false : true}
                        bordered={!config.grid.border}
                        pagination={false}
                        size={config.grid.size}
                    />
                </div>
            </div>
        )

        return (
            <div className={cls['grid_navigator']}>
                <div className={cls['item_header']} data-attr="search-pagesize">
                    <div className={`${cls['page_container']} tl`}>
                        <label>
                            {config.grid.default.pagelabel_length}
                            <Select className={cls['page_sizenumber']} defaultValue={`${this.state.pagination.pageSize}`} size="small" onChange={this.handlePageChange}>
                                {
                                    _.map(config.grid.pageSizeHandle, (v, i) => {
                                        return (<Option key={(i + 1)} value={`${v}`}>{`${v}`}</Option>)
                                    })
                                }
                            </Select>
                            {config.grid.default.pagelabel_entries}
                        </label>
                        <div className="number_length"></div>
                    </div>
                </div>
                <div className={`${cls['item_header']}`} data-attr="search-filter">
             
                    <div className={cls['notice_dayleft']}>
                        <Popover placement="bottomRight" content={lead_summary_content}>
                            <Tag color="red" style={{ fontSize: '1em' }}><Icon type="clock-circle-o" /> {`${time_left} Days left`}</Tag>
                        </Popover>
                    </div>

                    <div className={cls['tools']}>
                        <Icon type="sync" theme="outlined" onClick={this.handleSearchForm} onMouseOver={this.handleRefreshEnable} onMouseLeave={this.handleRefreshDisable} spin={this.state.refreshActive} />
                    </div>
                                
                    <div className={`${cls['panel_container']} ${cls['open']} ${cls['collapse_container']}`}>
                        <Collapse defaultActiveKey={this.state.activeFilter} activeKey={this.state.activeFilter} className={`${cls['collapse_filter']}`} onChange={this.handleCollapseFilter}>
                            <Panel key="1" header={config.grid.default.panel_title}>
                                <Form onSubmit={this.handleSearchForm} className={`${cls['form_container']} ${cls['open']}`}>
                                    <Row gutter={gutter_init}>
                                        <Col span={14} className={`fl tl`}></Col>
                                        <Col span={10}></Col>
                                    </Row>
                                    <Row gutter={gutter_init} className={`tl`}>
                                        <Col span={6}>
                                            <FormItem label="Region" className={`${cls['form_item']} ${cls['ctrlTree']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                {
                                                    getFieldDecorator('Filter_Region', { initialValue: [] })
                                                    (
                                                        <TreeSelect
                                                            {...tree_config}
                                                            treeData={filters.region}
                                                            treeDefaultExpandAll={true}
                                                            size="default"
                                                            className={`${cls['padding_none']}`}
                                                            disabled={false}
                                                            onChange={this.handleFilterRegion}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={6}>
                                            <FormItem label="Area" className={`${cls['form_item']} ${cls['ctrlTree']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                {
                                                    getFieldDecorator('Filter_Area', { initialValue: [] })
                                                    (
                                                        <TreeSelect
                                                            {...tree_config}
                                                            treeData={filters.area}
                                                            size="default"
                                                            className={`${cls['padding_none']}`}
                                                            disabled={false}
                                                            onChange={this.handleFilterArea}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={6}>
                                            <FormItem label="Team" className={`${cls['form_item']} ${cls['ctrlTree']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                {
                                                    getFieldDecorator('Filter_Team', { initialValue: [] })
                                                    (
                                                        <TreeSelect
                                                            {...tree_config}
                                                            treeData={filters.team}
                                                            dropdownStyle={{ height: '400px' }}
                                                            size="default"                                                        
                                                            className={`${cls['padding_none']}`}
                                                            disabled={false}
                                                            onChange={this.handleFilterTeam}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={6}>
                                            <FormItem label="Employee" className={`${cls['form_item']} ${cls['ctrlTree']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                {
                                                    getFieldDecorator('Filter_Employee', { initialValue: [] })
                                                    (
                                                        <TreeSelect
                                                            {...tree_config}
                                                            treeData={filters.emps}
                                                            treeDefaultExpandedKeys={[`all`]}
                                                            dropdownMatchSelectWidth={true}
                                                            dropdownStyle={{ height: '400px' }}
                                                            size="default"
                                                            className={`${cls['padding_none']}`}
                                                            disabled={false}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                    <Row gutter={gutter_init} className={`tl`}>
                                        <Col span={6}>
                                            <FormItem label="Customer Name" className={`${cls['form_item']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                {
                                                    getFieldDecorator('Filter_CustomerName', {})(<Input  />)
                                                }
                                            </FormItem>                               
                                        </Col>
                                        <Col span={6}>
                                            <FormItem label="Response" className={`${cls['form_item']} ${cls['fix_height']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                {
                                                    getFieldDecorator('Filter_Response', {})
                                                    (
                                                        <TreeSelect
                                                            {...tree_config}
                                                            treeData={this.handleResponseFilter()}
                                                            treeDefaultExpandedKeys={[`Action`]}
                                                            dropdownMatchSelectWidth={true}
                                                            dropdownStyle={{ height: '400px' }}
                                                            size="default"
                                                            className={`${cls['padding_none']}`}
                                                            disabled={false}
                                                        />
                                                    )
                                                }
                                            </FormItem>    
                                        </Col>
                                        <Col span={6}></Col>
                                        <Col span={6}></Col>
                                    </Row>
                                    <Row gutter={gutter_init}>
                                        <Col span={6}></Col>
                                        <Col span={6}></Col>
                                        <Col span={12}>        
                                            <FormItem className={`fr`}>
                                                <ButtonGroup>
                                                    <Button type="dashed" className={`ttu`} onClick={this.handleReset}>Clear</Button>
                                                    <Button type="primary" className={`ttu`} htmlType="submit" style={{ backgroundColor: '#0e77ca' }}>
                                                        <Icon type="search" />Submit
                                                    </Button>
                                                </ButtonGroup>
                                            </FormItem>                          
                                        </Col>
                                    </Row>
                                </Form>
                            </Panel>
                        </Collapse>
                    </div>

                </div>

            </div>
        )
    }

    // SET ROWS LENGTH OF GRID TABLE HANDLE
    handlePageChange = (size) => {
        this.setState({ pagination: _.assignIn({}, this.state.pagination, { pageSize: parseInt(size) }) })
    }

    // SEARCH FILTER HANDLER
    handleSearchForm = (e) => {
        e.preventDefault()

        const { authen: { Session }, form: { validateFields }, fn, GET_LEADTOPUP_SUMMARY } = this.props

        validateFields((err, fieldData) => {
            if(!err) {
                let setParam = {
                    AuthCode: (Session && !_.isEmpty(Session.sess_empcode)) ? Session.sess_empcode : null,
                    LotID: this.props.match.params.lotid,
                    RegionID: (fieldData.Filter_Region && fieldData.Filter_Region.length > 0) ? fieldData.Filter_Region.join(',') : null,
                    AreaCode: (fieldData.Filter_Area && fieldData.Filter_Area.length > 0) ? fieldData.Filter_Area.join(',') : null,
                    TeamCode: (fieldData.Filter_Team && fieldData.Filter_Team.length > 0) ? fieldData.Filter_Team.join(',') : null,
                    EmpCode: (fieldData.Filter_Employee && fieldData.Filter_Employee.length > 0) ? fieldData.Filter_Employee.join(',') : null,
                    CustomerName: (fieldData.Filter_CustomerName && !_.isEmpty(fieldData.Filter_CustomerName)) ? fieldData.Filter_CustomerName : null,
                    ResponseAction: (fieldData.Filter_Response && !_.isEmpty(fieldData.Filter_Response)) ? fieldData.Filter_Response.join(',') : null
                }
                
                fn.getLeadTopUp(setParam)
                GET_LEADTOPUP_SUMMARY(setParam)
                this.setState({ activeFilter: '0' })

            }
            
        })

    }

    // CLEAR FILTER HANDLER
    handleReset = () => {
        const { authen, GET_MASTER_REGION, GET_MASTER_AREA, GET_MASTER_TEAM, GET_MASTER_EMPS } = this.props
        
        let auth_data = { AuthCode: (authen && !_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null }
        let API_CALL = [
            GET_MASTER_REGION,
            GET_MASTER_AREA,
            GET_MASTER_TEAM,
            GET_MASTER_EMPS
        ]

        bluebird.all(API_CALL).each(f => f(auth_data))
        this.props.form.resetFields()
    }
    
    handleCollapseFilter = () => {        
        this.setState({ activeFilter: (this.state.activeFilter == 1) ? '0' : '1' })
    }

    handleFilterRegion = (region) => {
        const { authen, GET_MASTER_AREA, GET_MASTER_TEAM, GET_MASTER_EMPS  } = this.props

        if(region && region.length > 0) {
            let params = {
                AuthCode: (authen && !_.isEmpty(authen.Session)) ? authen.Session.sess_empcode : null,
                RegionID: (region && region.length > 0) ? region.join(',') : null
            }

            let API_CALL = [GET_MASTER_AREA, GET_MASTER_TEAM, GET_MASTER_EMPS]
            bluebird.all(API_CALL).each(call => call(params))
        }
    }

    handleFilterArea = (area) => {
        const { authen, form, GET_MASTER_TEAM, GET_MASTER_EMPS  } = this.props

        if(area && area.length > 0) {
            let region = form.getFieldValue('Filter_Region')
            let params = {
                AuthCode: (authen && !_.isEmpty(authen.Session)) ? authen.Session.sess_empcode : null,
                RegionID: (region && region.length > 0) ? region.join(',') : null,
                AreaCode: (area && area.length > 0) ? area.join(',') : null
            }

            let API_CALL = [GET_MASTER_TEAM, GET_MASTER_EMPS]
            bluebird.all(API_CALL).each(call => call(params))
        }
    }

    handleFilterTeam = (team) => {
        const { authen, form, GET_MASTER_EMPS  } = this.props

        if(team && team.length > 0) {
            let region = form.getFieldValue('Filter_Region')
            let area = form.getFieldValue('Filter_Area')
            GET_MASTER_EMPS({
                AuthCode: (authen && !_.isEmpty(authen.Session)) ? authen.Session.sess_empcode : null,
                RegionID: (region && region.length > 0) ? region.join(',') : null,
                AreaCode: (area && area.length > 0) ? area.join(',') : null,
                TeamCode: (team && team.length > 0) ? team.join(',') : null
            })
        }
    }

    handleResponseFilter = () => {
        const { master, form } = this.props

        let master_list = master.response_list.map(item => item.ResponseCode)
        let data_set = (!_.isEmpty(form.getFieldValue('Filter_Response'))) ? form.getFieldValue('Filter_Response') : []

        let result_action = _.map(data_set, (v) => { if(in_array(v, master_list)) return true })

        let category = ['Action', 'No action']
        let response_items = _.map(category, (data, i) => {     
            if(i == 0) {
                return {                                   
                    key: `${data}`,
                    label: `${data}`,
                    value: master.response_list.map(item => item.ResponseCode).join(','),
                    className: `ttu`,
                    children: _.orderBy(master.response_list, ['ResponseID'], ['asc']).map((item) => {
                        return {
                            key: `${item.ResponseCode}`,
                            label: `${item.ResponseLabel}`,
                            value: `${item.ResponseCode}`,                                           
                            className: `ttu`,
                            disabled: in_array('No action', data_set)
                        }
                    }),
                    disabled: in_array('No action', data_set)
                }
            } else {
                return {                                   
                    key: `${data}`,
                    label: `${data}`,
                    value: `${data}`,
                    className: `ttu`,
                    disabled: (result_action[0]) ? true : false
                }
            }
  
        }) 
        return response_items
    }

}

class CustProfile extends Component {

    state = {
        data: [],
        allActionNote: false,
        lotSummary: []
    }

    componentWillReceiveProps(props) {
        if(props) {
            if(props.dataSource && !_.isEmpty(props.dataSource)) {
                if(_.isEmpty(this.state.data)) {
                    const dataSource = (!_.isEmpty(props.dataSource)) ? props.dataSource : null
                    const { loadActionNote } = props
                    if(dataSource.CIFNO) {
                        loadActionNote({ 
                            LotID: (!this.state.allActionNote) ? props.lotID : null,
                            CIFNO: dataSource.CIFNO 
                        })
                        this.setState({ data: dataSource })
                    }      
                }               
            }         

        }
    }

    // FORM HANDLE FOR SUBMIT TO DATABASE
    handleSearchSubmit = (e) => {
        e.preventDefault()

        const { authen, form: { validateFields }, dataSource, createActionActivity, handleCreateActionNote } = this.props
        validateFields((err, fieldData) => {
            if(!err) {
                const auth = (authen && authen.Auth) ? authen.Auth : null
                const emp_code = (!_.isEmpty(auth)) ? auth.EmployeeCode : null
                const emp_name = (!_.isEmpty(auth)) ? (auth.EmpName_TH).replace('+', ' ') : null

                let requestData = {
                    LotID: (this.props.lotID) ? this.props.lotID : null,
                    CIFNO: (dataSource.CIFNO) ? dataSource.CIFNO : null,
                    CitizenID: (dataSource.CitizenID) ? dataSource.CitizenID : null,
                    ResponseCode: (fieldData.ResponseCode && !_.isEmpty(fieldData.ResponseCode)) ? fieldData.ResponseCode : null,
                    ActionID: (fieldData.ActionID && !_.isEmpty(fieldData.ActionID)) ? fieldData.ActionID : null,                   
                    ActionNote: (fieldData.ActionNote && !_.isEmpty(fieldData.ActionNote)) ? fieldData.ActionNote : null,
                    Appointment: null,
                    CreateID: emp_code,
                    CreateName: emp_name
                }

                let handleReset = this.handleReset
                confirm({
                    title: 'คุณต้องการบันทึกข้อมูลนี้หรือไม่?',
                    content: 'กรณีตรวจสอบข้อมูล กรณีข้อมูลถูกต้องโปรดคลิก Ok เพื่อยืนยันการสร้างข้อมูลหรือ Cancel เพื่อยกเลิก',
                    onOk() {

                        if(!_.isEmpty(requestData.ResponseCode)) {
                            handleCreateActionNote()
                            createActionActivity(requestData)
                            handleReset()
        
                        } else {
                            notification.error({
                                message: 'ข้อมูลไม่ถูกต้อง',
                                description: 'โปรดตรวจสอบข้อมูลใหม่อีกครั้ง',
                            })
                        }
                    },
                    onCancel() {
                      console.log('Cancel');
                    },
                })          

            }
            
        })

    }

    handleReset = () => {
        this.props.form.resetFields()
        this.setState({ allActionNote: false })
    }

    // MODAL CLOSE HANDLER
    handleClose = () => {
        const { handleCloseProfile } = this.props
        
        this.setState({ data: [], lotSummary: [], allActionNote: false })
        handleCloseProfile()
    }
    
    render() {
        const { config, isOpen, form, master, expirePeriod, dataSource, activityTimeline } = this.props
        const { getFieldDecorator, getFieldValue } = form

        const data = (!_.isEmpty(dataSource)) ? dataSource : null

        const time_left = (expirePeriod && !_.isEmpty(expirePeriod[0])) ? expirePeriod[0].TimeLeft : null

        // CHARACTER INFO
        let custname  = (data && !_.isEmpty(data.AC_Name)) ? data.AC_Name : ''
        let custphone = (data && !_.isEmpty(data.Tel)) ? handleTelephone(data.Tel) : '-'
        let officetel = (data && !_.isEmpty(data.OfficeTel)) ? handleTelephone(data.OfficeTel) : '-'
        let business  = (data && !_.isEmpty(data.BusinessType)) ? data.BusinessType : ''

        let os_percent = (data && data.OSBalPercent != 0.00) ? roundFixed(data.OSBalPercent, 0) : 0
        let est_topup = (data && data.TopUpAmt > 0.00) ? data.TopUpAmt : ''
        let factor = (data && data.FactorPercent > 0.00) ? data.FactorPercent : '0'
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
        let drawdown_date = (data && !_.isEmpty(data.DrawdownDate)) ? moment(data.DrawdownDate).format('DD/MM/YYYY') : ''
        let drawdown_amount = (data && data.DrawdownFullAmt > 0) ? numberWithCommas(data.DrawdownFullAmt) : ''
        let os_amount = (data && data.OSBalFullAmt > 0.00) ? numberWithCommas(data.OSBalFullAmt) : 0
        let repay_per = (data && data.RepayPercent > 0.00) ? roundFixed(data.RepayPercent, 0) : 0
        let interest_rate = (data && data.InterestRate > 0.00) ? data.InterestRate : 0
        let installment = (data && data.Payment > 0.00) ? numberWithCommas(data.Payment) : 0
        let monthOnBook = (data && data.MoB > 0) ? data.MoB : 0
        let tenor = (data && data.Tenor > 0) ? data.Tenor : 0
        
        // COLLATERAL INFORMATION
        let guarantee = (data && !_.isEmpty(data.Collateral)) ? data.Collateral : ''
        let mortgage = (data && data.Mortgage > 0) ? numberWithCommas(data.Mortgage) : '-'
        let appraisal = (data && data.ApprisalValueFullAmt > 0) ? numberWithCommas(data.ApprisalValueFullAmt) : '-'

        let o_ltv = (data && data.O_LTV > 0.00) ? roundFixed(data.O_LTV, 0) : 0
        let c_ltv = (data && data.C_LTV > 0.00) ? roundFixed(data.C_LTV, 0) : 0

        let total_newlimit = (data && data.TotalNewLimit > 0.00) ? roundFixed(data.TotalNewLimit, 2) : 0

        let _appraisal = (data && data.ApprisalValueFullAmt > 0) ? data.ApprisalValueFullAmt : 0
        let _newlimit  = (data && data.TotalNewLimitFullAmt > 0.00) ? data.TotalNewLimitFullAmt : 0
        let total_newltv = (_newlimit / _appraisal) * 100

        const gridline_division = cls['division_part2']

        let master_action = null
        let response_code = getFieldValue('ResponseCode')
        if(!_.isEmpty(response_code)) {
            master_action = _.filter(master.action_list, { ResponseCode: response_code })
        } else {
            master_action = master.action_list
        }

        return (
            <Modal
                wrapClassName={`${cls['modal_wrapper']} ${cls['modal_profile']}`}
                visible={isOpen}
                title={<span className="ttu">{config.grid.crm.lead_topup.modal.title}</span>}
                maskClosable={false}
                onOk={null}
                onCancel={this.handleClose}
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
                            <Card className={`${cls['profile_general']} ${cls['division_container']}`}>
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
                                        <div className={`${cls['grid_item']} pl1 ttu b`}>Guarantee</div>
                                        <div className={`${cls['grid_item']} ${cls['grid_item_ellipsis']}`}>{guarantee}</div>
                                    </div>
                                    <div className={`${gridline_division}`}>
                                        <div className={`${cls['grid_item']} pl1 ttu b`}>Mortgage</div>
                                        <div className={`${cls['grid_item']}`}>{mortgage}</div>
                                    </div>
                                    <div className={`${gridline_division}`}>
                                        <div className={`${cls['grid_item']} pl1 ttu b`}>Appraisal</div>
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
                            </Card>
                        </div>
                        <div key={2} className={`${cls['profile_div']}`}>
                            <Card className={`${cls['division_container']} ${cls['h_auto']} ${(time_left <= 0) ? cls['hide']:''}`}>
                                <Form onSubmit={this.handleSearchSubmit} className={`${cls['form_container']}`}>
                                    <div className={cls['division_part1']}>
                                        <div>
                                            <div className="ttu b">Customer Tracking</div>
                                        </div>
                                        <div>
                                            <Button type="primary" htmlType="submit" size="small" className={`${cls['m0']} ttu fr mt2`}>Save</Button>
                                        </div>
                                    </div>                                    
                                    <Row gutter={10}>
                                        <Col span={12}>
                                            <FormItem label="Response" className={`${cls['form_item']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                {
                                                    getFieldDecorator('ResponseCode', { initialValue: '' })
                                                    (
                                                        <Select>
                                                            <Option value="">โปรดเลือก</Option>
                                                            {
                                                                (master.response_list && master.response_list.length > 0) && _.map(master.response_list, (v, i) => {
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
                                                        <Select>    
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
                                                    (<TextArea autosize={{ minRows: 1, maxRows: 1 }} />)
                                                }
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card>

                            <div className={`${cls['timelime_container']}`}>
                                <div className={cls['timeline_title']}>
                                    <small className="ttu b">Activity Timeline  ({`${(activityTimeline && activityTimeline.length > 0) ? activityTimeline.length : '0'} Items`})</small> 
                                    <Checkbox className="fr ttu" checked={this.state.allActionNote} onChange={this.handleLoadActionNote}>
                                        <small>View Previous History (if any?)</small>
                                    </Checkbox>
                                </div>
                                <Scrollbar>
                                    <div className={cls['timeline_content']}>                                                                
                                        <Timeline className={styles['timelime_wrapper']} style={{ paddingTop: '7px' }}>
                                            {
                                                (activityTimeline && !_.isEmpty(activityTimeline)) && _.map(activityTimeline, (v, i) => {
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
        )
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

const LeadToupUpWrapper = Form.create()(LeadToupUp)
export default connect(
    (state) => ({
        lead_period: state.PCISCRM_LEADTOPUP_HEADER,
        lead_topup_summary: state.PCISCRM_LEADTOPUP_SUMMARY,
        activity_create: state.PCISCRM_LEADTOPUP_CREATE_ACTIONNOTE,
        activity_timeline: state.PCISCRM_LEADTOPUP_LOAD_ACTIONNOTE,
        filters: {
            region: state.PCIS_MASTER_REGION,
            area: state.PCIS_MASTER_AREA,
            team: state.PCIS_MASTER_TEAM,
            emps: state.PCIS_MASTER_EMPLOYEE
        }
    }), 
    {
        LOAD_ACTIONNOTE: loadActionNote,
        CREATE_ACTIONNOTE: createActionNote,
        GET_LOADTOPUP_HEADER: getLeadTopUpHeader,
        GET_LEADTOPUP_SUMMARY: getLeadTopupSummary,
        GET_MASTER_REGION: getMasterRegionFilter,
        GET_MASTER_AREA: getMasterAreaFilter,
        GET_MASTER_TEAM: getMasterTeamFilter,
        GET_MASTER_EMPS: getMasterEmployeeFilter
    }
)(withRouter(LeadToupUpWrapper))