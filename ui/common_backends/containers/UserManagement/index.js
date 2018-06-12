import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Avatar, Tooltip, Badge, Popover, Button, Timeline, Icon, Popconfirm, notification, Collapse, Table } from 'antd'

import QueueAnim from 'rc-queue-anim'
import FontAwesome from 'react-fontawesome'
import Scrollbar from 'react-smooth-scrollbar'
import moment from 'moment'
import _ from 'lodash'

import {
    getMasterData,
    getMasterEmployee,
} from '../../actions/master'

import EditFormUser from './editForm'

import styles from './index.scss'

const Panel = Collapse.Panel


class UserManagementApp extends Component {

    state = {
        editColumn: null,
        columns: [{
            title: 'Employee Code',
            dataIndex: 'EmpCode',
            key: 'EmpCode'
        }, {
            title: 'Name',
            dataIndex: 'NameTH',
            key: 'NameTH',
        }, {
            title: 'Work Status',
            dataIndex: 'WorkingStatus',
            key: 'WorkingStatus',
        }, {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Icon onClick={() => this.setEditColumn(record)} type="solution" />
            )
        }]
    }

    componentWillMount() {
        this.props.getMasterData()
        this.props.getMasterEmployee()
    }

    setEditColumn = editColumn => this.setState({ editColumn })

    handleOk = (obj) => {
        console.log(obj)
    }

    render() {
        const { MASTER_EMPLOYEE_DATA } = this.props

        return (
            <div style={{ position: 'relative', minHeight: 'calc(100% - 16px)' }}>
                <QueueAnim type="bottom" duration={800} >
                    <div key="1" style={{ display: 'flex', background: '#FFF', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100%', width: '100%', marginTop: '16px' }}>
                        <span style={{ fontSize: '18px', color: '#797979', textShadow: 'rgba(105, 105, 105, 0.13) 1px 1px', margin: '10px' }}>
                            <FontAwesome name="calendar" style={{ color: '#009688', marginRight: '10px' }} />
                            <span>User Management</span>
                        </span>
                        <div className={styles['content']}>
                            <div><span>User Management</span></div>
                            <div>
                                <Table
                                    columns={this.state.columns}
                                    dataSource={MASTER_EMPLOYEE_DATA} />
                            </div>
                        </div>
                    </div>
                </QueueAnim>
                {
                    this.state.editColumn &&
                    <div className={styles['modal-user-management']} id="m-user-management">
                        <div id="mask-modal-user-management"></div>
                    </div>
                }
                {
                    this.state.editColumn &&
                    <EditFormUser data={this.state.editColumn} handleOk={this.handleOk} handleCancel={() => this.setEditColumn(null)} />
                }
            </div>
        )
    }
}

export default connect(
    (state) => ({
        AUTH_INFO: state.AUTH_INFO,
        MASTER_EMPLOYEE_DATA: state.MASTER_EMPLOYEE_DATA
    }),
    {
        getMasterData: getMasterData,
        getMasterEmployee: getMasterEmployee
    })(UserManagementApp)