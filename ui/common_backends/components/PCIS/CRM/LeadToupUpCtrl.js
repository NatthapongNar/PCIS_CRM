import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Form, Collapse, Select } from 'antd'
import bluebird from 'bluebird'
import _ from 'lodash'

import cls from '../styles/pcis_style.scss'

import { getLotLeadTopUpByPCISCRM } from '../../../actions/pcis'
import { roundFixed, numberWithCommas, largeNumberToShort } from '../../../containers/PCIS/config/funcitonal'

const Panel = Collapse.Panel
const Option = Select.Option

class LeadToupUpCtrl extends Component {

    state = {
        activeFilter: '0',
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
        document.title = 'TOP-UP LOT'

        const { authen, GET_LOT_DASHBOARD } = this.props
    
        let auth_data = { 
            AuthCode: (authen && !_.isEmpty(authen.Auth)) ? authen.Auth.EmployeeCode : null 
        }
        
        let API_DEFAULT_CALL = [
            GET_LOT_DASHBOARD
        ]

        bluebird.all(API_DEFAULT_CALL).each((fn) => { 
            fn(auth_data)
        })

    }

    // SET ROWS KEY IDENTITY OF GRID TABLE
    handleRowKey = (data) => {         
        return data.LotNo 
    }

    handleRow = (record) => {
        if(record) {
            if(record.LeftTime <= 0) {
                _.delay(() => {
                    let el_target = document.querySelector(`[data-row-key="${record.LotNo}"]`)
                    el_target.classList.add(cls['blind'])
                }, 200)
            }            
        }
        
    }

    render() {
        const { columns, lot_mangement } = this.props

        return (
            <div className={`${cls['pcis_container']} ${cls['fullscreen']}`}>
                <div className={`${cls['grid_container']}`}>
                    <div className={`${cls['grid_header']}`}>
                        <div className={`${cls['grid_title']} ${cls['h2']}`}>
                            <p className={`ttu tc`}>Top-up Management Dashboard</p>
                            {this.handleHeadFilter()}
                        </div>
                    </div>

                    <Table 
                        className={`${cls['grid_dashboard']} ${cls['table_wrapper']}`}
                        rowKey={this.handleRowKey}
                        dataSource={lot_mangement.Data}
                        loading={!lot_mangement.Status}
                        columns={columns.crm_lead_topup_lots} 
                        footer={this.handleFooter}
                        pagination={this.state.pagination}
                        onRow={this.handleRow}
                        size="small"
                        bordered
                    />
                
                </div>
            </div>
            
        )
    }

    /***************************     SET HEADER     ***************************/
    // SET ROWS LENGTH OF GRID TABLE HANDLE
    handlePageChange = (size) => {
        this.setState({ pagination: _.assignIn({}, this.state.pagination, { pageSize: parseInt(size) }) })
    }

    // SET COLLAPSE OPEN/CLOSE
    handleCollapseFilter = () => {        
        this.setState({ activeFilter: (this.state.activeFilter == 1) ? '0' : '1' })
    }

    handleHeadFilter = () => {
        const { config } = this.props

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
                    <div className={`${cls['panel_container']} ${cls['open']} ${cls['collapse_container']}`} style={{ display: 'none' }}>
                        <Collapse defaultActiveKey={this.state.activeFilter} activeKey={this.state.activeFilter} className={`${cls['collapse_filter']}`} onChange={this.handleCollapseFilter}>
                            <Panel key="1" header={config.grid.default.panel_title}>
                                <Form onSubmit={this.handleSearchForm} className={`${cls['form_container']} ${cls['open']}`}>

                                </Form>
                            </Panel>
                        </Collapse>
                    </div>
                </div>
            </div>
        )

    }

    handleSearchForm = (e) => {

    }

    /***************************     SET FOOTWER     ***************************/
    handleFooter = (currentPageData) => {
        const { lot_mangement } = this.props

        const parentTable = document.querySelector(`.${cls['grid_dashboard']}`)
        const default_class = ['ttu tl fw6', 'tc', 'tc', 'tc', 'tc', 'tr', 'tc', 'tc', 'tc', 'tc', 'tc', 'tc', 'tc', 'tc', 'tc', 'tc', 'tr', 'tc', 'tc']

        const lead_topup = (lot_mangement.Data && lot_mangement.Data.length > 0) ? lot_mangement.Data : []
        
        if(parentTable) {

            let el_header1 = parentTable.querySelectorAll(`tr:first-child th`)
            let el_header2 = parentTable.querySelectorAll(`tr:nth-child(2) th`)
  
            let el_draft1 = [el_header1[0], el_header2[0], el_header2[1], el_header2[2], el_header2[3], el_header2[4]]
           
            _.forEach(parentTable.querySelectorAll(`tr:nth-child(3) th`), (el) => { el_draft1.push(el) })
            
            let el_draft2 = [el_header2[8], el_header2[9], el_header2[10], el_header2[11], el_header2[12], el_header2[13], el_header1[6]]
            
            let dom_draft = _.union(el_draft1, el_draft2)


            let rtd_element = dom_draft
            let rtd_count = dom_draft.length
      
            if(rtd_count > 0) {

                let rtd_size = []
                _.forEach(rtd_element, (v, i) => { rtd_size.push($(v).outerWidth()) })

                // TOTAL ACCOUNT OF LOT
                let total_lot_acc = numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'TotalAcc'), 0), 10))
                let grand_total_lot_acc = numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(lead_topup, 'TotalAcc'), 0), 10))

                // SB UNIT VS %INTEREST
                let total_sb_unit = numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'TotalSB_Unit'), 0), 5))
                let grand_total_sb_unit = numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'TotalSB_Unit'), 0), 5))

                let total_sb_interest = numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(lead_topup, 'TotalSB_InterestUnit'), 0), 5))
                let grand_sb_interest = numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(lead_topup, 'TotalSB_InterestUnit'), 0), 5))

                let total_sb_interest_ach = (total_sb_interest / total_sb_unit) * 100
                let grand_total_sb_interest_ach = (grand_sb_interest / grand_total_sb_unit) * 100

                // DRM UNIT VS %INTEREST
                let total_drm_unit = numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'TotalDRM_Unit'), 0), 5))
                let grand_total_drm_unit = numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'TotalDRM_Unit'), 0), 5))

                let total_drm_interest = numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(lead_topup, 'TotalDRM_InterestUnit'), 0), 5))
                let grand_drm_interest = numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(lead_topup, 'TotalDRM_InterestUnit'), 0), 5))

                let total_drm_interest_ach = (total_drm_interest / total_drm_unit) * 100
                let grand_total_drm_interest_ach = (grand_drm_interest / grand_total_drm_unit) * 100

                // LB UNIT VS %INTEREST
                let total_lb_unit = numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'TotalLB_Unit'), 0), 5))
                let grand_total_lb_unit = numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'TotalLB_Unit'), 0), 5))

                let total_lb_interest = numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(lead_topup, 'TotalLB_InterestUnit'), 0), 5))
                let grand_lb_interest = numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(lead_topup, 'TotalLB_InterestUnit'), 0), 5))

                let total_lb_interest_ach = (total_lb_interest / total_lb_unit) * 100
                let grand_total_lb_interest_ach = (grand_lb_interest / grand_total_lb_unit) * 100

                // A2CA SUMMARY
                let total_a2ca_unit = numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'TotalA2CA_Unit'), 0), 5))
                let grand_total_a2ca_unit = numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'TotalA2CA_Unit'), 0), 5))

                let total_a2ca_ach = (total_a2ca_unit / total_lot_acc) * 100
                let grand_total_a2ca_ach = (grand_total_a2ca_unit / grand_total_lot_acc) * 100

                // DRAWDOWN SUMMARY
                let total_dd_unit = numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'TotalDrawdown_Unit'), 0), 5))
                let grand_total_dd_unit = numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'TotalDrawdown_Unit'), 0), 5))

                let total_dd_ach = (total_dd_unit / total_lot_acc) * 100
                let grand_total_dd_ach = (grand_total_dd_unit / grand_total_lot_acc) * 100


                // CURRENT PAGE
                let footer_summary = { 
                    cur: {
                        0: 'Total',
                        4: total_lot_acc,
                        5: numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'TotalTopupAmt'), 0), 10)),
                        6: (total_sb_unit && total_sb_unit > 0.00 && !isNaN(total_sb_unit)) ? roundFixed(total_sb_unit, 2) : 0.00,
                        7: (total_sb_interest_ach && total_sb_interest_ach > 0.00 && !isNaN(total_sb_interest_ach)) ? roundFixed(total_sb_interest_ach, 2) : 0.00,
                        8: total_drm_unit,
                        9: (total_drm_interest_ach && total_drm_interest_ach > 0.00 && !isNaN(total_drm_interest_ach)) ? roundFixed(total_drm_interest_ach, 2) : 0.00,
                        10: total_lb_unit,
                        11: (total_lb_interest_ach && total_lb_interest_ach > 0.00 && !isNaN(total_lb_interest_ach)) ? roundFixed(total_lb_interest_ach, 2) : 0.00,
                        12: numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'TotalA2CA_Unit'), 0), 5)),
                        13: (total_a2ca_ach && total_a2ca_ach > 0.00 && !isNaN(total_a2ca_ach)) ? roundFixed(total_a2ca_ach, 2) : 0.00,
                        14: numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'TotalA2CA_Backlog'), 0), 5)),
                        15: numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'TotalDrawdown_Unit'), 0), 5)),
                        16: numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(currentPageData, 'TotalDrawdown_Amt'), 0), 9)),
                        17: (total_dd_ach && total_dd_ach > 0.00 && !isNaN(total_dd_ach)) ? roundFixed(total_dd_ach, 2) : 0.00
                    },
                    all: {
                        0: 'Grand Total',
                        4: grand_total_lot_acc,
                        5: numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(lead_topup, 'TotalTopupAmt'), 0), 10)),
                        6: (grand_total_sb_unit && grand_total_sb_unit > 0.00 && !isNaN(grand_total_sb_unit)) ? roundFixed(grand_total_sb_unit, 2) : 0.00,
                        7: (grand_total_sb_interest_ach && grand_total_sb_interest_ach > 0.00 && !isNaN(grand_total_sb_interest_ach)) ? roundFixed(grand_total_sb_interest_ach, 2) : 0.00,
                        8: grand_total_drm_unit,
                        9: (grand_total_drm_interest_ach && grand_total_drm_interest_ach > 0.00 && !isNaN(grand_total_drm_interest_ach)) ? roundFixed(grand_total_drm_interest_ach, 2) : 0.00,
                        10: grand_total_sb_unit,
                        11: (grand_total_lb_interest_ach && grand_total_lb_interest_ach > 0.00 && !isNaN(grand_total_lb_interest_ach)) ? roundFixed(grand_total_lb_interest_ach, 2) : 0.00,
                        12: numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(lead_topup, 'TotalA2CA_Unit'), 0), 5)),
                        13: (grand_total_a2ca_ach && grand_total_a2ca_ach > 0.00 && !isNaN(grand_total_a2ca_ach)) ? roundFixed(grand_total_a2ca_ach, 2) : 0.00,
                        14: numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(lead_topup, 'TotalA2CA_Backlog'), 0), 5)),
                        15: numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(lead_topup, 'TotalDrawdown_Unit'), 0), 5)),
                        16: numberWithCommas(largeNumberToShort(roundFixed(_.sumBy(lead_topup, 'TotalDrawdown_Amt'), 0), 10)),
                        17: (grand_total_dd_ach && grand_total_dd_ach > 0.00 && !isNaN(grand_total_dd_ach)) ? roundFixed(grand_total_dd_ach, 2) : 0.00
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

}

const LeadToupUpCtrlWrapper = Form.create()(LeadToupUpCtrl)
export default connect(
    (state) => ({
        lot_mangement: state.PCISCRM_LOT_LEADTOPUP_DASHBOARD
    }), 
    { 
        GET_LOT_DASHBOARD: getLotLeadTopUpByPCISCRM 
    }
)(LeadToupUpCtrlWrapper)