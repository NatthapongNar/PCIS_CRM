import React, { Component } from 'react'
import { connect } from 'react-redux'
import bluebird from 'bluebird'
import { Row, Col, Collapse, Table, Form, Select, TreeSelect, Input, DatePicker, Button, Icon, Radio, Tag , Popover } from 'antd'
import moment from 'moment'
import _ from 'lodash'

import GridChannelModal from './GridChannelModal'
import ImportManagement from './ImportManagement'

import cls from '../styles/pcis_style.scss'
import table_cls from '../styles/table.scss'

import GridChannelAssignment from './GridChannelAssignment'
import GridChannelCreateProfile from './GridChannelCreateProfile'

import { 
    getCRMUserAuthenication,
    getLeadChannelDashboard,
    getLeadChannelDashboardSummary,
    getLeadChannelDashboardSummarySub,
    getMasterRegionFilter,
    getMasterAreaFilter,
    getMasterTeamFilter,
    getMasterEmployeeFilter,
    getMasterResponse,
    getMasterActionReason,
    getMasterRankScore, 
    getMasterSourceChannel,
    getMasterSubSourceChannel,
    getMasterProductGroup

} from '../../../actions/pcis'
import { in_array, roundFixed } from '../../../containers/PCIS/config/funcitonal'

const FormItem = Form.Item
const Panel = Collapse.Panel
const Option = Select.Option
const ButtonGroup = Button.Group
const RadioGroup = Radio.Group

const gutter_init = 10
const field_colon_label = false
const tree_config = {
    size: 'large',
    treeCheckable: true,
    showCheckedStrategy: TreeSelect.SHOW_PARENT,
    dropdownMatchSelectWidth: false,
    style: { width: '100%' }
}

class GridChannel extends Component {

    state = {
        profile: {
            authen: null,
            data: {},
            visible_modal: false
        },
        createData: {
            visible: false
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
               this.props.LEAD_CHANNEL !== nextProps.LEAD_CHANNEL ||       
               this.props.LEAD_USER_AUTHEN !== nextProps.LEAD_USER_AUTHEN ||        
               this.props.filters !== nextProps.filters ||
               this.props.masters !== nextProps.masters ||
               this.props.form !== nextProps.form ||
               this.state.profile !== nextState.profile ||
               this.state.createData !== nextState.createData ||
               this.state.importHandle !== nextState.importHandle ||
               this.state.activeFilter !== nextState.activeFilter ||
               this.state.refreshActive !== nextState.refreshActive ||
               this.state.settingActive !== nextState.settingActive
    }

    componentWillReceiveProps(props) {
        const { authen, LEAD_USER_AUTHEN } = this.props

        if(props && props.LEAD_CHANNEL) {
            const { LEAD_CHANNEL } = props

            let role_group = (LEAD_USER_AUTHEN && LEAD_USER_AUTHEN.Status && LEAD_USER_AUTHEN.Data.length > 0) ? LEAD_USER_AUTHEN.Data[0].GroupRole : null
            let authe_role = (authen && authen.Role) ? authen.Role : role_group
            
            if(!_.isEmpty(LEAD_CHANNEL.Data)) { 
                _.map(LEAD_CHANNEL.Data, (dataItems) => {                     
                    dataItems.Preview = (<Icon type="desktop" onClick={this.handleProfileOpen.bind(this, dataItems)} style={{ cursor: 'pointer' }} />) 
                    
                    if(dataItems.IsTransfer == 'Y') {
                        if(in_array(authe_role, ['bm_role', 'am_role', 'rd_role', 'dev_role'])) {
                            dataItems.Assignment = (<GridChannelAssignment authen={authen} data={dataItems} handleLoadTrigger={this.handleAutoUpdateProfile} />)
                        } else {
                            dataItems.Assignment = (<Icon type="close" className="red" />)
                        }
                    }
                    else if(dataItems.IsTransfer == 'N' && dataItems.ReassignCompleted) {
                        dataItems.Assignment = <Icon type="check" className="green" />
                    } 
                    else {
                        dataItems.Assignment = null
                    }

                })
            }

        }

    }

    componentWillMount() {
        const { authen, GET_AUTHEN_USER, GET_LEADCHANNEL, GET_LEADCHANNEL_SUM_SUB, GET_LEADCHANNEL_SUM, GET_MASTER_REGION, GET_MASTER_AREA, GET_MASTER_TEAM, GET_MASTER_EMPS, GET_MASTER_RESPONSE, GET_MASTER_ACTION, GET_MASTER_PRODUCT_GROUP, GET_SUBSOURCE_CHANNEL, GET_SOURCE_CHANNEL, GET_RANK_SCORE } = this.props

        let auth_data = { AuthCode: (authen && !_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null }
        const API_DEFAULT_CALL = [
            GET_MASTER_RESPONSE, 
            GET_MASTER_ACTION,
            GET_SUBSOURCE_CHANNEL,
            GET_SOURCE_CHANNEL,
            GET_MASTER_PRODUCT_GROUP,
            GET_RANK_SCORE,
            GET_AUTHEN_USER,
            GET_LEADCHANNEL,
            GET_LEADCHANNEL_SUM_SUB,
            GET_LEADCHANNEL_SUM,
            GET_MASTER_REGION,
            GET_MASTER_AREA,
            GET_MASTER_TEAM,
            GET_MASTER_EMPS
        ]

        bluebird.all(API_DEFAULT_CALL).each((f, i) => { 
            if(i <= 4) f()
            else f(auth_data) 
        })

    }

    componentDidMount() {
        const { config } = this.props
        document.title = config.grid.crm.lead_channel.header.title
        
    }

    render() {
        const { profile, createData, importHandle, pagination } = this.state
        const { config, columns, LEAD_CHANNEL } = this.props

        return (
            <div className={`${cls['pcis_container']} ${cls['fullscreen']}`}>
                <div className={`${cls['grid_container']}`} style={{ padding: '0px 7px', height: '100%' }}>

                    <div className={`${cls['grid_header']}`}>
                        <div className={`${cls['grid_title']} ${cls['h2_pt2em']}`}>
                            <p className={`ttu tc`}>{config.grid.crm.lead_channel.header.title}</p>
                            { this.handleHeadFilter() }
                        </div>
                    </div>

                    <Table 
                        rowKey="RabbitFinanceID"
                        className={`${cls['grid_dashboard']} ${cls['lead']} ${table_cls['table_wrapper']}`}
                        columns={columns}
                        dataSource={LEAD_CHANNEL.Data} 
                        loading={LEAD_CHANNEL.Loading}
                        footer={this.handleFooter}
                        bordered={config.grid.border}
                        pagination={{ ...pagination }}
                        size="small"
                    />
    
                    <GridChannelModal
                        isOpen={profile.visible_modal}
                        authen={this.props.authen}
                        master={this.props.masters}
                        dataSource={this.state.profile}
                        handleClose={this.handleProfileClose}
                        handleLoadTrigger={this.handleAutoUpdateProfile}
                        config={config}
                    />

                    <GridChannelCreateProfile 
                        isOpen={createData.visible}
                        handleClose={this.handleCreateProfileClose}
                    />

                    <ImportManagement 
                        isOpen={importHandle.visible}
                        handleClose={this.handleImportClose}
                    />

                </div>
            </div>
        )
    }

    // SET COLLAPSE OPEN/CLOSE
    handleCollapseFilter = () => {        
        this.setState({ activeFilter: (this.state.activeFilter == 1) ? '0' : '1' })
    }

    // SET ROWS LENGTH OF GRID TABLE HANDLE
    handlePageChange = (size) => {
        this.setState({ pagination: _.assignIn({}, this.state.pagination, { pageSize: parseInt(size) }) })
    }

    handleAutoFilter = (value) => {
        const { form: { getFieldValue }, authen: { Session }, GET_LEADCHANNEL_SUM_SUB, GET_LEADCHANNEL_SUM } = this.props

        let isActive = getFieldValue('IsActive')

        let setParam = {
            AuthCode: (Session && !_.isEmpty(Session.sess_empcode)) ? Session.sess_empcode : null,
            Optional: (value && value.length > 0) ? value : null,
            IsActive: (isActive) ? isActive : null
        }
        
        bluebird.all([GET_LEADCHANNEL_SUM_SUB, GET_LEADCHANNEL_SUM]).each((f) => f(setParam))
    }    

    handleHeadFilter = () => {
        const { config, lead_columns, form, filters, masters, LEAD_CHANNEL_SUM, LEAD_CHANNEL_SUM_SUB } = this.props
        const { getFieldDecorator, getFieldValue } = form
        const { RangePicker } = DatePicker
        const { rank_score, source_channel, sub_source_channel, response_list } = filters.optional
        const { action_list } = masters
        
        const rank_group = _.uniq(_.map(rank_score, 'RankGroup'))
        const source_channel_uniq = _.uniq(_.map(source_channel, 'SourceName'))
        const source_subchannel_uniq = _.uniq(_.map(sub_source_channel, 'SubSourceName'))
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

        const PRODUCT_DRAFT = [
            { ProductCode: 'MSme', ProductName: 'Micro SME' }, 
            { ProductCode: 'MFin', ProductName: 'Micro Finance' }, 
            { ProductCode: 'H4C', ProductName: 'Home For Cash' }
        ]

        const MASTER_OPTION = [         
            {
                label: 'Source Channel',
                value: `${source_channel_uniq.join(',')}`,
                key: `SourceChannel`,
                children: (source_channel && source_channel.length > 0) ? _.map(source_channel, (v) => { 
                    let data_sublist = _.filter(sub_source_channel, { SourceType: v.SourceCode })
                    let sub_lists = (data_sublist && data_sublist.length > 0) ? _.map(data_sublist, (sub_data) => { return { value: `${sub_data.SubSourceName}`, label: `${sub_data.SubSourceName}`, key: `${sub_data.SubSourceName}` } }) : []     
                    let category = { value: `${v.SourceName}`, label: `${v.SourceName}`, key: `${v.SourceName}`, children: sub_lists, disabled: (v && v.IsEnable == 'Y') ? false : true } 
                    return category
                }) : []
            },
            {
                label: 'Ranking Score',
                value: `${_.map(rank_score, 'RankCode').join(',')}`,
                key: 'Ranking_all',
                children: (rank_group && rank_group.length > 0) ? _.map(rank_group, (group_val) => {
                    let sub_group = _.filter(rank_score, { RankGroup: group_val })
                    let sub_data = _.uniq(_.map(sub_group, 'RankCode'))

                    return {
                      label: `Rank ${group_val}`,
                        value: `${sub_data.join(',')}`,
                        key:  `Rank${group_val}`,
                        children: (sub_group && sub_group.length > 0) ? _.map(sub_group, (v) => { return { value: v.RankCode, label: `${v.RankCode} (${v.RankDesc})`, key: v.RankCode } }) : []
                    }
                }) : []
            },
            {
                label: 'Product Type',
                value: `${_.map(PRODUCT_DRAFT, 'ProductCode').join(',')}`,
                key: `ProductType_all`,
                children: (PRODUCT_DRAFT && PRODUCT_DRAFT.length > 0) ? _.map(PRODUCT_DRAFT, (v) => { 
                    return { value: `${v.ProductCode}`, label: `${v.ProductName}`, key: `${v.ProductCode}` }
                }) : []
            }
        ]

        let setSource = []
        let resp = (LEAD_CHANNEL_SUM.Data && LEAD_CHANNEL_SUM.Data.length > 0) ? LEAD_CHANNEL_SUM.Data : []
        let data_subsummary = (LEAD_CHANNEL_SUM_SUB.Data && LEAD_CHANNEL_SUM_SUB.Data.length > 0) ? LEAD_CHANNEL_SUM_SUB.Data : []

        if(resp && resp.length > 0) {
            let total_app  = _.filter(resp, (v) => { return v.Seq == 6 })[0]
            let final_data = _.filter(resp, (v) => { return in_array(v.ResponseLabel, ['สนใจ', 'ไม่สนใจ']) })
            let reject_data = _.reject(resp, (v) => { return in_array(v.ResponseLabel, ['สนใจ', 'ไม่สนใจ', 'ไม่ผ่านเกณฑ์']) })
            let notcriteriapass_data = _.filter(resp, (v) => { return in_array(v.ResponseLabel, ['ไม่ผ่านเกณฑ์']) })

            let total_apppass_criteria =  _.sumBy(final_data, 'TotalAction')
           
            let ctotal_app = (total_app && total_app.TotalAction > 0) ? total_app.TotalAction : 0
            let ctotal_final_app = (total_apppass_criteria && total_apppass_criteria > 0) ? total_apppass_criteria : 0
            let total_avg = (ctotal_final_app / ctotal_app) * 100

            let total_pass = _.sumBy(final_data, 'TotalAction')
            setSource.push(
                {
                    ResponseLabel: 'ลูกค้าผ่านเกณฑ์',
                    TotalAction: total_pass,
                    TotalAch: (total_avg && total_avg > 0) ? roundFixed(total_avg, 2) : 0,
                    Seq: 0,
                    children: _.map(final_data, (data) => {
                        let total_ach = (total_pass && total_pass > 0) ? (data.TotalAction / total_pass) * 100 : 0.00
                        data.TotalAch = (total_ach && total_ach > 0.00) ? roundFixed(total_ach, 2) : 0.00 
                        return data
                    })
                }
            )

            // if(notcriteriapass_data[0]) {
            //     notcriteriapass_data[0].children = (LEAD_CHANNEL_SUM_SUB.Data && LEAD_CHANNEL_SUM_SUB.Data.length > 0) ? LEAD_CHANNEL_SUM_SUB.Data : []
            //     setSource.push(notcriteriapass_data[0])
            // }

            // if(reject_data && reject_data[0]) setSource.push(reject_data[0])
            // if(reject_data && reject_data[1]) setSource.push(reject_data[1])
            // if(reject_data && reject_data[2]) setSource.push(reject_data[2])
            // if(reject_data && reject_data[3]) setSource.push(reject_data[3])

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

                setSource.push(notcriteriapass_data[0])
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

                setSource.push(reject_data[0])
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

                setSource.push(reject_data[1])
            }
            
            if(reject_data && reject_data[2]) {
                reject_data[2].RowKey = 'NA'
                setSource.push(reject_data[2])
            }
            if(reject_data && reject_data[3]) {
                reject_data[3].RowKey = 'TT'
                setSource.push(reject_data[3])
            }
        }   

        let filter_active = _.filter(MASTER_OPTION[0].children, { disabled: false })

        let master_source_list = []
        let sel_optional = getFieldValue('Optional')

        if(sel_optional && sel_optional.length > 0) {

            let dataFilter = _.map(sel_optional, (data) => {
                const patt = new RegExp(',')
                let str_valid = patt.test(data)
                let data_split = (str_valid) ? data.split(',') : data
                let data_commit = (str_valid) ? data_split : [data]
                let getList = _.map(data_commit, (v) => {
                    let data_filter = _.filter(MASTER_OPTION[0].children, { value: v })
                    return data_filter[0]
                })

                return (getList && getList[0])? getList : []
            })
            
            let subDataFilter = _.map(sel_optional, (v) => {    
                let data = _.filter(sub_source_channel, { SubSourceName: v })
                const data_source_channel = _.uniq(_.map(data, 'SourceName'))
               
                if(data_source_channel && data_source_channel.length > 0) {
                    return _.map(data_source_channel, (v) => {
                        let data = _.filter(MASTER_OPTION[0].children, { value: v })
                        return data[0]
                    })[0]
                } else {
                    return []
                }
            })

            let data_union = _.unionWith(dataFilter[0], subDataFilter, _.isEqual)
            let dataItems = _.reject(data_union, (v) => { return _.isEmpty(v) })
            master_source_list = dataItems

        } else {
            master_source_list = MASTER_OPTION[0].children
        }
      
        let filter_uniq   = _.uniq(_.map(filter_active, 'value'))
        let filter_draft  = [{ value: `${(filter_uniq && filter_uniq.length > 0) ? filter_uniq.join(',') : MASTER_OPTION[0].value}`, label: `All Source`, key: `All` }] 
        let filter_source = master_source_list //MASTER_OPTION[0].children
        let filter_union  = _.union(filter_draft, filter_source)
        
        const lead_channel_content = (
            <div className={cls['pcis_container']} style={{ width: '300px', padding: '0px' }}>
                <div style={{ width: '100%' }}>
                    <div className="tr">
                        <span style={{ paddingTop: '6px' }}><Icon type="search" /> SOURCE</span>
                        {
                            getFieldDecorator('AutoSourceFilter', { initialValue: [] })
                            (
                                <TreeSelect                           
                                    treeData={filter_union}
                                    treeDefaultExpandedKeys={_.union(['SourceChannel'], source_subchannel_uniq)}
                                    size="default"
                                    dropdownStyle={{ height: '400px' }}
                                    className={`${cls['padding_none']}`}
                                    dropdownMatchSelectWidth={false}
                                    style={{ width: '50%', marginLeft: '10px' }}
                                    onSelect={this.handleAutoFilter}
                                />
                            )
                        }
                    </div>                   
                </div>
                <div className={`${cls['grid_container']} ${cls['grid_topup_summary']}`}>
                    <Table 
                        rowKey="ResponseLabel"
                        className={cls['grid_general']}
                        columns={lead_columns}
                        dataSource={setSource} 
                        loading={LEAD_CHANNEL_SUM.Loading}
                        bordered
                        pagination={false}
                        size="small"
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
                        <Popover placement="bottomRight" content={lead_channel_content}>
                            <Tag color="blue" >
                                <Icon type="line-chart" style={{ fontSize: '1.2em' }} />&nbsp;
                                <span style={{ fontSize: '1em' }}>{`LEAD SUMMARY`}</span>
                            </Tag>
                        </Popover>
                    </div>

                    <div className={`${cls['tools']} ${cls['hide']}`} onClick={this.handleImportOpen} onMouseOver={this.handleSettingOnTouch} onMouseLeave={this.handleSettingOnLeave}>
                        <i className={`fa fa-cog ${(this.state.settingActive) && 'fa-spin'}`} aria-hidden="true" style={{ color: '#ff9800' }} />
                    </div>

                    <div className={`${cls['tools']} ${cls['hide']} mr4`} style={{ color: '#4682b4' }}>
                        <Icon type="info-circle" />
                    </div>

                    <div className={`${cls['tools']}`} onClick={this.handleSearchForm} onMouseOver={this.handleRefreshEnable} onMouseLeave={this.handleRefreshDisable} style={{ marginRight: '30px' }}>{/*style={{ marginRight: '4rem' }}*/}
                        <Icon type="sync" theme="outlined" spin={this.state.refreshActive} />
                    </div>

                    <div className={`${cls['tools']}`}>
                        <Icon type="user-add" onClick={this.handleCreateProfileOpen} />
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
                                                            treeDefaultExpandedKeys={['LB', 'BKK', 'Nano']}
                                                            dropdownMatchSelectWidth={true}
                                                            dropdownStyle={{ height: '400px' }}
                                                            size="default"
                                                            className={`${cls['filter_employee']} ${cls['padding_none']}`}
                                                            onClick={this.handleSourceHover.bind(this, `${cls['filter_employee']}`)}
                                                            onSelect={this.handleSourceHover.bind(this, `${cls['filter_employee']}`)}
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
                                            <FormItem label="Company Name" className={`${cls['form_item']} ${cls['fix_height']} ttu fw5`} colon={field_colon_label}>
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

    handleFooter = () => {
        return (<div style={{ height: '2px', backgroundColor: '#1a71b9' }}></div>)
    }

    handleOption = (e) => {
        const { form: { setFieldsValue } } = this.props
        setFieldsValue({ 'AutoSourceFilter': null })
    }

    handleSearchForm = (e) => {
        e.preventDefault()

        const { authen: { Session }, form: { validateFields }, GET_LEADCHANNEL, GET_LEADCHANNEL_SUM_SUB, GET_LEADCHANNEL_SUM } = this.props

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
                
                bluebird.all([GET_LEADCHANNEL, GET_LEADCHANNEL_SUM_SUB, GET_LEADCHANNEL_SUM]).each((f) => f(setParam))
         
                this.setState({ activeFilter: '0' })
            }
            
        })

    }

    // OPTION HANDLER    
    handleSourceHover = (elem) => {
        let source_filter = document.querySelector(`.${elem}`)
        _.delay(() => {
            if(in_array('ant-select-open', source_filter.classList.value.split(' '))) {
                let source_attrs = source_filter.getAttribute('aria-controls')
                let tree_field = document.getElementById(source_attrs)
                if(tree_field) {
                    tree_field.parentNode.style.left = "1140.98px" // "1195.98px"
                }               
            }

        }, 200)
    }

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

    handleCreateProfileOpen = () => {
        this.setState({ 
            createData: _.assignIn({}, this.state.createData, { visible: true }) 
        })
    }

    handleCreateProfileClose = () => {
        this.setState({ 
            createData: _.assignIn({}, this.state.createData, { visible: false }) 
        })
    }

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
        const { authen, GET_LEADCHANNEL, GET_LEADCHANNEL_SUM_SUB, GET_LEADCHANNEL_SUM  } = this.props      
        let auth_data = { AuthCode: (authen && !_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null }

        bluebird.all([GET_LEADCHANNEL, GET_LEADCHANNEL_SUM_SUB, GET_LEADCHANNEL_SUM]).each((f) => f(auth_data))
    }

    handleImportOpen = () => {
        this.setState({ 
            importHandle: _.assignIn({}, this.state.importHandle, {
                visible: true 
            }) 
        })
    }

    handleImportClose = () => {
        this.setState({ 
            importHandle: _.assignIn({}, this.state.importHandle, {
                visible: false 
            }) 
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
}

const GridChannelWrapper = Form.create()(GridChannel)
export default connect(
    (state) => ({
        LEAD_USER_AUTHEN: state.PCISCRM_USER_AUTHEN_PROFILE,
        LEAD_CHANNEL: state.PCISCRM_LEADCHANNEL_DASHBOARD,
        LEAD_CHANNEL_SUM: state.PCISCRM_LEADCHANNEL_DASHBOARD_SUMMARY,
        LEAD_CHANNEL_SUM_SUB: state.PCISCRM_LEADCHANNEL_DASHBOARD_SUMMARY_SUB,
        filters: {
            region: state.PCIS_MASTER_REGION,
            area: state.PCIS_MASTER_AREA,
            team: state.PCIS_MASTER_TEAM,
            emps: state.PCIS_MASTER_EMPLOYEE,
            optional: {
                rank_score: state.PCISCRM_MASTER_LEADCHANNEL_RANK_SCORE, 
                source_channel: state.PCISCRM_MASTER_LEADCHANNEL_SOURCE_CHANNEL,
                sub_source_channel: state.PCISCRM_MASTER_LEADCHANNEL_SUBSOURCE_CHANNEL,
                response_list: state.PCISCRM_MASTER_RESPONSE
            }
        },
        masters: {
            response_list: state.PCISCRM_MASTER_RESPONSE,
            action_list: state.PCISCRM_MASTER_ACTION,
            product_transfer: state.PCISCRM_MASTER_PRODUCT_GROUP
        }
    }),
    {
        GET_AUTHEN_USER: getCRMUserAuthenication,
        GET_LEADCHANNEL: getLeadChannelDashboard,
        GET_LEADCHANNEL_SUM: getLeadChannelDashboardSummary,
        GET_LEADCHANNEL_SUM_SUB: getLeadChannelDashboardSummarySub,
        GET_MASTER_REGION: getMasterRegionFilter,
        GET_MASTER_AREA: getMasterAreaFilter,
        GET_MASTER_TEAM: getMasterTeamFilter,
        GET_MASTER_EMPS: getMasterEmployeeFilter,
        GET_MASTER_RESPONSE: getMasterResponse,
        GET_MASTER_ACTION: getMasterActionReason,
        GET_SOURCE_CHANNEL: getMasterSourceChannel,
        GET_SUBSOURCE_CHANNEL: getMasterSubSourceChannel,
        GET_RANK_SCORE: getMasterRankScore,
        GET_MASTER_PRODUCT_GROUP: getMasterProductGroup
    }
)(GridChannelWrapper)
