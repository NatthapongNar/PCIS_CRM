import React from 'react'
import { Link } from 'react-router-dom'
import { Popover, Tooltip, Icon } from 'antd'
import { in_array, roundFixed, numberWithCommas, compareByAlph, compareByDate, compareByNumber, compareByAmount, parseNumberShortNew } from './funcitonal'
import { app_config } from '../../../components/App/config'
import moment from 'moment'
import _ from 'lodash'

import 'moment/locale/th'

import cls from './columns.scss'

const lot_col_unit = 4
const lot_col_ach = 3

export const columns = {
    crm_lead_topup_lots: [
        {
            title: "Lot No",
            key: 'LotNo',
            dataIndex: 'LotNo',
            className: `topupcol_1 ${cls['v-mid']} ttu tc pointer`,
            width: '2.5%',
            sorter: (a, b) => compareByNumber(a.LotNo, b.LotNo), 
            onHeaderCell: () => {
                return {
                    onClick: () => {
                        let element = $('th.ant-table-column-has-filters.topupcol_1').find('.ant-table-column-sorter > span')
                        headAutoSort(element)                    
                    }
                }
            }
        },
        {
            title: 'Effective Date',
            dataIndex: 'EffectiveTopupLoan',
            className: 'ttu tc',
            children: [
                {
                    title: (<div className="tc">Start</div>),
                    key: 'StartDate',
                    dataIndex: 'StartPeriod',
                    className: `topupcol_2 ${cls['v-mid']} ttu tc pointer`,
                    width: '4%',
                    sorter: (a, b) => compareByDate(a.StartPeriod, b.StartPeriod), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_2').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str) => {
                        return (!_.isEmpty(str)) ? moment(str).format('DD/MM/YY') : null
                    }
                },
                {
                    title: (<div className="tc">Expired</div>),
                    key: 'ExpireDate',
                    dataIndex: 'EndPeriod',
                    className: `topupcol_3 ${cls['v-mid']} ttu tc pointer`,
                    width: '4%',
                    sorter: (a, b) => compareByDate(a.EndPeriod, b.EndPeriod), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_3').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str) => {
                        return (!_.isEmpty(str)) ? moment(str).format('DD/MM/YY') : null
                    }  
                },
                {
                    title: (<Icon type="hourglass" className={cls['i1_3em']} />),
                    key: 'LeftTime',
                    dataIndex: 'LeftTime',
                    className: `topupcol_4 ${cls['v-mid']} ttu tc pointer`,
                    width: '2%',
                    sorter: (a, b) => compareByNumber(a.LeftTime, b.LeftTime), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_4').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (timeage) => {
                        return handleLeftTimeColor(timeage)
                    }
                }
            ]
        },
        {
            title: 'Loan Top-Up Info',
            dataIndex: 'TopupLoan',
            className: 'ttu tc',
            children: [
                {
                    title: (<div className="tc">Total</div>),
                    key: 'TotalAcc',
                    dataIndex: 'TotalAcc',
                    className: `topupcol_5 ${cls['v-mid']} ttu tc pointer`,
                    width: '5%',
                    sorter: (a, b) => compareByNumber(a.TotalAcc, b.TotalAcc), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_5').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }       
                },
                {
                    title: (<div className="tc">Amount</div>),
                    key: 'TotalTopupAmt',
                    dataIndex: 'TotalTopupAmt',
                    className: `topupcol_6 ${cls['v-mid']} ttu tr pointer`,
                    width: '7%',
                    sorter: (a, b) => compareByAmount(a.TotalTopupAmt, b.TotalTopupAmt), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_6').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (num) => {
                        return `${numberWithCommas(roundFixed(num, 0))}`
                    }   
                }                
            ]
        },
        {
            title: "Unit Share Of Lead Top-Up : %Interest",
            key: 'InterestInfo',
            dataIndex: 'InterestInfo',
            className: `${cls['v-mid']} ttu tc`,
            children: [
                {
                    title: "LB",
                    key: 'LBInfo',
                    dataIndex: 'LBInfo',
                    className: `${cls['v-mid']} ttu tc`,
                    children: [
                        {
                            title: "Unit",
                            key: 'TotalLB_Unit',
                            dataIndex: 'TotalLB_Unit',
                            className: `topupcol_11 ${cls['v-mid']} ttu tc pointer`,
                            width: `${lot_col_unit}%`,
                            sorter: (a, b) => compareByNumber(a.TotalLB_Unit, b.TotalLB_Unit), 
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.topupcol_11').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            }       
                        },
                        {
                            title: "%Int",
                            key: 'LB_InterestPercent',
                            dataIndex: 'LB_InterestPercent',
                            className: `topupcol_12 ${cls['v-mid']} ttu tc pointer`,
                            width: `${lot_col_ach}%`,
                            sorter: (a, b) => compareByAmount(a.LB_InterestPercent, b.LB_InterestPercent), 
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.topupcol_12').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            }  
                        }  
                    ]
                },
                {
                    title: "SB",
                    key: 'SBInfo',
                    dataIndex: 'SBInfo',
                    className: `${cls['v-mid']} ttu tc`,
                    children: [
                        {
                            title: "Unit",
                            key: 'TotalSB_Unit',
                            dataIndex: 'TotalSB_Unit',
                            className: `topupcol_7 ${cls['v-mid']} ttu tc pointer`,
                            width: `${lot_col_unit}%`,
                            sorter: (a, b) => compareByNumber(a.TotalSB_Unit, b.TotalSB_Unit), 
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.topupcol_7').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            }
                        },
                        {
                            title: "%Int",
                            key: 'SB_InterestPercent',
                            dataIndex: 'SB_InterestPercent',
                            className: `topupcol_8 ${cls['v-mid']} ttu tc pointer`,
                            width: `${lot_col_ach}%`,
                            sorter: (a, b) => compareByAmount(a.SB_InterestPercent, b.SB_InterestPercent), 
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.topupcol_8').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            }    
                        }  
                    ]
                },
                {
                    title: "DRM",
                    key: 'DRMInfo',
                    dataIndex: 'DRMInfo',
                    className: `${cls['v-mid']} ttu tc`,
                    children: [
                        {
                            title: "Unit",
                            key: 'TotalDRM_Unit',
                            dataIndex: 'TotalDRM_Unit',
                            className: `topupcol_9 ${cls['v-mid']} ttu tc pointer`,
                            width: `${lot_col_unit}%`,
                            sorter: (a, b) => compareByNumber(a.TotalDRM_Unit, b.TotalDRM_Unit), 
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.topupcol_9').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            }   
                        },
                        {
                            title: "%Int",
                            key: 'DRM_InterestPercent',
                            dataIndex: 'DRM_InterestPercent',
                            className: `topupcol_10 ${cls['v-mid']} ${cls['br1_w']} ttu tc pointer`,
                            width: `${lot_col_ach}%`,
                            sorter: (a, b) => compareByAmount(a.DRM_InterestPercent, b.DRM_InterestPercent), 
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.topupcol_10').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            }       
                        }  
                    ]
                }
            ]      
        },
        {
            title: "A2CA Information",
            key: 'A2CAInfo',
            dataIndex: 'A2CAInfo',
            className: `${cls['v-mid']} ttu tc`,
            children: [
                {
                    title: "Total",
                    key: 'TotalA2CA_Unit',
                    dataIndex: 'TotalA2CA_Unit',
                    className: `topupcol_13 ${cls['v-mid']} ttu tc pointer`,
                    width: '5%',
                    sorter: (a, b) => compareByNumber(a.TotalA2CA_Unit, b.TotalA2CA_Unit), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_13').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }        
                },
                {
                    title: "%Succ",
                    key: 'TotalA2CA_Ach',
                    dataIndex: 'TotalA2CA_Ach',
                    className: `topupcol_14 ${cls['v-mid']} ttu tc pointer`,
                    width: '5%',
                    sorter: (a, b) => compareByAmount(a.TotalA2CA_Ach, b.TotalA2CA_Ach), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_14').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }    
                },
                {
                    title: "Backlog",
                    key: 'TotalA2CA_Backlog',
                    dataIndex: 'TotalA2CA_Backlog',
                    className: `topupcol_15 ${cls['v-mid']} ${cls['br1_w']} ttu tc pointer`,
                    width: '5%',
                    sorter: (a, b) => compareByNumber(a.TotalA2CA_Backlog, b.TotalA2CA_Backlog), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_15').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }          
                }  
            ]
        },
        {
            title: "Drawdown Information",
            key: 'DrawdownInfo',
            dataIndex: 'DrawdownInfo',
            className: `${cls['v-mid']} ttu tc`,
            children: [
                {
                    title: "Total",
                    key: 'TotalDrawdown_Unit',
                    dataIndex: 'TotalDrawdown_Unit',
                    className: `topupcol_16 ${cls['v-mid']} ttu tc pointer`,
                    width: '5%',
                    sorter: (a, b) => compareByNumber(a.TotalDrawdown_Unit, b.TotalDrawdown_Unit), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_16').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }         
                },
                {
                    title: (<div className="tc">Amount</div>),
                    key: 'TotalDrawdown_Amt',
                    dataIndex: 'TotalDrawdown_Amt',
                    className: `topupcol_17 ${cls['v-mid']} ttu tr pointer`,
                    width: '7%',
                    sorter: (a, b) => compareByAmount(a.TotalDrawdown_Amt, b.TotalDrawdown_Amt), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_17').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (num) => {
                        return `${numberWithCommas(roundFixed(num, 0))}`
                    }           
                },
                {
                    title: "%Succ",
                    key: 'TotalDrawdown_Ach',
                    dataIndex: 'TotalDrawdown_Ach',
                    className: `topupcol_18 ${cls['v-mid']} ${cls['br1_w']} ttu tc pointer`,
                    width: '5%',
                    sorter: (a, b) => compareByAmount(a.TotalDrawdown_Ach, b.TotalDrawdown_Ach), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_18').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }     
                }  
            ]
        },
        {
            title: (<Icon type="inbox" className={`${cls['i1_5em']} pointer`} />),
            key: 'LotViewer',
            dataIndex: 'LotViewer',
            className: `${cls['v-mid']} ${cls['bl1']} ttu tc`,
            width: '2%',
            render: (e, items) => {
                return (
                    <Link to={`${app_config.rootPath}/leadtopup/${items.LotNo}`}>
                        <Popover content={`เปิดข้อมูล Topup Lot ${items.LotNo}`} placement="left">
                            <Icon type="eye" className={`${cls['i1_5em']} pointer`} />
                        </Popover>                         
                    </Link>
                )
            }
        }
    ],
    crm_lead_topup_list: [
        {
            title: (<i className="fa fa-hashtag pointer" aria-hidden="true"></i>),
            key: 'RunNo',
            dataIndex: 'RunNo',
            className: `${cls['v-mid']} topupcol_1 ttu tc`,
            width: '3%',
            sorter: (a, b) => compareByNumber(a.RunNo, b.RunNo), 
            onHeaderCell: () => {
                return {
                    onClick: () => {
                        let element = $('th.ant-table-column-has-filters.topupcol_1').find('.ant-table-column-sorter > span')
                        headAutoSort(element)                    
                    }
                }
            }
        },
        {
            title: (<i className="fa fa-television pointer" aria-hidden="true"></i>),
            key: 'CustProfile',
            dataIndex: 'CustProfile',
            className: `${cls['v-mid']} topupcol_2 ttu tc`,
            width: '2%'
        },
        {
            title: (<div>Customer<br/>Name</div>),
            key: 'AC_Name',
            dataIndex: 'AC_Name',
            className: `${cls['v-mid']} topupcol_3 ${cls['customer_ellipsis']} ttu pointer`,
            width: '7',
            render: (str) => {            
                let hasMultiName = str.match(/,/i)
                if(!_.isEmpty(hasMultiName)) {                            
                    let splitName = str.split(',')
                    let custname = <div>{ _.map(splitName, (v, i) => { return (<div key={(i + 1)}>{ v }</div>) }) }</div>
                    return <Popover content={custname}>{(!_.isEmpty(splitName[0])) ? handleCustName(splitName[0]) : ''}</Popover>
                } else {
                    return <Popover content={str}>{handleCustName(str)}</Popover> 
                }
            },
            sorter: (a, b) => compareByAlph(a.AC_Name, b.AC_Name),
            onHeaderCell: () => {
                return {
                    onClick: () => {
                        let element = $('th.ant-table-column-has-filters.topupcol_3').find('.ant-table-column-sorter > span')
                        headAutoSort(element)                    
                    }
                }
            }
        },
        {
            title: 'Top-Up (Est)',
            dataIndex: 'TopupLoan',
            className: 'ttu tc',
            children: [
                {
                    title: 'Amt',
                    key: 'TopUpAmt',
                    dataIndex: 'TopUpFullAmt',
                    className: 'topupcol_4 ttu tr pointer',
                    width: '5%',
                    render: (num) => {
                        return `${numberWithCommas(roundFixed(num, 0))}`
                    },
                    sorter: (a, b) => compareByAmount(a.TopUpFullAmt, b.TopUpFullAmt), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_4').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }
                },
                {
                    title: '% Up',
                    key: 'CustTopUpPercent',
                    dataIndex: 'FactorPercent',
                    className: 'topupcol_5 ttu tc pointer',
                    width: '3%',
                    render: (num) => {
                        return `${roundFixed(num, 2)}%`
                    },
                    sorter: (a, b) => compareByAmount(a.FactorPercent, b.FactorPercent), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_5').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }
                }
            ]
        },
        {
            title: 'Loan Info',
            key: 'LoanInfo',
            dataIndex: 'LoanInfo',
            className: 'ttu tc',
            children: [
                {
                    title: 'DD Date',
                    key: 'DrawdownDate',
                    dataIndex: 'DrawdownDate',
                    className: 'topupcol_6 ttu tc pointer',
                    width: '5%',
                    render: (str) => {
                        return (!_.isEmpty(str)) ? moment(str).format('DD/MM/YY') : null
                    },
                    sorter: (a, b) => compareByDate(a.DrawdownDate, b.DrawdownDate),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.mktcol_6').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }
                },
                {
                    title: 'Limit',
                    key: 'DrawdownAmt',
                    dataIndex: 'DrawdownAmt',
                    className: 'topupcol_7 ttu tc pointer',
                    width: '3.5%',
                    sorter: (a, b) => compareByAmount(a.DrawdownAmt, b.DrawdownAmt), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_7').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }
                },
                {
                    title: 'O/S',
                    key: 'OSBal',
                    dataIndex: 'OSBal',
                    className: 'topupcol_8 ttu tc pointer',
                    width: '3.5%',
                    sorter: (a, b) => compareByAmount(a.OSBal, b.OSBal), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_8').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }
                },
                {
                    title: 'Repay',
                    key: 'RepayPercent',
                    dataIndex: 'RepayPercent',
                    className: 'topupcol_9 ttu tc pointer',
                    width: '4%',
                    render: (num, rowsData) => {
                        let repay_amt = (rowsData && rowsData.RepayAmt > 0 || rowsData.RepayAmt > 0.00) ? rowsData.RepayAmt : 0
                        return (<Tooltip title={`Repay Amount : ${roundFixed(repay_amt, 2)}Mb`} placement="top">{`${roundFixed(num, 1)}%`}</Tooltip>)
                    },
                    sorter: (a, b) => compareByAmount(a.RepayPercent, b.RepayPercent), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_9').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }
                }
            ]
        },
        {
            title: 'Collateral Info',
            key: 'CollateralInfo',
            dataIndex: 'CollateralInfo',
            className: 'ttu tc',
            children: [
                {
                    title: 'AP',
                    key: 'ApprisalValue',
                    dataIndex: 'ApprisalValue',
                    className: 'topupcol_10 ttu tc pointer',
                    width: '3.5%',
                    sorter: (a, b) => compareByAmount(a.ApprisalValue, b.ApprisalValue), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_10').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }
                },
                {
                    title: 'C_LTV',
                    key: 'C_LTV',
                    dataIndex: 'C_LTV',
                    className: 'topupcol_11 ttu tc pointer',
                    width: '3.5%',
                    render: (num) => {
                        return `${roundFixed(num, 1)}%`
                    },
                    sorter: (a, b) => compareByAmount(a.C_LTV, b.C_LTV), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_11').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }
                },
                {
                    title: 'N_LTV',
                    key: 'N_LTV',
                    dataIndex: 'N_LTV',
                    className: 'topupcol_12 ttu tc pointer',
                    width: '3.5%',
                    sorter: (a, b) => compareByAmount(a.N_LTV, b.N_LTV), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_12').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (num) => {
                        return `${roundFixed(num, 1)}%`
                    }                    
                }                
            ]
        },
        {
            title: 'Employee Info',
            key: 'EmployeeInfo',
            dataIndex: 'EmployeeInfo',
            className: 'ttu tc',
            children: [
                {
                    title: 'CH',
                    key: 'Channel',
                    dataIndex: 'Channel',
                    className: 'topupcol_13 ttu tc pointer',
                    width: '3%',
                    sorter: (a, b) => compareByAlph(a.Channel, b.Channel),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_13').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }
                },
                {
                    title: 'Team',
                    key: 'BranchDigit',
                    dataIndex: 'BranchDigit',
                    className: 'topupcol_14 ttu tc pointer',
                    width: '4%',
                    render: (str, rowsData) => {
                        let branch_name = (!_.isEmpty(rowsData.BranchName)) ? rowsData.BranchName : null
                        if(!_.isEmpty(branch_name))
                            return (<Tooltip title={branch_name} placement="top">{str}</Tooltip>)
                        else 
                            return null
                    },
                    sorter: (a, b) => compareByAlph(a.BranchDigit, b.BranchDigit),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_14').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }
                },
                {
                    title: 'Mgr.',
                    key: 'ManagerName',
                    dataIndex: 'ManagerName',
                    className: `topupcol_15 ${cls['empname_ellipsis']} ttu pointer`,
                    width: '4%',
                    render: (str, rowsData) => {
                        let name = (str) ? str.split(' ')[0] : ''
                        let mobile = (rowsData && rowsData.ManagerMobile) ? handleTelephone(_.padStart(String(rowsData.ManagerMobile), 10, '0')) : null
                        let content = (
                            <div>
                                <div className="ttu">Name : {str}</div>
                                <div className="ttu">Mobile : {(!_.isEmpty(mobile)) ? mobile : '-'}</div>
                            </div>
                        )
                        return <Popover content={content}>{name}</Popover> 
                    },
                    sorter: (a, b) => compareByAlph(a.ManagerName, b.ManagerName),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_15').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }
                },
                {
                    title: 'RM',
                    key: 'Sale_CurrentName',
                    dataIndex: 'Sale_CurrentName',
                    className: `topupcol_16 ${cls['empname_ellipsis']} ttu pointer`,
                    width: '4%',
                    render: (str, rowsData) => {                        
                        let mobile = (rowsData && rowsData.SaleMobile) ? handleTelephone(_.padStart(String(rowsData.SaleMobile), 10, '0')) : null
                        let content = (
                            <div>
                                <div className="ttu">Name : {str}</div>
                                <div className="ttu">Mobile : {(!_.isEmpty(mobile)) ? mobile : '-'}</div>
                            </div>
                        )
                        return <Popover content={content}>{str}</Popover> 
                    },
                    sorter: (a, b) => compareByAlph(a.Sale_CurrentName, b.Sale_CurrentName),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_16').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }
                }
            ]
        },
        {
            title: 'Action Info',
            key: 'ActionInfo',
            dataIndex: 'ActionInfo',
            className: 'ttu tc',
            children: [
                {
                    title: 'Latest',
                    key: 'ActionLatestDate',
                    dataIndex: 'ActionLatestDate',
                    className: 'topupcol_17 ttu tc pointer',
                    width: '5%',
                    render: (str) => {
                        return (!_.isEmpty(str)) ? moment(str).format('DD/MM/YY') : null
                    },
                    sorter: (a, b) => compareByDate(a.ActionLatestDate, b.ActionLatestDate),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_17').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }
                },
                {
                    title: (<Icon type="clock-circle-o" />),
                    key: 'ActionSLA',
                    dataIndex: 'ActionSLA',
                    className: 'topupcol_18 ttu tc pointer',
                    width: '2.5%',
                    render: (str, rowsData) => {
                        return (str && str >= 0) ? str : null // && !_.isEmpty(rowsData.ActionLatestDate)
                    },
                    sorter: (a, b) => compareByAmount(a.ActionSLA, b.ActionSLA), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_18').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }                      
                },
                {
                    title: 'Response',
                    key: 'ResponseLabel',
                    dataIndex: 'ResponseLabel',
                    className: 'topupcol_19 ttu pointer',
                    width: '5%',
                    sorter: (a, b) => compareByAlph(a.ResponseLabel, b.ResponseLabel),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_19').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }
                },
                {
                    title: 'Reason',
                    key: 'ActionName',
                    dataIndex: 'ActionName',
                    className: 'topupcol_20 ttu pointer',
                    width: '8%',
                    sorter: (a, b) => compareByAlph(a.ActionName, b.ActionName),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_20').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }
                },
                {
                    title: (<div className="ttu tc">Note</div>),
                    key: 'ActionNote',
                    dataIndex: 'ActionNote',
                    className: 'topupcol_21',
                    render: (str) => {
                        if(str && !_.isEmpty(str)) {
                            let max_character = 70
                            if(str.length >= max_character) {
                                let str_ellipsis = str.substr(0, max_character)
                                return <Popover content={<div style={{ width: '300px' }}>{str}</div>} placement="left">{`${str_ellipsis}...`}</Popover> 
                            } else {
                                return str
                            }
                        }
                    }
                }
            ]
        }
    ],
    crm_lotsummary: [
        {
            title: 'Name',
            key: 'ResponseLabel',
            dataIndex: 'ResponseLabel',
            className: 'ttu pointer'
        },
        {
            title: 'Unit',
            key: 'TotalAction',
            dataIndex: 'TotalAction',
            className: 'ttu tc pointer'
        },
        {
            title: 'Est. Amt',
            key: 'TopUpAmt',
            dataIndex: 'TopUpAmt',
            className: 'ttu tr pointer',
            render: (num) => {
                return `${roundFixed(num, 2)} Mb`
            }
        },
        {
            title: '%Ach',
            key: 'TotalAch',
            dataIndex: 'TotalAch',
            className: 'ttu tc pointer',
            render: (per) => {
                return `${roundFixed(per, 2)}%`
            }
        }
    ],
    crm_leadsummary: [
        {
            title: 'Name',
            key: 'ResponseLabel',
            dataIndex: 'ResponseLabel',
            className: 'ttu pointer'
        },
        {
            title: 'Unit',
            key: 'TotalAction',
            dataIndex: 'TotalAction',
            className: 'ttu tc pointer'
        },
        // {
        //     title: 'Est. Amt',
        //     key: 'TopUpAmt',
        //     dataIndex: 'TopUpAmt',
        //     className: 'ttu tr pointer',
        //     render: (num) => {
        //         return `${roundFixed(num, 2)} Mb`
        //     }
        // },
        {
            title: '%Share',
            key: 'TotalAch',
            dataIndex: 'TotalAch',
            className: 'ttu tc pointer',
            render: (per) => {
                return `${roundFixed(per, 0)}%`
            }
        }
    ],
    crm_topupsummary: [
        {
            title: 'Name',
            key: 'ResponseLabel',
            dataIndex: 'ResponseLabel',
            className: 'ttu pointer'
        },
        {
            title: 'Unit',
            key: 'TotalAction',
            dataIndex: 'TotalAction',
            className: 'ttu tc pointer'
        },
        {
            title: 'Est. Amt',
            key: 'TopUpAmt',
            dataIndex: 'TopUpAmt',
            className: 'ttu tr pointer',
            render: (num) => {
                return `${roundFixed(num, 2)} Mb`
            }
        },
        {
            title: '%Share',
            key: 'TotalAch',
            dataIndex: 'TotalAch',
            className: 'ttu tc pointer',
            render: (per) => {
                return `${roundFixed(per, 0)}%`
            }
        }
    ],
    grid_channel: [
        {
            title: (<div className="ttu tc"><Icon type="desktop" style={{ fontSize: '1.2em' }} /></div>),
            key: 'Preview',
            dataIndex: 'Preview',
            className: 'lead_ch_1 v-mid tc',
            width: '30px'
        },
        {
            title: (<div className="ttu tc"><Icon type="swap" style={{ fontSize: '1.2em' }} /></div>),
            key: 'Assignment',
            dataIndex: 'Assignment',
            className: 'lead_ch_2 v-mid tc',
            width: '30px'
        },
        {
            title: (<div>Import<br/>Date</div>),
            key: 'ImportDate',
            dataIndex: 'ImportDate',
            className: 'lead_ch_3 v-mid ttu tc pointer',
            width: '75px',
            sorter: (a, b) => compareByDate(a.ImportDate, b.ImportDate),
            onHeaderCell: () => {
                return {
                    onClick: () => {
                        let element = $('th.ant-table-column-has-filters.lead_ch_3').find('.ant-table-column-sorter > span')
                        headAutoSort(element)                    
                    }
                }
            },
            render: (str_date) => {
                return (str_date && !_.isEmpty(str_date)) ? moment(str_date).format('DD/MM/YYYY') : null
            }            
        },
        {
            title: 'Customer Info',
            key: 'CustomerInfo',
            dataIndex: 'CustomerInfo',
            className: 'ttu tc',
            children: [
                {
                    title: (<div className="ttu tc">Name</div>),
                    key: 'CustomerName',
                    dataIndex: 'CustomerName',
                    className: `lead_ch_4 v-mid pointer ${cls['lead_custname_ellipsis']}`,
                    width: '7%',
                    sorter: (a, b) => compareByAlph(a.CustomerName, b.CustomerName),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_4').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str) => {
                        return (<Popover content={<span className="f7">{str}</span>}>{str}</Popover>)
                    }        
                },
                {
                    title: (<div className="ttu tc">Product</div>),
                    key: 'ProductDigit',
                    dataIndex: 'ProductDigit',
                    className: 'lead_ch_5 v-mid pointer tc',
                    width: '65px',
                    sorter: (a, b) => compareByAlph(a.ProductSeq, b.ProductSeq),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_5').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str, rowsData) => {
                        return (<Popover content={<span className="f7">{rowsData.Product}</span>}>{str}</Popover>)
                    } 
                },
                {
                    title: (<div className="ttu tc">Business</div>),
                    key: 'BusinessType',
                    dataIndex: 'BusinessType',
                    className: `lead_ch_6 v-mid pointer ${cls['lead_custname_ellipsis']}`,
                    width: '5%',
                    sorter: (a, b) => compareByAlph(a.BusinessType, b.BusinessType),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_6').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str) => {
                        return (<Popover content={<span className="f7">{str}</span>}>{str}</Popover>)
                    }                  
                },
                {
                    title: (<div className="ttu tc">Location</div>),
                    key: 'Province',
                    dataIndex: 'Province',
                    className: `lead_ch_7 v-mid pointer ${cls['lead_custname_ellipsis']}`,
                    width: '5%',
                    sorter: (a, b) => compareByAlph(a.Province, b.Province),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_7').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }                 
                },
                {
                    title: (<div>Revenue</div>),
                    key: 'MinimumRevenue',
                    dataIndex: 'MinimumRevenue',
                    className: 'lead_ch_8 v-mid ttu tr pointer',
                    width: '57px',
                    sorter: (a, b) => compareByAmount(a.MinimumRevenue, b.MinimumRevenue), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_8').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (mini_revenue) => {
                        return (mini_revenue && mini_revenue > 0) ? parseNumberShortNew(mini_revenue) : 0
                    }            
                },
                {
                    title: 'Rank',
                    key: 'Ranking',
                    dataIndex: 'Ranking',
                    className: 'lead_ch_9 v-mid ttu tc pointer',
                    width: '40px',
                    sorter: (a, b) => compareByAlph(a.Ranking, b.Ranking),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_9').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (rank, rowsData) => {
                        let content = (rowsData && rowsData.RankingDesc) ? rowsData.RankingDesc : ''
                        return (<Popover content={`${content}`}>{(rank && rank) ? rank : ''}</Popover>)
                    }              
                }
            ]
        },
        {
            title: 'Employee Info',
            key: 'EmployeeInfo',
            dataIndex: 'EmployeeInfo',
            className: 'ttu tc',
            children: [
                {
                    title: (<div className="ttu tc">Source</div>),
                    key: 'SourceChannel',
                    dataIndex: 'SourceChannel',
                    className: 'lead_ch_10 v-mid tc pointer',
                    width: '50px',
                    sorter: (a, b) => compareByAlph(a.SourceChannel, b.SourceChannel),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_10').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str, rowsData) => {
                        let label = (rowsData && rowsData.SourceLabel) ? rowsData.SourceLabel : str
                        return (<Popover content={`${(rowsData && !_.isEmpty(rowsData.DataSource)) ? rowsData.DataSource : '-'}`}>{label}</Popover>)
                    }
                },
                {
                    title: 'CH',
                    key: 'ReferredChannelNew',
                    dataIndex: 'ReferredChannelNew',
                    className: 'lead_ch_11 v-mid ttu tc pointer',
                    width: '40px',
                    sorter: (a, b) => compareByAlph(a.ReferredChannelNew, b.ReferredChannelNew),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_11').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    } 
                },
                {
                    title: 'Team',
                    key: 'BranchDigit',
                    dataIndex: 'BranchDigit',
                    className: 'lead_ch_12 v-mid ttu tc pointer',
                    width: '45px',
                    sorter: (a, b) => compareByAlph(a.BranchDigit, b.BranchDigit),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_12').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str, rowsData) => {
                        return (<Popover content={<span className="f7">{rowsData.BranchName}</span>}>{str}</Popover>)
                    }  
                },
                {
                    title: 'RM',
                    key: 'EmpName',
                    dataIndex: 'EmpName',
                    className: `lead_ch_13 v-mid ttu pointer ${cls['lead_empname_ellipsis']}`,
                    width: '5%',
                    sorter: (a, b) => compareByAlph(a.EmpName, b.EmpName),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_13').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str, rowsData) => {               
                        let content = (
                            <div>
                                <div className="ttu">Name : {str}</div>
                                <div className="ttu">Mobile : {(rowsData && rowsData.EmpMobile) ? handleTelephone(_.padStart(String(rowsData.EmpMobile), 10, '0')) : '-'}</div>
                            </div>
                        )

                        return (<Popover content={<span className="f7">{content}</span>}>{str}</Popover>)
                    }
                }
            ]
        },
        {
            title: 'Process Info',
            key: 'ProcessInfo',
            dataIndex: 'ProcessInfo',
            className: 'ttu tc',
            children: [
                {
                    title: 'RM Onhand',
                    key: 'RMOnhand',
                    dataIndex: 'RMOnhand',
                    className: 'ttu tc pointer',
                    children: [
                        {
                            title: (<div className="ttu tc">Date</div>),
                            key: 'RMOnhandStatusDate',
                            dataIndex: 'RMOnhandStatusDate',
                            className: 'lead_ch_14 ttu tc pointer',
                            width: `70px`,
                            sorter: (a, b) => compareByDate(a.RMOnhandStatusDate, b.RMOnhandStatusDate),
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.lead_ch_14').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            },
                            render: (str_date) => {
                                return (str_date && !_.isEmpty(str_date)) ? moment(str_date).format('DD/MM/YYYY') : null
                            }                 
                        },
                        {
                            title: (<div className="ttu tc">Status</div>),
                            key: 'RMOnhandStatus',
                            dataIndex: 'RMOnhandStatus',
                            className: `lead_ch_15 ttu tc pointer ${cls['lead_custname_ellipsis']}`,
                            width: '80px',
                            sorter: (a, b) => compareByAlph(a.RMOnhandStatus, b.RMOnhandStatus),
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.lead_ch_15').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            },
                            render: (str) => {
                                return (<Popover content={<span className="f7">{str}</span>}>{str}</Popover>)
                            }     
                        },
                        {
                            title: (<div className="tc"><Icon type="clock-circle" /></div>),
                            key: 'RMOnhandStatusTime',
                            dataIndex: 'RMOnhandStatusTime',
                            className: `lead_ch_16 ttu tc pointer`,
                            width: '30px',
                            sorter: (a, b) => compareByAmount(a.RMOnhandStatusTime, b.RMOnhandStatusTime), 
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.lead_ch_16').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            }  
      
                        }
                    ]              
                },
                {
                    title: 'CA Decision',
                    key: 'CADecision',
                    dataIndex: 'CADecision',
                    className: 'ttu tc pointer',
                    children: [
                        {
                            title: (<div className="ttu tc">Date</div>),
                            key: 'CAOnhandDate',
                            dataIndex: 'CAOnhandDate',
                            className: 'lead_ch_17 ttu tc pointer',
                            width: `70px`,
                            sorter: (a, b) => compareByDate(a.CAOnhandDate, b.CAOnhandDate),
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.lead_ch_17').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            },
                            render: (str_date) => {
                                return (str_date && !_.isEmpty(str_date)) ? moment(str_date).format('DD/MM/YYYY') : null
                            }             
                        },
                        {
                            title: (<div className="ttu tc">ST</div>),
                            key: 'CAOnhandStatus',
                            dataIndex: 'CAOnhandStatus',
                            className: 'lead_ch_18 ttu tc pointer',    
                            width: '30px',
                            sorter: (a, b) => compareByAlph(a.CAOnhandStatus, b.CAOnhandStatus),
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.lead_ch_18').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            },
                            render: (str, rowsData) => {
                                let reason = (rowsData && rowsData.StatusReason) ? rowsData.StatusReason : null
                                if(reason && !_.isEmpty(reason)) {
                                    return (
                                        <Popover content={<d className="f7">{reason}</d>}>
                                            <span className="ba bl-0 bt-0 br-0 b--dotted b--black-30">{str}</span>
                                        </Popover>
                                    )    
                                } else {
                                    return str
                                }
                                
                            }
                        },
                        {
                            title: (<div className="tc"><Icon type="clock-circle" /></div>),
                            key: 'CAOnhandTime',
                            dataIndex: 'CAOnhandTime',
                            className: `lead_ch_19 ttu tc pointer ${cls['br1']}`,
                            width: '30px',
                            sorter: (a, b) => compareByAmount(a.CAOnhandTime, b.CAOnhandTime), 
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.lead_ch_19').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            }               
                        }
                    ]                
                }
            ]
        },
        {
            title: 'Action Info',
            key: 'ActionInfo',
            dataIndex: 'ActionInfo',
            className: 'ttu tc',
            children: [
                {
                    title: 'Latest',
                    key: 'TimelineActionLatestDate',
                    dataIndex: 'TimelineActionLatestDate',
                    className: 'lead_ch_20 ttu tc v-mid pointer',
                    width: '5.5%',
                    sorter: (a, b) => compareByDate(a.TimelineActionLatestDate, b.TimelineActionLatestDate),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_20').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str_date) => {
                        return (str_date && !_.isEmpty(str_date)) ? moment(str_date).format('DD/MM/YYYY') : null 
                    }
                },
                {
                    title: (<Icon type="clock-circle-o" />),
                    key: 'TimelineActionSLA',
                    dataIndex: 'TimelineActionSLA',
                    className: 'lead_ch_21 ttu tc v-mid pointer',
                    width: '2.5%',                    
                    sorter: (a, b) => compareByAmount(a.TimelineActionSLA, b.TimelineActionSLA), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_21').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }         
                },
                {
                    title: 'Response',
                    key: 'ResponseLabel',
                    dataIndex: 'ResponseLabel',
                    className: 'lead_ch_22 ttu v-mid pointer',
                    width: '5%',
                    sorter: (a, b) => compareByAlph(a.ResponseSeq, b.ResponseSeq),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_22').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (resp_label, rowsData) => {
                        let resp_reason = (rowsData && rowsData.TimelineActionName) ? rowsData.TimelineActionName : ''
                        if(!_.isEmpty(resp_reason)) {
                            return (<Popover content={<div className="f7" style={{ maxWidth: '300px' }}>{resp_reason}</div>} placement="left">{resp_label}</Popover>)
                        } else {
                            return resp_label
                        }
                        
                    }
                },
                {
                    title: (<span className="ttu">Reason</span>),
                    key: 'TimelineActionNote',
                    dataIndex: 'TimelineActionNote',
                    className: 'lead_ch_23 v-mid',
                    render: (str_note) => {
                        let is_longchar = (str_note && str_note.length > 35) ? true : false
                        let action_note = (str_note && str_note.length > 35) ? `${str_note.substr(0, 35)}...` : str_note
                    
                        return (is_longchar) ? (<Popover content={<div className="f7" style={{ maxWidth: '300px' }}>{str_note}</div>} placement="left">{action_note}</Popover>) : action_note
                    }                
                }
            ]
        }
    ],
    grid_new_topup: [
        {
            title: (<div className="ttu tc"><Icon type="desktop" style={{ fontSize: '1.2em' }} /></div>),
            key: 'Preview',
            dataIndex: 'Preview',
            className: 'lead_newtopup_1 v-mid tc',
            width: '30px'
        },
        {
            title: (<div className="ttu tc"><Icon type="alert" style={{ fontSize: '1.2em' }} /></div>),
            key: 'CustAlert',
            dataIndex: 'CustAlert',
            className: `lead_newtopup_2 ${cls['v-mid']} ttu tc pointer`,
            width: '2.5%',
            render: (str, rowsData) => {
                if(rowsData && rowsData.Prohibite == 1) {
                    return (
                        <Popover content={<div className="f7" style={{ maxWidth: '300px' }}>ลูกค้าปฏิเสธสินเชื่อและไม่อนุญาตให้ติดต่อเพื่อเสนอสินเชื่อ</div>} placement="left">
                            <Icon type="warning" className="red" style={{ fontSize: '1.3em' }} />
                        </Popover>
                    )
                } else {
                    return (<div style={{ color: '#006400' }}>{(rowsData && !_.isEmpty(rowsData.IsExisting)) ? rowsData.IsExisting : ''}</div>)
                }
                
            }
            // sorter: (a, b) => compareByNumber(a.CustAlert, b.LotNo), 
            // onHeaderCell: () => {
            //     return {
            //         onClick: () => {
            //             let element = $('th.ant-table-column-has-filters.lead_newtopup_3').find('.ant-table-column-sorter > span')
            //             headAutoSort(element)                    
            //         }
            //     }
            // }
        },
        {
            title: (<div>Import<br/>Date</div>),
            key: 'DateImport',
            dataIndex: 'DateImport',
            className: 'lead_newtopup_3 v-mid ttu tc pointer',
            width: '75px',
            sorter: (a, b) => compareByDate(a.DateImport, b.DateImport),
            onHeaderCell: () => {
                return {
                    onClick: () => {
                        let element = $('th.ant-table-column-has-filters.lead_newtopup_3').find('.ant-table-column-sorter > span')
                        headAutoSort(element)                    
                    }
                }
            },
            render: (str_date) => {
                return (str_date && !_.isEmpty(str_date)) ? moment(str_date).format('DD/MM/YYYY') : null
            }            
        },        
        {
            title: 'Customer Info',
            key: 'CustomerInfo',
            dataIndex: 'CustomerInfo',
            className: 'ttu tc',
            children: [
                {
                    title: (<div className="ttu tc">Name</div>),
                    key: 'CustomerName',
                    dataIndex: 'CustomerName',
                    className: `lead_newtopup_4 v-mid pointer ${cls['lead_custname_ellipsis']}`,
                    width: '7%',
                    sorter: (a, b) => compareByAlph(a.CustomerName, b.CustomerName),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_newtopup_4').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str) => {
                        return (<Popover content={<span className="f7">{str}</span>}>{str}</Popover>)
                    }        
                },
                {
                    title: (<div className="ttu tc">Product</div>),
                    key: 'ProductDesc',
                    dataIndex: 'ProductDesc',
                    className: `lead_newtopup_5 v-mid pointer ${cls['lead_productname_ellipsis']}`,
                    width: '65px',
                    sorter: (a, b) => compareByAlph(a.ProductDesc, b.ProductDesc),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_newtopup_5').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str) => {
                        return (<Popover content={<span className="f7">{str}</span>}>{str}</Popover>)
                    }
                },
                {
                    title: (<div className="ttu tc">Business</div>),
                    key: 'BusinessType',
                    dataIndex: 'BusinessType',
                    className: `lead_newtopup_6 v-mid pointer ${cls['lead_custname_ellipsis']}`,
                    width: '5%',
                    sorter: (a, b) => compareByAlph(a.BusinessType, b.BusinessType),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_newtopup_6').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str) => {
                        return (<Popover content={<span className="f7">{str}</span>}>{str}</Popover>)
                    }                  
                },
                {
                    title: (<div className="ttu tc">Location</div>),
                    key: 'Province',
                    dataIndex: 'Province',
                    className: `lead_newtopup_7 v-mid pointer ${cls['lead_custname_ellipsis']}`,
                    width: '5%',
                    sorter: (a, b) => compareByAlph(a.Province, b.Province),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_newtopup_7').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }                 
                }
            ]
        },
        {
            title: 'Top-Up (Est.)',
            key: 'TopUpInfo',
            dataIndex: 'TopUpInfo',
            className: 'ttu tc',
            children: [
                {
                    title: (<div className="ttu">Amt</div>),
                    key: 'TopUpAmt',
                    dataIndex: 'TopUpAmt',
                    className: 'lead_newtopup_8 v-mid tr pointer',
                    width: '57px',
                    sorter: (a, b) => compareByAmount(a.TopUpAmt, b.TopUpAmt), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_newtopup_8').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (topup_amt) => {
                        return (topup_amt && topup_amt > 0) ? `${topup_amt}Mb` : '0Mb'
                    }            
                },
                {
                    title: "% UP",
                    key: 'FactorPercent',
                    dataIndex: 'FactorPercent',
                    className: 'lead_newtopup_9 v-mid ttu tc pointer',
                    width: '50px',
                    sorter: (a, b) => compareByAlph(a.FactorPercent, b.FactorPercent),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_newtopup_9').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (rank) => {
                        return `${(rank) ? rank : 0}%`
                    }              
                }
            ]
        },
        {
            title: 'Employee Info',
            key: 'EmployeeInfo',
            dataIndex: 'EmployeeInfo',
            className: 'ttu tc',
            children: [
                {
                    title: 'CH',
                    key: 'RegionGroup',
                    dataIndex: 'RegionGroup',
                    className: 'lead_newtopup_11 v-mid ttu tc pointer',
                    width: '40px',
                    sorter: (a, b) => compareByAlph(a.RegionGroup, b.RegionGroup),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_newtopup_11').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    } 
                },
                {
                    title: 'Team',
                    key: 'BranchDigit',
                    dataIndex: 'BranchDigit',
                    className: 'lead_newtopup_12 v-mid ttu tc pointer',
                    width: '45px',
                    sorter: (a, b) => compareByAlph(a.BranchDigit, b.BranchDigit),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_newtopup_12').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    } 
                },
                {
                    title: 'Mgr.',
                    key: 'ManagerName',
                    dataIndex: 'ManagerName',
                    className: `lead_newtopup_13 v-mid ttu pointer ${cls['lead_empname_ellipsis']}`,
                    width: '5%',
                    sorter: (a, b) => compareByAlph(a.ManagerName, b.ManagerName),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_newtopup_13').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str, rowsData) => {               
                        let content = (
                            <div>
                                <div className="ttu">Name : {str}</div>
                                <div className="ttu">Mobile : {(rowsData && rowsData.ManagerMobile) ? handleTelephone(_.padStart(String(rowsData.ManagerMobile), 10, '0')) : '-'}</div>
                            </div>
                        )

                        return (<Popover content={<span className="f7">{content}</span>}>{str}</Popover>)
                    }
                },
                {
                    title: 'RM',
                    key: 'Sale_CurrentName',
                    dataIndex: 'Sale_CurrentName',
                    className: `lead_newtopup_ch_14 v-mid ttu pointer ${cls['lead_empname_ellipsis']}`,
                    width: '5%',
                    sorter: (a, b) => compareByAlph(a.Sale_CurrentName, b.Sale_CurrentName),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_newtopup_14').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str, rowsData) => {               
                        let content = (
                            <div>
                                <div className="ttu">Name : {str}</div>
                                <div className="ttu">Mobile : {(rowsData && rowsData.EmpMobile) ? handleTelephone(_.padStart(String(rowsData.EmpMobile), 10, '0')) : '-'}</div>
                            </div>
                        )

                        return (<Popover content={<span className="f7">{content}</span>}>{str}</Popover>)
                    }
                }
            ]
        },
        {
            title: 'Process Info',
            key: 'ProcessInfo',
            dataIndex: 'ProcessInfo',
            className: 'ttu tc',
            children: [
                {
                    title: 'RM Onhand',
                    key: 'RMOnhand',
                    dataIndex: 'RMOnhand',
                    className: 'ttu tc pointer',
                    children: [
                        {
                            title: (<div className="ttu tc">Date</div>),
                            key: 'RMOnhandStatusDate',
                            dataIndex: 'RMOnhandStatusDate',
                            className: 'lead_newtopup_15 ttu tc pointer',
                            width: `70px`,
                            sorter: (a, b) => compareByDate(a.RMOnhandStatusDate, b.RMOnhandStatusDate),
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.lead_newtopup_15').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            },
                            render: (str_date) => {
                                return (str_date && !_.isEmpty(str_date)) ? moment(str_date).format('DD/MM/YYYY') : null
                            }                 
                        },
                        {
                            title: (<div className="ttu tc">Status</div>),
                            key: 'RMOnhandStatus',
                            dataIndex: 'RMOnhandStatus',
                            className: `lead_newtopup_16 ttu tc pointer ${cls['lead_custname_ellipsis']}`,
                            width: '80px',
                            sorter: (a, b) => compareByAlph(a.RMOnhandStatus, b.RMOnhandStatus),
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.lead_newtopup_16').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            },
                            render: (str) => {
                                return (<Popover content={<span className="f7">{str}</span>}>{str}</Popover>)
                            }     
                        },
                        {
                            title: (<div className="tc"><Icon type="clock-circle" /></div>),
                            key: 'RMOnhandStatusTime',
                            dataIndex: 'RMOnhandStatusTime',
                            className: `lead_newtopup_17 ttu tc pointer`,
                            width: '30px',
                            sorter: (a, b) => compareByAmount(a.RMOnhandStatusTime, b.RMOnhandStatusTime), 
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.lead_newtopup_18').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            }  
      
                        }
                    ]              
                },
                {
                    title: 'CA Decision',
                    key: 'CADecision',
                    dataIndex: 'CADecision',
                    className: 'ttu tc pointer',
                    children: [
                        {
                            title: (<div className="ttu tc">Date</div>),
                            key: 'CAOnhandDate',
                            dataIndex: 'CAOnhandDate',
                            className: 'lead_newtopup_19 ttu tc pointer',
                            width: `70px`,
                            sorter: (a, b) => compareByDate(a.CAOnhandDate, b.CAOnhandDate),
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.lead_newtopup_19').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            },
                            render: (str_date) => {
                                return (str_date && !_.isEmpty(str_date)) ? moment(str_date).format('DD/MM/YYYY') : null
                            }             
                        },
                        {
                            title: (<div className="ttu tc">ST</div>),
                            key: 'CAOnhandStatus',
                            dataIndex: 'CAOnhandStatus',
                            className: 'lead_newtopup_20 ttu tc pointer',    
                            width: '30px',
                            sorter: (a, b) => compareByAlph(a.CAOnhandStatus, b.CAOnhandStatus),
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.lead_newtopup_20').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            },
                            render: (str, rowsData) => {
                                let reason = (rowsData && rowsData.StatusReason) ? rowsData.StatusReason : null
                                if(reason && !_.isEmpty(reason)) {
                                    return (
                                        <Popover content={<d className="f7">{reason}</d>}>
                                            <span className="ba bl-0 bt-0 br-0 b--dotted b--black-30">{str}</span>
                                        </Popover>
                                    )    
                                } else {
                                    return str
                                }
                                
                            }
                        },
                        {
                            title: (<div className="tc"><Icon type="clock-circle" /></div>),
                            key: 'CAOnhandTime',
                            dataIndex: 'CAOnhandTime',
                            className: `lead_newtopup_21 ttu tc pointer ${cls['br1']}`,
                            width: '30px',
                            sorter: (a, b) => compareByAmount(a.CAOnhandTime, b.CAOnhandTime), 
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.lead_newtopup_21').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            }               
                        }
                    ]                
                }
            ]
        },
        {
            title: 'Action Info',
            key: 'ActionInfo',
            dataIndex: 'ActionInfo',
            className: 'ttu tc',
            children: [
                {
                    title: 'Latest',
                    key: 'TimelineActionLatestDate',
                    dataIndex: 'TimelineActionLatestDate',
                    className: 'lead_newtopup_22 ttu tc v-mid pointer',
                    width: '5.5%',
                    sorter: (a, b) => compareByDate(a.TimelineActionLatestDate, b.TimelineActionLatestDate),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_newtopup_22').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str_date) => {
                        return (str_date && !_.isEmpty(str_date)) ? moment(str_date).format('DD/MM/YYYY') : null 
                    }
                },
                {
                    title: (<Icon type="clock-circle-o" />),
                    key: 'TimelineActionSLA',
                    dataIndex: 'TimelineActionSLA',
                    className: 'lead_newtopup_23 ttu tc v-mid pointer',
                    width: '2.5%',                    
                    sorter: (a, b) => compareByAmount(a.TimelineActionSLA, b.TimelineActionSLA), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_newtopup_23').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }         
                },
                {
                    title: 'Response',
                    key: 'ResponseLabel',
                    dataIndex: 'ResponseLabel',
                    className: 'lead_newtopup_24 ttu v-mid pointer',
                    width: '5%',
                    sorter: (a, b) => compareByAlph(a.ResponseSeq, b.ResponseSeq),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_newtopup_24').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (resp_label, rowsData) => {
                        let resp_reason = (rowsData && rowsData.TimelineActionName) ? rowsData.TimelineActionName : ''
                        if(!_.isEmpty(resp_reason)) {
                            return (<Popover content={<div className="f7" style={{ maxWidth: '300px' }}>{resp_reason}</div>} placement="left">{resp_label}</Popover>)
                        } else {
                            return resp_label
                        }
                        
                    }
                },
                {
                    title: (<span className="ttu">Reason</span>),
                    key: 'TimelineActionNote',
                    dataIndex: 'TimelineActionNote',
                    className: 'lead_newtopup_25 v-mid',
                    render: (str_note) => {
                        let is_longchar = (str_note && str_note.length > 35) ? true : false
                        let action_note = (str_note && str_note.length > 35) ? `${str_note.substr(0, 35)}...` : str_note
                    
                        return (is_longchar) ? (<Popover content={<div className="f7" style={{ maxWidth: '300px' }}>{str_note}</div>} placement="left">{action_note}</Popover>) : action_note
                    }                
                }
            ]
        }
    ],
    grid_channelv2: [
        {
            title: (<div className="ttu tc"><Icon type="desktop" style={{ fontSize: '1.2em' }} /></div>),
            key: 'Preview',
            dataIndex: 'Preview',
            className: 'lead_ch_1 v-mid tc',
            width: '30px'
        },
        {
            title: (<div className="ttu tc"><Icon type="swap" style={{ fontSize: '1.2em' }} /></div>),
            key: 'Assignment',
            dataIndex: 'Assignment',
            className: 'lead_ch_2 v-mid tc',
            width: '30px'
        },
        {
            title: (<div>Create<br/>Date</div>),
            key: 'LeadCreateDate',
            dataIndex: 'LeadCreateDate',
            className: 'lead_ch_3 v-mid ttu tc pointer',
            width: '75px',
            sorter: (a, b) => compareByDate(a.LeadCreateDate, b.LeadCreateDate),
            onHeaderCell: () => {
                return {
                    onClick: () => {
                        let element = $('th.ant-table-column-has-filters.lead_ch_3').find('.ant-table-column-sorter > span')
                        headAutoSort(element)                    
                    }
                }
            },
            render: (str_date) => {
                return (str_date && !_.isEmpty(str_date)) ? moment(str_date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : null
            }            
        },
        {
            title: 'Customer Info',
            key: 'CustomerInfo',
            dataIndex: 'CustomerInfo',
            className: 'ttu tc',
            children: [                
                {
                    title: (<div className="ttu tc">Name</div>),
                    key: 'CustomerName',
                    dataIndex: 'FullCustomerName',
                    className: `lead_ch_4 v-mid pointer ${cls['lead_custname_ellipsis']}`,
                    width: '7%',
                    sorter: (a, b) => compareByAlph(a.FullCustomerName, b.FullCustomerName),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_4').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str) => {
                        return (<Popover content={<span className="f7">{str}</span>}>{str}</Popover>)
                    }        
                },                   
                {
                    title: (<div className="ttu tc">Location</div>),
                    key: 'Province',
                    dataIndex: 'Province',
                    className: `lead_ch_7 v-mid pointer ${cls['lead_custname_ellipsis']}`,
                    width: '5%',
                    sorter: (a, b) => compareByAlph(a.Province, b.Province),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_7').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }                 
                },
                {
                    title: (<div>Request</div>),
                    key: 'RequestLoan',
                    dataIndex: 'RequestLoan',
                    className: 'lead_ch_8 v-mid ttu tr pointer',
                    width: '57px',
                    sorter: (a, b) => compareByAmount(a.RequestLoan, b.RequestLoan), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_8').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (revenue) => {
                        return (revenue && revenue > 0) ? parseNumberShortNew(revenue) : 0
                    }            
                },
                {
                    title: (<div className="ttu tc">CH</div>),
                    key: 'ChannelDigit',
                    dataIndex: 'ChannelDigit',
                    className: 'lead_ch_10 v-mid tc pointer',
                    width: '50px',
                    sorter: (a, b) => compareByAlph(a.ChannelID, b.ChannelID),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_10').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str, rowsData) => {
                        return (<Popover content={`${(rowsData && !_.isEmpty(rowsData.ChannelName)) ? rowsData.ChannelName : '-'}`}>{str}</Popover>)
                    }
                },
                {
                    title: (<div className="ttu tc">Source</div>),
                    key: 'SourceDigit',
                    dataIndex: 'SourceDigit',
                    className: 'lead_ch_10 v-mid tc pointer',
                    width: '50px',
                    sorter: (a, b) => compareByAlph(a.SourceSeq, b.SourceSeq),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_10').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str, rowsData) => {
                        return (<Popover content={`${(rowsData && !_.isEmpty(rowsData.SourceName)) ? rowsData.SourceName : '-'}`}>{str}</Popover>)
                    }
                }
            ]
        },
        {
            title: 'Product Info',
            key: 'ProductInfo',
            dataIndex: 'ProductInfo',
            className: 'ttu tc',
            children: [
                {
                    title: (<div className="ttu tc">Type</div>),
                    key: 'ProductDigit',
                    dataIndex: 'ProductDigit',
                    className: 'lead_ch_5 v-mid pointer tc',
                    width: '65px',
                    sorter: (a, b) => compareByAlph(a.ProductSeq, b.ProductSeq),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_5').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str, rowsData) => {
                        return (<Popover content={<span className="f7">{rowsData.ProductNameEng}</span>}>{str}</Popover>)
                    } 
                },            
                {
                    title: (<div className="ttu tc">Campagin</div>),
                    key: 'CampaignCode',
                    dataIndex: 'CampaignCode',
                    className: 'lead_ch_5 v-mid pointer tc',
                    width: '65px',
                    sorter: (a, b) => compareByAlph(a.CampaignID, b.CampaignID),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_5').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str, rowsData) => {
                        return (<Popover content={<span className="f7">{rowsData.CampaignName}</span>}>{str}</Popover>)
                    } 
                }
            ]
        },
        {
            title: 'Employee Info',
            key: 'EmployeeInfo',
            dataIndex: 'EmployeeInfo',
            className: 'ttu tc',
            children: [                
                {
                    title: 'CH',
                    key: 'SaleChannelID',
                    dataIndex: 'SaleChannelID',
                    className: 'lead_ch_11 v-mid ttu tc pointer',
                    width: '40px',
                    sorter: (a, b) => compareByAlph(a.SaleChannelID, b.SaleChannelID),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_11').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    } 
                },
                {
                    title: 'Team',
                    key: 'TeamDigit',
                    dataIndex: 'TeamDigit',
                    className: 'lead_ch_12 v-mid ttu tc pointer',
                    width: '45px',
                    sorter: (a, b) => compareByAlph(a.TeamSeq, b.TeamSeq),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_12').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str, rowsData) => {
                        return (<Popover content={<span className="f7">{rowsData.BranchName}</span>}>{str}</Popover>)
                    }  
                },
                {
                    title: 'Sale',
                    key: 'EmployeeName',
                    dataIndex: 'EmployeeName',
                    className: `lead_ch_13 v-mid ttu pointer ${cls['lead_empname_ellipsis']}`,
                    width: '5%',
                    sorter: (a, b) => compareByAlph(a.EmployeeCode, b.EmployeeCode),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_13').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str, rowsData) => {               
                        let content = (
                            <div>
                                <div className="ttu">Name : {str}</div>
                                <div className="ttu">Mobile : {(rowsData && rowsData.EmpMobile) ? handleTelephone(_.padStart(String(rowsData.EmpMobile), 10, '0')) : '-'}</div>
                            </div>
                        )

                        return (<Popover content={<span className="f7">{content}</span>}>{str}</Popover>)
                    }
                }
            ]
        },
        {
            title: 'Process Info',
            key: 'ProcessInfo',
            dataIndex: 'ProcessInfo',
            className: 'ttu tc',
            children: [
                {
                    title: 'RM Onhand',
                    key: 'RMOnhand',
                    dataIndex: 'RMOnhand',
                    className: 'ttu tc pointer',
                    children: [
                        {
                            title: (<div className="ttu tc">Date</div>),
                            key: 'RMOnhandStatusDate',
                            dataIndex: 'RMOnhandStatusDate',
                            className: 'lead_ch_14 ttu tc pointer',
                            width: `70px`,
                            sorter: (a, b) => compareByDate(a.RMOnhandStatusDate, b.RMOnhandStatusDate),
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.lead_ch_14').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            },
                            render: (str_date) => {
                                return (str_date && !_.isEmpty(str_date)) ? moment(str_date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : null
                            }                 
                        },
                        {
                            title: (<div className="ttu tc">Status</div>),
                            key: 'RMOnhandStatus',
                            dataIndex: 'RMOnhandStatus',
                            className: `lead_ch_15 ttu tc pointer ${cls['lead_custname_ellipsis']}`,
                            width: '80px',
                            sorter: (a, b) => compareByAlph(a.RMOnhandStatus, b.RMOnhandStatus),
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.lead_ch_15').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            },
                            render: (str) => {
                                return (<Popover content={<span className="f7">{str}</span>}>{str}</Popover>)
                            }     
                        },
                        {
                            title: (<div className="tc"><Icon type="clock-circle" /></div>),
                            key: 'RMOnhandStatusTime',
                            dataIndex: 'RMOnhandStatusTime',
                            className: `lead_ch_16 ttu tc pointer`,
                            width: '30px',
                            sorter: (a, b) => compareByAmount(a.RMOnhandStatusTime, b.RMOnhandStatusTime), 
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.lead_ch_16').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            }  
      
                        }
                    ]              
                },
                {
                    title: 'CA Decision',
                    key: 'CADecision',
                    dataIndex: 'CADecision',
                    className: 'ttu tc pointer',
                    children: [
                        {
                            title: (<div className="ttu tc">Date</div>),
                            key: 'CAOnhandDate',
                            dataIndex: 'CAOnhandDate',
                            className: 'lead_ch_17 ttu tc pointer',
                            width: `70px`,
                            sorter: (a, b) => compareByDate(a.CAOnhandDate, b.CAOnhandDate),
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.lead_ch_17').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            },
                            render: (str_date) => {
                                return (str_date && !_.isEmpty(str_date)) ? moment(str_date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : null
                            }             
                        },
                        {
                            title: (<div className="ttu tc">ST</div>),
                            key: 'CAOnhandStatus',
                            dataIndex: 'CAOnhandStatus',
                            className: 'lead_ch_18 ttu tc pointer',    
                            width: '30px',
                            sorter: (a, b) => compareByAlph(a.CAOnhandStatus, b.CAOnhandStatus),
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.lead_ch_18').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            },
                            render: (str, rowsData) => {
                                let reason = (rowsData && rowsData.StatusReason) ? rowsData.StatusReason : null
                                if(reason && !_.isEmpty(reason)) {
                                    return (
                                        <Popover content={<d className="f7">{reason}</d>}>
                                            <span className="ba bl-0 bt-0 br-0 b--dotted b--black-30">{str}</span>
                                        </Popover>
                                    )    
                                } else {
                                    return str
                                }
                                
                            }
                        },
                        {
                            title: (<div className="tc"><Icon type="clock-circle" /></div>),
                            key: 'CAOnhandTime',
                            dataIndex: 'CAOnhandTime',
                            className: `lead_ch_19 ttu tc pointer ${cls['br1']}`,
                            width: '30px',
                            sorter: (a, b) => compareByAmount(a.CAOnhandTime, b.CAOnhandTime), 
                            onHeaderCell: () => {
                                return {
                                    onClick: () => {
                                        let element = $('th.ant-table-column-has-filters.lead_ch_19').find('.ant-table-column-sorter > span')
                                        headAutoSort(element)                    
                                    }
                                }
                            }               
                        }
                    ]                
                }
            ]
        },
        {
            title: 'Action Info',
            key: 'ActionInfo',
            dataIndex: 'ActionInfo',
            className: 'ttu tc',
            children: [
                {
                    title: 'Latest',
                    key: 'TimelineActionLatestDate',
                    dataIndex: 'TimelineActionLatestDate',
                    className: 'lead_ch_20 ttu tc v-mid pointer',
                    width: '5.5%',
                    sorter: (a, b) => compareByDate(a.TimelineActionLatestDate, b.TimelineActionLatestDate),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_20').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (str_date) => {
                        return (str_date && !_.isEmpty(str_date)) ? moment(str_date, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') : null 
                    }
                },
                {
                    title: (<Icon type="clock-circle-o" />),
                    key: 'TimelineActionSLA',
                    dataIndex: 'TimelineActionSLA',
                    className: 'lead_ch_21 ttu tc v-mid pointer',
                    width: '2.5%',                    
                    sorter: (a, b) => compareByAmount(a.TimelineActionSLA, b.TimelineActionSLA), 
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.topupcol_21').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    }         
                },
                {
                    title: 'Response',
                    key: 'ResponseLabel',
                    dataIndex: 'ResponseLabel',
                    className: 'lead_ch_22 ttu v-mid pointer',
                    width: '5%',
                    sorter: (a, b) => compareByAlph(a.ResponseSeq, b.ResponseSeq),
                    onHeaderCell: () => {
                        return {
                            onClick: () => {
                                let element = $('th.ant-table-column-has-filters.lead_ch_22').find('.ant-table-column-sorter > span')
                                headAutoSort(element)                    
                            }
                        }
                    },
                    render: (resp_label, rowsData) => {
                        let resp_reason = (rowsData && rowsData.TimelineActionName) ? rowsData.TimelineActionName : ''
                        if(!_.isEmpty(resp_reason)) {
                            return (<Popover content={<div className="f7" style={{ maxWidth: '300px' }}>{resp_reason}</div>} placement="left">{resp_label}</Popover>)
                        } else {
                            return resp_label
                        }
                        
                    }
                },
                {
                    title: (<span className="ttu">Reason</span>),
                    key: 'TimelineActionNote',
                    dataIndex: 'TimelineActionNote',
                    className: 'lead_ch_23 v-mid',
                    render: (str_note) => {
                        let is_longchar = (str_note && str_note.length > 35) ? true : false
                        let action_note = (str_note && str_note.length > 35) ? `${str_note.substr(0, 35)}...` : str_note
                    
                        return (is_longchar) ? (<Popover content={<div className="f7" style={{ maxWidth: '300px' }}>{str_note}</div>} placement="left">{action_note}</Popover>) : action_note
                    }                
                }
            ]
        }
    ]
}

const headAutoSort = (element) => {
    if(element) {
        let el1_class = (element[0]) ? element[0].className.split(" ") : null
        let el2_class = (element[1]) ? element[1].className.split(" ") : null

        if(!in_array('on', el1_class) && !in_array('on', el2_class)) {
            $(element[0]).click()
        } else {
            if(in_array('on', el1_class)) {
                $(element[1]).click()
            }
            if(in_array('on', el2_class)) {
                $(element[0]).click()
            }
        }
    } else {
        console.log('not found element.')
    }
    
}

const handleCustName = (str) => {
    if(str && !_.isEmpty(str)) {
        let prefix = str.split(' ')
        if(in_array(prefix[0], ['นาย', 'นาง', 'นางสาว', 'น.ส.', 'บริษัท' , 'ห้างหุ้นส่วนจำกัด', 'ม.ล.'])) {
            return `${prefix[1]} ${prefix[2]}`
        } else {
            return str
        }
    }
}

const handleTelephone = (numno) => {
    let number_phone = `${numno.trim()}`
    
    let patt = new RegExp("-")
    if(patt.test(number_phone)) {
        number_phone = number_phone.replace('-', '')
    }

    if(number_phone) {
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

const handleLeftTimeColor = (t) => {
    if(t && t >= 0) {
        if(t > 30) {
            return (<span style={{ color: '#008000' }}>{t}</span>)
        } else if(t > 15 && t <= 30) {
            return (<span style={{ color: '#faad14' }}>{t}</span>)
        }  else if(t > 0 && t <= 15) {
            return (<span style={{ color: '#f5222d' }}>{t}</span>)
        } else {
            return t
        }
    } else {
        return 0
    }
    
}