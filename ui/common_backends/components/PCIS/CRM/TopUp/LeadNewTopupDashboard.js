import React, { Component } from 'react'
import { connect } from 'react-redux'
import bluebird from 'bluebird'
import Scrollbar from 'react-smooth-scrollbar'
import { Row, Col, Collapse, Table, Form, Select, TreeSelect, Input, DatePicker, Button, Icon, Radio, Tag , Popover } from 'antd'
import moment from 'moment'
import _ from 'lodash'

import LeadNewTopupModal from './LeadNewTopupModal'

import cls from '../../styles/pcis_style.scss'
import table_cls from '../../styles/table.scss'

const FormItem = Form.Item
const Panel = Collapse.Panel
const Option = Select.Option
const ButtonGroup = Button.Group
const RadioGroup = Radio.Group

import {
    getNewLeadTopupDashboard,
    getNewLeadTopupDashboardSummary,
    getNewLeadTopupDashboardSubSummary,
    getLeadTopUpHeader,
    getNewLeadTopupMasterLot

} from '../../../../actions/pcis'
import { in_array, roundFixed } from '../../../../containers/PCIS/config/funcitonal';

const gutter_init = 10
const field_colon_label = false
const tree_config = {
    size: 'large',
    treeCheckable: true,
    showCheckedStrategy: TreeSelect.SHOW_PARENT,
    dropdownMatchSelectWidth: false,
    style: { width: '100%' }
}

class LeadNewTopupDashboard extends Component {

    state = {
        profile: {
            authen: null,
            data: {},
            visible_modal: false
        },
        importHandle: {
            visible: false
        },
        activeFilter: '0',
        refreshActive: false,
        settingActive: false,
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

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.authen !== nextProps.authen ||           
               this.props.masters !== nextProps.masters ||
               this.props.filters !== nextProps.filters ||
               this.props.form !== nextProps.form ||
               this.props.LEAD_DATA_TOPUP !== nextProps.LEAD_DATA_TOPUP ||
               this.props.LEAD_DATA_TOPUP_SUMMARY !== nextProps.LEAD_DATA_TOPUP_SUMMARY ||
               this.state.profile !== nextState.profile ||
               this.state.activeFilter !== nextState.activeFilter ||
               this.state.refreshActive !== nextState.refreshActive ||
               this.state.settingActive !== nextState.settingActive
    }

    componentWillMount() {
        const { authen, GET_LEAD_TOPUP, GET_LEAD_TOPUP_SUMMARY, GET_LEAD_TOPUP_SUBSUMMARY, GET_LEAD_TOPUP_HEADER, GET_LEAD_TOPUP_MASTER_LOT } = this.props

        let auth_data = { AuthCode: (authen && !_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null }
        const API_DEFAULT_CALL = [
            GET_LEAD_TOPUP_MASTER_LOT,
            GET_LEAD_TOPUP,
            GET_LEAD_TOPUP_SUMMARY,
            GET_LEAD_TOPUP_SUBSUMMARY,
            GET_LEAD_TOPUP_HEADER   
        ]

        bluebird.all(API_DEFAULT_CALL).each((f, i) => { 
            if(in_array(i, [0])) f()
            else f(auth_data) 
        })

    }

    componentWillReceiveProps(props) {        
        if(props && props.LEAD_DATA_TOPUP) {
            const { LEAD_DATA_TOPUP } = props

            if(!_.isEmpty(LEAD_DATA_TOPUP.Data)) { 
                _.map(LEAD_DATA_TOPUP.Data, (v) => { 
                    v.Preview = (<Icon type="desktop" onClick={this.handleProfileOpen.bind(this, v)} style={{ cursor: 'pointer' }} />) 
                })
            }

        }

    }

    render() {
        const { profile, pagination } = this.state
        const { config, columns, LEAD_DATA_TOPUP, LEAD_LATEST_PERIOD } = this.props

        const start_period = (LEAD_LATEST_PERIOD && !_.isEmpty(LEAD_LATEST_PERIOD[0])) ? LEAD_LATEST_PERIOD[0].DateImport : null
        const expire_period = (LEAD_LATEST_PERIOD && !_.isEmpty(LEAD_LATEST_PERIOD[0])) ? LEAD_LATEST_PERIOD[0].EndPeriod : null
        const total_timeleft = (LEAD_LATEST_PERIOD && !_.isEmpty(LEAD_LATEST_PERIOD[0]) && LEAD_LATEST_PERIOD[0].TimeLeft > 0) ? LEAD_LATEST_PERIOD[0].TimeLeft : 0
        
        return (
            <div className={`${cls['pcis_container']} ${cls['fullscreen']}`}>
                <div className={`${cls['grid_container']}`} style={{ padding: '0px 7px', height: '100%' }}>

                    <div className={`${cls['grid_header']}`}>
                        <div className={`${cls['grid_title']}`}>
                            <p className={`ttu tc`} style={{ fontSize: '2em'}}>{config.grid.crm.lead_topup.header.title}</p>
                            <div style={{ color: `#1e90ff`, display: '-webkit-inline-box' }}>
                                <p style={{ fontSize: '1em', marginRight: '5px' }}>{`${config.grid.crm.lead_topup.header.subtitle} : ${(start_period) ? moment(start_period).format('DD/MM/YYYY') : '00/00/00'} - ${(expire_period) ? moment(expire_period).format('DD/MM/YYYY') : '00/00/00'}`}</p>
                                <Tag color="#f50">{`${total_timeleft}D`}</Tag>
                            </div>
                            
                            { this.handleHeadFilter() }
                        </div>
                    </div>

                    <Table 
                        rowKey="RunNo"
                        className={`${cls['grid_dashboard']} ${cls['lead']} ${table_cls['table_wrapper']}`}
                        columns={columns}
                        dataSource={LEAD_DATA_TOPUP.Data} 
                        loading={LEAD_DATA_TOPUP.Loading}
                        footer={null}
                        bordered={config.grid.border}
                        pagination={{ ...pagination }}
                        size="small"
                    />
             
                    <LeadNewTopupModal
                        isOpen={profile.visible_modal}
                        authen={this.props.authen}
                        master={this.props.masters}
                        dataSource={profile}
                        handleClose={this.handleProfileClose}
                        handleLoadTrigger={this.handleAutoUpdateProfile}
                        config={config}
                    />
                    
                </div>
            </div>
        )
    }
    
    // SET PREVIEW OPEN THE MODAL
    handleProfileOpen = (data) => {
        const { authen } = this.props
       
        this.setState({ 
            profile: _.assignIn({}, this.state.profile, { 
                authen,
                data,
                visible_modal: true 
            }) 
        })
    }

     // SET PREVIEW CLOSE THE MODAL
    handleProfileClose = () => {
        this.setState({ 
            profile: _.assignIn({}, this.state.profile, { 
                authen: null,
                data: {},
                visible_modal: false
            }) 
        })
    }

    handleAutoUpdateProfile = () => {
        const { authen, form: { validateFields }, GET_LEAD_TOPUP, GET_LEAD_TOPUP_SUMMARY, GET_LEAD_TOPUP_SUBSUMMARY } = this.props      

        validateFields((err, fieldData) => {
            if(!err) {
                let setParam = {
                    AuthCode: (authen && !_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null,
                    RegionID: (fieldData.Filter_Region && fieldData.Filter_Region.length > 0) ? fieldData.Filter_Region.join(',') : null,
                    AreaCode: (fieldData.Filter_Area && fieldData.Filter_Area.length > 0) ? fieldData.Filter_Area.join(',') : null,
                    TeamCode: (fieldData.Filter_Team && fieldData.Filter_Team.length > 0) ? fieldData.Filter_Team.join(',') : null,
                    EmpCode: (fieldData.Filter_Employee && fieldData.Filter_Employee.length > 0) ? fieldData.Filter_Employee.join(',') : null,
                    CustomerName: (fieldData.Filter_CustomerName && !_.isEmpty(fieldData.Filter_CustomerName)) ? fieldData.Filter_CustomerName : null,
                    CompanyName: (fieldData.Filter_CompanyName && !_.isEmpty(fieldData.Filter_CompanyName)) ? fieldData.Filter_CompanyName : null,

                    IDCard: (fieldData.Filter_ID_Card && !_.isEmpty(fieldData.Filter_ID_Card)) ? fieldData.Filter_ID_Card : null,
                    ApplicationNo: (fieldData.Filter_AppNo && !_.isEmpty(fieldData.Filter_AppNo)) ? fieldData.Filter_AppNo : null,

                    IsActive: fieldData.IsActive,
                    Optional: (fieldData.Optional && fieldData.Optional.length > 0) ? fieldData.Optional.join(',') : null,

                    ResponseCode: (fieldData.ResponseReason && fieldData.ResponseReason.length > 0) ? fieldData.ResponseReason.join(',') : null,
                    ImportStart: (fieldData.ImportDate && fieldData.ImportDate.length > 0) ? moment(fieldData.ImportDate[0]).format('YYYY-MM-DD') : null,
                    ImportEnd: (fieldData.ImportDate && fieldData.ImportDate.length > 0) ? moment(fieldData.ImportDate[1]).format('YYYY-MM-DD') : null,
                }
                
                bluebird.all([GET_LEAD_TOPUP, GET_LEAD_TOPUP_SUMMARY, GET_LEAD_TOPUP_SUBSUMMARY]).each((f) => f(setParam))

            }            
        })

    }

    // SET COLLAPSE OPEN/CLOSE
    handleCollapseFilter = () => {        
        this.setState({ activeFilter: (this.state.activeFilter == 1) ? '0' : '1' })
    }
    
    // OPTION HANDLER
    handleRefreshEnable = () => {
        this.setState({ refreshActive: true })
    }

    handleRefreshDisable = () => {
        this.setState({ refreshActive: false })
    }

    handleSettingOnTouch = () => {
        this.setState({ settingActive: true })
    }

    handleSettingOnLeave = () => {
        this.setState({ settingActive: false })
    }

    handleAutoFilter = (value) => {
        const { form: { getFieldValue }, authen: { Session }, GET_LEAD_TOPUP_SUMMARY, GET_LEAD_TOPUP_SUBSUMMARY } = this.props

        let isActive = getFieldValue('IsActive')

        let setParam = {
            AuthCode: (Session && !_.isEmpty(Session.sess_empcode)) ? Session.sess_empcode : null,
            LotNo: (value && value.length > 0) ? value : null,
            IsActive: isActive
        }
        
        bluebird.all([GET_LEAD_TOPUP_SUMMARY, GET_LEAD_TOPUP_SUBSUMMARY]).each((f) => f(setParam))
    }    


    handleHeadFilter = () => {
        const { config, summary_columns, form, masters, filters } = this.props
        const { LEAD_MASTER_LOT, LEAD_DATA_TOPUP_SUMMARY, LEAD_DATA_TOPUP_SUBSUMMARY } = this.props

        const { getFieldDecorator } = form
        const { RangePicker } = DatePicker
        const { response_list } = filters.optional
        const { action_list } = masters
        
        const response_reason = _.uniq(_.map(response_list, 'ResponseCode'))

        const MASTER_RESPONSE = [
            {
                label: 'Select All',
                value: `${response_reason.join(',')}`,
                key: `${response_reason.join(',')}`,
                children: (response_list && response_list.length > 0) ? _.map(response_list, (v) => { 
                    let data_sublist = _.filter(action_list, { ResponseCode: v.ResponseCode })
                    let sub_lists = (data_sublist && data_sublist.length > 0) ? _.map(data_sublist, (sub_data) => { 
                        return { 
                            key: `${sub_data.ActionCode}`,
                            label: `${sub_data.ActionName}`,
                            value: `${sub_data.ActionCode}` 
                        } 
                    }) : []     

                    return { 
                        key: `${v.ResponseCode}`,
                        label: `${v.ResponseLabel} (${v.ResponseCode})`,
                        value: `${v.ResponseCode}`, 
                        children: sub_lists
                    }

                }) : []
            }
        ]

        
        const MASTER_OPTION = []

        let table_summary = []
        let data_summary = (LEAD_DATA_TOPUP_SUMMARY.Status) ? LEAD_DATA_TOPUP_SUMMARY.Data : []
        let data_subsummary = (LEAD_DATA_TOPUP_SUBSUMMARY.Status) ? LEAD_DATA_TOPUP_SUBSUMMARY.Data : []

        if(data_summary && data_summary.length > 0) {
            let total_app  = _.filter(data_summary, (v) => { return v.Seq == 7 })[0]
            let final_data = _.filter(data_summary, (v) => { return in_array(v.ResponseLabel, ['สนใจ', 'ไม่สนใจ']) })
            let reject_data = _.reject(data_summary, (v) => { return in_array(v.ResponseLabel, ['สนใจ', 'ไม่สนใจ', 'ไม่ผ่านเกณฑ์']) })
            let notcriteriapass_data = _.filter(data_summary, (v) => { return in_array(v.ResponseLabel, ['ไม่ผ่านเกณฑ์']) })

            let total_apppass_criteria =  _.sumBy(final_data, 'TotalAction')
           
            let ctotal_app = (total_app && total_app.TotalAction > 0) ? total_app.TotalAction : 0
            // let ctotal_amt = (total_app && total_app.TopUpFullAmt > 0) ? total_app.TopUpFullAmt : 0
            let ctotal_final_app = (total_apppass_criteria && total_apppass_criteria > 0) ? total_apppass_criteria : 0
            let total_avg = (ctotal_final_app / ctotal_app) * 100

            let total_pass = _.sumBy(final_data, 'TotalAction')
            let total_pass_amt = _.sumBy(final_data, 'TopUpFullAmt')
            let total_digit_amt = (total_pass_amt > 0.00) ? (total_pass_amt / 1000000) : 0.00

            table_summary.push(
                {
                    RowKey: 'P',
                    ResponseLabel: 'ลูกค้าผ่านเกณฑ์',
                    TotalAction: total_pass,
                    TopUpAmt: (total_digit_amt && total_digit_amt > 0.00) ? roundFixed(total_digit_amt, 2) : 0.00,
                    TopUpFullAmt: (total_pass_amt && total_pass_amt > 0.00) ? total_pass_amt : 0.00,
                    TotalAch: (total_avg && total_avg > 0) ? roundFixed(total_avg, 2) : 0,
                    Seq: 99,
                    children: _.map(final_data, (data) => {
                        let total_ach = (total_pass && total_pass > 0) ? (data.TotalAction / total_pass) * 100 : 0.00
                        data.TotalAch = (total_ach && total_ach > 0.00) ? roundFixed(total_ach, 2) : 0.00 

                        let data_mastercat = _.filter(data_subsummary, { ResponseLabel: data.ResponseLabel })

                        data.RowKey = (data.ResponseLabel == 'สนใจ') ? 'Y':'N',
                        data.children = (data_mastercat && data_mastercat.length > 0) ? _.map(data_mastercat, (d) => {
                            return {
                                RowKey: d.RowKey,
                                ResponseLabel: d.ActionName,
                                TotalAction: d.TotalAction,
                                TopUpAmt: d.TopUpAmt,
                                TopUpFullAmt: d.TopUpFullAmt,
                                TotalAch: (d.TotalAch && d.TotalAch > 0.00) ? roundFixed(d.TotalAch, 2) : 0,
                                Seq: d.Seq
                            }
                        }) : []

                        return data
                    })
                }
            )

            if(notcriteriapass_data[0]) {
                let data_mastercat = _.filter(data_subsummary, { ResponseLabel: notcriteriapass_data[0].ResponseLabel })
                notcriteriapass_data[0].RowKey = 'NC'
                notcriteriapass_data[0].children = (data_mastercat && data_mastercat.length > 0) ? _.map(data_mastercat, (d) => {
                    return {
                        RowKey:  d.RowKey,
                        ResponseLabel: d.ActionName,
                        TotalAction: d.TotalAction,
                        TopUpAmt: d.TopUpAmt,
                        TopUpFullAmt: d.TopUpFullAmt,
                        TotalAch: (d.TotalAch && d.TotalAch > 0.00) ? roundFixed(d.TotalAch, 2) : 0,
                        Seq: d.Seq
                    }
                }) : []

                table_summary.push(notcriteriapass_data[0])
            }

            if(reject_data && reject_data[0]) {
                let data_mastercat = _.filter(data_subsummary, { ResponseLabel: reject_data[0].ResponseLabel })
                reject_data[0].RowKey = 'W'
                reject_data[0].children = (data_mastercat && data_mastercat.length > 0) ? _.map(data_mastercat, (d) => {
                    return {
                        ResponseLabel: d.ActionName,
                        TotalAction: d.TotalAction,
                        TopUpAmt: d.TopUpAmt,
                        TopUpFullAmt: d.TopUpFullAmt,
                        TotalAch: (d.TotalAch && d.TotalAch > 0.00) ? roundFixed(d.TotalAch, 2) : 0,
                        Seq: d.Seq
                    }
                }) : []

                table_summary.push(reject_data[0])
            }
            
            if(reject_data && reject_data[1]) {
                let data_mastercat = _.filter(data_subsummary, { ResponseLabel: reject_data[1].ResponseLabel })
                reject_data[1].RowKey = 'M'
                reject_data[1].children = (data_mastercat && data_mastercat.length > 0) ? _.map(data_mastercat, (d) => {
                    return {
                        ResponseLabel: d.ActionName,
                        TotalAction: d.TotalAction,
                        TopUpAmt: d.TopUpAmt,
                        TopUpFullAmt: d.TopUpFullAmt,
                        TotalAch: (d.TotalAch && d.TotalAch > 0.00) ? roundFixed(d.TotalAch, 2) : 0,
                        Seq: d.Seq
                    }
                }) : []

                table_summary.push(reject_data[1])
            }
            
            if(reject_data && reject_data[2]) {
                reject_data[2].RowKey = 'NA'
                table_summary.push(reject_data[2])
            }
            if(reject_data && reject_data[3]) {
                reject_data[3].RowKey = 'TT'
                table_summary.push(reject_data[3])
            }

        }
        
        let master_filter = (LEAD_MASTER_LOT && LEAD_MASTER_LOT.length > 0) ? LEAD_MASTER_LOT : []
        let master_source = _.map(master_filter, (v) => { 
            return {
                title: `L${v.LotNo} (${(v.DateImport) ? moment(v.DateImport).format('DD/MM/YYYY') : ''}-${(v.EndPeriod) ? moment(v.EndPeriod).format('DD/MM/YYYY') : ''})`,
                value: `${v.LotNo}`,
                key: `L${v.LotNo}`,
            }
        })

        const lead_topup_content = (
            <div className={cls['pcis_container']} style={{ width: '400px', padding: '0px' }}>
                <div style={{ width: '100%' }}>
                    <div className="tr">
                        <span style={{ paddingTop: '6px' }}><Icon type="search" /> SOURCE</span>
                        {
                            getFieldDecorator('AutoSourceFilter', { initialValue: [] })
                            (
                                <TreeSelect                           
                                    treeData={master_source}
                                    size="default"
                                    dropdownStyle={{ height: '400px' }}
                                    className={`${cls['filter_lot']} ${cls['padding_none']}`}
                                    dropdownMatchSelectWidth={false}
                                    style={{ width: '50%', marginLeft: '10px' }}
                                    onSelect={this.handleAutoFilter}
                                    onClick={this.handleSourceHover.bind(this, `${cls['filter_lot']}`)}
                                />
                            )
                        }
                    </div>                   
                </div>
                <div className={`${cls['grid_container']} ${cls['grid_topup_summary']}`}>
                    <Scrollbar>
                        <div style={{ height: '350px' }}>
                            <Table 
                                rowKey="RowKey"
                                className={cls['grid_general']}
                                columns={summary_columns}
                                dataSource={table_summary} 
                                loading={LEAD_DATA_TOPUP_SUMMARY.Loading}
                                bordered
                                pagination={false}
                                size="small"                            
                            />
                        </div>
                    </Scrollbar>
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
                        <Popover placement="bottomRight" content={lead_topup_content}>
                            <Tag color="blue" >
                                <Icon type="line-chart" style={{ fontSize: '1.2em' }} />&nbsp;
                                <span style={{ fontSize: '1em' }}>{`TOP UP SUMMARY`}</span>
                            </Tag>
                        </Popover>
                    </div>

                    <div className={`${cls['tools']} ${cls['hide']}`} onClick={this.handleImportOpen} onMouseOver={this.handleSettingOnTouch} onMouseLeave={this.handleSettingOnLeave}>
                        <i className={`fa fa-cog ${(this.state.settingActive) && 'fa-spin'}`} aria-hidden="true" style={{ color: '#ff9800' }} />
                    </div>

                    <div className={`${cls['tools']} ${cls['hide']} mr4`} style={{ color: '#4682b4' }}>
                        <Icon type="info-circle" />
                    </div>

                    <div className={`${cls['tools']}`} onClick={this.handleSearchForm} onMouseOver={this.handleRefreshEnable} onMouseLeave={this.handleRefreshDisable}>{/*style={{ marginRight: '4rem' }}*/}
                        <Icon type="sync" theme="outlined" spin={this.state.refreshActive} />
                    </div>

                    <div className={`${cls['panel_container']} ${cls['open']} ${cls['collapse_container']} ${cls['lead']}`}>
                        <Collapse defaultActiveKey={this.state.activeFilter} activeKey={this.state.activeFilter} className={`${cls['collapse_filter']}`} onChange={this.handleCollapseFilter}>
                            <Panel key="1" header={config.grid.default.panel_title}>
                                <Form onSubmit={this.handleSearchForm} className={`${cls['form_container']} ${cls['open']}`}>
                                    <Row gutter={gutter_init}>
                                        <Col span={12}>
                                            <FormItem className={`${cls['form_item']} ${cls['ctrlTree']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                {
                                                    getFieldDecorator('IsActive', { initialValue: 'Active' })
                                                    (
                                                        <RadioGroup className="fl">
                                                            <Radio value="Active" className={`${cls['ph1']} ${cls['mh0']}`}>Active</Radio>
                                                            <Radio value="Inactive" className={`${cls['ph1']} ${cls['mh0']}`}>Inactive</Radio>
                                                            <Radio value="All" className={`${cls['ph1']} ${cls['mh0']}`}>All</Radio>
                                                        </RadioGroup>
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={6}></Col>
                                        <Col span={6}></Col>
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
                                                            className={`${cls['filter_employee']} ${cls['padding_none']}`}
                                                            disabled={false}
                                                            onClick={this.handleSourceHover.bind(this, `${cls['filter_employee']}`)}
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
                                            <FormItem label="Business" className={`${cls['form_item']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                {
                                                    getFieldDecorator('Filter_CompanyName', {})(<Input  />)
                                                }
                                            </FormItem>  
                                        </Col>
                                        <Col span={6}>
                                            <FormItem label="ID Card" className={`${cls['form_item']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                {
                                                    getFieldDecorator('Filter_ID_Card', {})(<Input  />)
                                                }
                                            </FormItem>  
                                        </Col>
                                        <Col span={6}>
                                            <FormItem label="App No" className={`${cls['form_item']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
                                                {
                                                    getFieldDecorator('Filter_AppNo', {})(<Input  />)
                                                }
                                            </FormItem>  
                                        </Col>
                                    </Row>
                                    <Row gutter={gutter_init} style={{ paddingTop: '10px'}}>
                                        <Col span={6}>
                                            <FormItem label="Import Date" className={`${cls['form_item']} ${cls['ctrlTree']} ${cls['fix_height']} ${cls['lh0']} ttu fw5 tl`} colon={field_colon_label}>
                                                {
                                                    getFieldDecorator('ImportDate', { initialValue: [] })
                                                    (
                                                        <RangePicker
                                                            format="DD/MM/YYYY"
                                                            treeNodeLabelProp="label"
                                                          placeholder={['START','END']}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={6}>
                                            <FormItem label={'Response Reason'} className={`${cls['form_item']} ${cls['ctrlTree']} ${cls['fix_height']} ttu fw5 tl`} colon={field_colon_label}>
                                                {
                                                    getFieldDecorator('ResponseReason')
                                                    (
                                                        <TreeSelect
                                                            {...tree_config}
                                                            treeData={MASTER_RESPONSE}
                                                            treeDefaultExpandedKeys={[`${response_reason.join(',')}`]}
                                                            size="default"
                                                            dropdownStyle={{ height: '300px' }}
                                                            className={`${cls['padding_none']}`}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </Col>
                                        <Col span={6}>
                                            <FormItem label={'Optional'} className={`${cls['form_item']} ${cls['ctrlTree']} ${cls['fix_height']} ttu fw5 tl`} colon={field_colon_label}>
                                                {
                                                    getFieldDecorator('Optional')
                                                    (
                                                        <TreeSelect
                                                            {...tree_config}
                                                            treeData={MASTER_OPTION}
                                                            treeDefaultExpandedKeys={[]}
                                                            size="default"
                                                            dropdownStyle={{ height: '300px' }}
                                                            className={`${cls['padding_none']}`}
                                                            onChange={this.handleOption}
                                                            disabled={true}
                                                        />
                                                    )
                                                }
                                            </FormItem>
                                        </Col>                                      
                                        <Col span={6} style={{ height: '88px' }}>        
                                            <FormItem className={`fr`} style={{ marginTop: '24px' }}>
                                                <ButtonGroup>
                                                    <Button type="dashed" className={`${cls['btn_fix_pad']} ttu`} onClick={this.handleReset}>Clear</Button>
                                                    <Button type="primary" className={`${cls['btn_fix_pad']} ttu`} htmlType="submit" style={{ backgroundColor: '#0e77ca' }}>
                                                        <Icon type="search" style={{ fontSize: '1.1em' }} />Submit
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

    handleSourceHover = (elem) => {
        let source_filter = document.querySelector(`.${elem}`)
        _.delay(() => {
            if(in_array('ant-select-open', source_filter.classList.value.split(' '))) {
                let source_attrs = source_filter.getAttribute('aria-controls')
                let tree_field = document.getElementById(source_attrs)
                if(tree_field) {
                    tree_field.parentNode.style.left = "1195.98px"
                }
               
            }

        }, 200)
    }

    handleSearchForm = (e) => {
        e.preventDefault()

        const { authen: { Session }, form: { validateFields }, GET_LEAD_TOPUP, GET_LEAD_TOPUP_SUMMARY, GET_LEAD_TOPUP_SUBSUMMARY } = this.props

        validateFields((err, fieldData) => {
            if(!err) {
                let setParam = {
                    AuthCode: (Session && !_.isEmpty(Session.sess_empcode)) ? Session.sess_empcode : null,
                    RegionID: (fieldData.Filter_Region && fieldData.Filter_Region.length > 0) ? fieldData.Filter_Region.join(',') : null,
                    AreaCode: (fieldData.Filter_Area && fieldData.Filter_Area.length > 0) ? fieldData.Filter_Area.join(',') : null,
                    TeamCode: (fieldData.Filter_Team && fieldData.Filter_Team.length > 0) ? fieldData.Filter_Team.join(',') : null,
                    EmpCode: (fieldData.Filter_Employee && fieldData.Filter_Employee.length > 0) ? fieldData.Filter_Employee.join(',') : null,
                    CustomerName: (fieldData.Filter_CustomerName && !_.isEmpty(fieldData.Filter_CustomerName)) ? fieldData.Filter_CustomerName : null,
                    CompanyName: (fieldData.Filter_CompanyName && !_.isEmpty(fieldData.Filter_CompanyName)) ? fieldData.Filter_CompanyName : null,

                    IDCard: (fieldData.Filter_ID_Card && !_.isEmpty(fieldData.Filter_ID_Card)) ? fieldData.Filter_ID_Card : null,
                    ApplicationNo: (fieldData.Filter_AppNo && !_.isEmpty(fieldData.Filter_AppNo)) ? fieldData.Filter_AppNo : null,

                    IsActive: fieldData.IsActive,
                    Optional: (fieldData.Optional && fieldData.Optional.length > 0) ? fieldData.Optional.join(',') : null,

                    ResponseCode: (fieldData.ResponseReason && fieldData.ResponseReason.length > 0) ? fieldData.ResponseReason.join(',') : null,
                    ImportStart: (fieldData.ImportDate && fieldData.ImportDate.length > 0) ? moment(fieldData.ImportDate[0]).format('YYYY-MM-DD') : null,
                    ImportEnd: (fieldData.ImportDate && fieldData.ImportDate.length > 0) ? moment(fieldData.ImportDate[1]).format('YYYY-MM-DD') : null,
                }
                
                bluebird.all([GET_LEAD_TOPUP, GET_LEAD_TOPUP_SUMMARY, GET_LEAD_TOPUP_SUBSUMMARY]).each((f) => f(setParam))

                this.setState({ activeFilter: '0' })
            }
            
        })

    }

    handleFilterRegion = (region) => {
        const { authen, apifilter: { GET_MASTER_AREA, GET_MASTER_TEAM, GET_MASTER_EMPS } } = this.props

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
        const { authen, form, apifilter: { GET_MASTER_TEAM, GET_MASTER_EMPS } } = this.props

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
        const { authen, form, apifilter: { GET_MASTER_EMPS } } = this.props

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

    handleReset = () => {
        const { handleResetFilter } = this.props
        
        handleResetFilter()
        this.props.form.resetFields()
    }

}


const LeadNewTopupWrapper = Form.create()(LeadNewTopupDashboard)
export default connect(
    (state) => ({
        LEAD_LATEST_PERIOD: state.PCISCRM_LEADTOPUP_HEADER,
        LEAD_DATA_TOPUP: state.PCISCRM_NEWLEAD_TOPUP_DASHBOARD,
        LEAD_DATA_TOPUP_SUMMARY: state.PCISCRM_NEWLEAD_TOPUP_DASHBOARD_SUMMARY,
        LEAD_DATA_TOPUP_SUBSUMMARY: state.PCISCRM_NEWLEAD_TOPUP_DASHBOARD_SUBSUMMARY,
        LEAD_MASTER_LOT: state.PCISCRM_MASTER_LOT_LIST
    }),
    {
        GET_LEAD_TOPUP: getNewLeadTopupDashboard,
        GET_LEAD_TOPUP_SUMMARY: getNewLeadTopupDashboardSummary,
        GET_LEAD_TOPUP_SUBSUMMARY: getNewLeadTopupDashboardSubSummary,
        GET_LEAD_TOPUP_HEADER: getLeadTopUpHeader,
        GET_LEAD_TOPUP_MASTER_LOT: getNewLeadTopupMasterLot
    }
)(LeadNewTopupWrapper)
