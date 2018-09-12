import React from 'react'
import { Popover, Tooltip, Icon } from 'antd'
import { roundFixed, numberWithCommas } from './funcitonal'
import moment from 'moment'
import _ from 'lodash'

import 'moment/locale/th'

import cls from './columns.scss'

export const columns = {
    crm_customer_list: [
        {
            title: (<i className="fa fa-hashtag pointer" aria-hidden="true"></i>),
            key: 'RunNo',
            dataIndex: 'RunNo',
            className: 'v-mid ttu tc',
            width: '3%'
        },
        {
            title: (<i className="fa fa-television pointer" aria-hidden="true"></i>),
            key: 'CustProfile',
            dataIndex: 'CustProfile',
            className: 'v-mid ttu tc',
            width: '2%'
        },
        // {
        //     title: 'Customer Info',
        //     dataIndex: 'CustomerInfo',
        //     className: 'ttu tc',
        //     children: [
                
               
        //     ]
        // },
        {
            title: (<div>Customer<br/>Name</div>),
            key: 'AC_Name',
            dataIndex: 'AC_Name',
            className: `${cls['customer_ellipsis']} v-mid ttu pointer`,
            width: '10%',
            render: (str) => {
                let hasMultiName = str.match(/,/i)
                if(!_.isEmpty(hasMultiName)) {                            
                    let splitName = str.split(',')
                    let custname = <div>{ _.map(splitName, (v, i) => { return (<div key={(i + 1)}>{ v }</div>) }) }</div>
                    return <Popover content={custname}>{(!_.isEmpty(splitName[0])) ? splitName[0] : ''}</Popover>
                } else {
                    return <Popover content={str}>{str}</Popover> 
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
                    className: 'ttu tr pointer',
                    width: '5%',
                    render: (num) => {
                        return `${numberWithCommas(roundFixed(num, 0))}`
                    }
                },
                {
                    title: '% Up',
                    key: 'CustTopUpPercent',
                    dataIndex: 'FactorPercent',
                    className: 'ttu tc pointer',
                    width: '3%',
                    render: (num) => {
                        return `${roundFixed(num, 2)}%`
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
                    className: 'ttu tc pointer',
                    width: '5%',
                    render: (str) => {
                        return (!_.isEmpty(str)) ? moment().format('DD/MM/YY') : null
                    }
                },
                {
                    title: 'Limit',
                    key: 'DrawdownAmt',
                    dataIndex: 'DrawdownAmt',
                    className: 'ttu tc pointer',
                    width: '3.5%'
                },
                {
                    title: 'O/S',
                    key: 'OSBal',
                    dataIndex: 'OSBal',
                    className: 'ttu tc pointer',
                    width: '3.5%'
                },
                {
                    title: 'Repay',
                    key: 'RepayPercent',
                    dataIndex: 'RepayPercent',
                    className: 'ttu tc pointer',
                    width: '4%',
                    render: (num, rowsData) => {
                        let repay_amt = (rowsData && rowsData.RepayAmt > 0 || rowsData.RepayAmt > 0.00) ? rowsData.RepayAmt : 0
                        return (<Tooltip title={`Repay Amount : ${roundFixed(repay_amt, 2)}Mb`} placement="top">{`${roundFixed(num, 1)}%`}</Tooltip>)
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
                    className: 'ttu tc pointer',
                    width: '3.5%'
                },
                {
                    title: 'C_LTV',
                    key: 'C_LTV',
                    dataIndex: 'C_LTV',
                    className: 'ttu tc pointer',
                    width: '3.5%',
                    render: (num) => {
                        return `${roundFixed(num, 1)}%`
                    }
                },
                {
                    title: 'N_LTV',
                    key: 'N_LTV',
                    dataIndex: 'N_LTV',
                    className: 'ttu tc pointer',
                    width: '3.5%',
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
                    className: 'ttu tc pointer',
                    width: '3%'
                },
                {
                    title: 'Team',
                    key: 'BranchDigit',
                    dataIndex: 'BranchDigit',
                    className: 'ttu tc pointer',
                    width: '4%',
                    render: (str, rowsData) => {
                        let branch_name = (!_.isEmpty(rowsData.BranchName)) ? rowsData.BranchName : null
                        if(!_.isEmpty(branch_name))
                            return (<Tooltip title={branch_name} placement="top">{str}</Tooltip>)
                        else 
                            return null
                    }
                },
                {
                    title: 'Mgr.',
                    key: 'ManagerName',
                    dataIndex: 'ManagerName',
                    className: `${cls['empname_ellipsis']} ttu pointer`,
                    width: '4%',
                    render: (str) => {
                        let name = (str) ? str.split(' ')[0] : ''
                        return <Popover content={str}>{name}</Popover> 
                    }
                },
                {
                    title: 'RM',
                    key: 'Sale_CurrentName',
                    dataIndex: 'Sale_CurrentName',
                    className: `${cls['empname_ellipsis']} ttu pointer`,
                    width: '8%',
                    render: (str) => {
                        return <Popover content={str}>{str}</Popover> 
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
                    className: 'ttu tc pointer',
                    width: '5%',
                    render: (str) => {
                        return (!_.isEmpty(str)) ? moment().format('DD/MM/YY') : null
                    }
                },
                {
                    title: (<Icon type="clock-circle-o" />),
                    key: 'ActionSLA',
                    dataIndex: 'ActionSLA',
                    className: 'ttu tc pointer',
                    width: '2.5%',
                    render: (str, rowsData) => {
                        return (rowsData && !_.isEmpty(rowsData.ActionLatestDate)) ? str : null
                    }
                },
                {
                    title: 'Response',
                    key: 'ResponseLabel',
                    dataIndex: 'ResponseLabel',
                    className: 'ttu pointer',
                    width: '5%'
                },
                {
                    title: 'Reason',
                    key: 'ActionName',
                    dataIndex: 'ActionName',
                    className: 'ttu pointer',
                    width: '12%'
                },
                {
                    title: (<div className="ttu tc">Note</div>),
                    key: 'ActionNote',
                    dataIndex: 'ActionNote',
                    className: 'pointer'
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
    ]
}