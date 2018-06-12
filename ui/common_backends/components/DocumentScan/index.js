import React, { ReactDOM, Component } from 'react'
import { render } from 'react-dom'
import { LocaleProvider, DatePicker, Table, Spin, Icon, Form, Row, Col, Input, Select, Radio, Checkbox, Button, notification } from 'antd'
import QueueAnim from 'rc-queue-anim'

import CategoryTreeView from './TreeView'

import cls from './index.scss'

const w50 = 50
const standardWidthFix = 75

export const columns = [
    {
        title: 'Scan Start',
        dataIndex: 'CreateScanDate',
        className: `ttu`,
        children: [
            {
                title: (<Icon type="laptop" />),
                dataIndex: 'Monitor',
                className: 'ttu'
            },
            {
                title: 'DATE',
                dataIndex: 'ScanDate',
                className: 'ttu'
            },
            {
                title: (<Icon type="dashboard" />),
                dataIndex: 'ScanTiming',
                className: 'ttu',
                render: (str_per) => {
                    return (str_per) ? `${roundFixed(str_per, 0)}%` : `0%`
                }
            }
        ]
    },
    {
        title: 'Progress Information',
        dataIndex: 'ProgressInfo',
        className: `ttu`,
        children: [
            {
                title: (<Icon type="upload" />),
                dataIndex: 'FileUpload',
                className: 'ttu'
            },
            {
                title: (<i className="fa fa-circle" />),
                dataIndex: 'ProgressColor',
                className: 'ttu'
            },
            {
                title: 'Action',
                dataIndex: 'Action',
                className: 'ttu'
            }
        ]
    },
    {
        title: 'Appraisal Information',
        dataIndex: 'AppraisalInfo',
        className: `ttu`,
        children: [
            {
                title: 'Date',
                dataIndex: 'AppraisalDate',
                className: 'ttu'
            },
            {
                title: (<i className="fa fa-circle" />),
                dataIndex: 'AppraisalProgressColor',
                className: 'ttu'
            },
            {
                title: 'Received',
                dataIndex: 'ReceivedDate',
                className: 'ttu'
            },
            {
                title: 'Name',
                dataIndex: 'ReceivedName',
                className: 'ttu'
            }
        ]
    },
    {
        title: 'Customer Information',
        dataIndex: 'CustomerInfo',
        className: `ttu`,
        children: [
            {
                title: (<i className="icon-copy" />),
                dataIndex: 'MissingDoc',
                className: 'ttu'
            },
            {
                title: 'App No',
                dataIndex: 'ApplicationNo',
                className: 'ttu'
            },
            {
                title: (<i className="fa fa-users" />),
                dataIndex: 'BorrowerAmount',
                className: 'ttu'
            }
        ]
    },
    {
        title: 'Branch Information',
        dataIndex: 'BranchInfo',
        className: `ttu`,
        children: [
            {
                title: 'Branch',
                dataIndex: 'BranchName',
                className: 'ttu'
            },
            {
                title: 'Name',
                dataIndex: 'EmployeeName',
                className: 'ttu'
            }
        ]
    },
    {
        title: 'ST',
        dataIndex: 'Status',
        className: `ttu`,
        width: w50
    },
    {
        title: (<i className="icon-new-tab" />),
        dataIndex: 'link',
        className: `ttu`
    },
]

class GridDocument extends Component {

    render() {
        return (
            <div style={{ position: 'relative', minHeight: 'calc(100% - 16px)' }}>
                <CategoryTreeView />
                <QueueAnim type="bottom" duration={800} >
                    <div key="1" className={`${cls['grid_container']}`}>
                        <h3 className={cls['grid_title']}>SCAN MONITOR DASHBOARD</h3>
                        <Table
                            className={cls['grid_table']}
                            rowKey={this.handleRowKey}
                            columns={columns}
                            dataSource={[]}
                            loading={false}
                            pagination={{}}
                            footer={this.handleFooter}
                            size="small"
                            bordered
                        />
                    </div>
                </QueueAnim>
            </div>

        )
    }

    handleRowKey = (records, i) => { return (records && records.RowID) ? `${records.RowID}_${(i + 1)}` : 0 }
    handleFooter = (currentPageData) => { }

}

export default GridDocument

